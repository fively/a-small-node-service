import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService, UtilsService } from '@common';
import { InjectKnex, Knex } from '@db';
import { AclService, AuthService } from '@auth';
import {
  UserModel,
  AppModuleModel,
  NavModel,
  RoleModel,
  UserRoleModel,
  RolePermissionModel,
  PermissionModel,
  RoleNavModel
} from '@/model';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  @InjectKnex() private readonly db: Knex;

  @Inject(CryptoService)
  private readonly cryptoService: CryptoService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(AclService)
  private readonly aclService: AclService;

  /**
   * 用户登录验证
   * @param account
   * @param password
   * @returns
   */
  async validateUser(account: string, password: string): Promise<string> {
    const user = await this.db(UserModel.tableName).where({ account, status: 1, deleted: 0 }).first();
    if (!user) {
      throw new InternalServerErrorException('用户名/密码错误');
    }

    try {
      const originalPassword = await this.cryptoService.decrypt(password);
      const hash = this.cryptoService.encrypt(originalPassword, user.salt);

      if (hash !== user.password) {
        throw '用户名/密码错误';
      }

      if (user.status === 2) {
        throw '账号已被锁定，请联系管理员';
      }

      if (user.status === 3) {
        throw '账号已停用，请联系管理员';
      }

      const roleIds = await this.getUserRole(user.id);

      return await this.authService.setCacheUser({
        userId: user.id,
        userName: user.name,
        account: user.account,
        roles: roleIds
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * 添加用户信息
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<number> {
    const { account } = createUserDto;
    const _user = await this.getUserByAccount(account);
    if (_user) {
      throw new InternalServerErrorException(`登录账号[${account}]已存在，请更换`);
    }

    const originalPassword = await this.cryptoService.decrypt(this.configService.get('APPLICATION.defaultPwd'));
    const salt = this.cryptoService.randomSalt();
    const hash = this.cryptoService.encrypt(originalPassword, salt);

    const id = UtilsService.uuid();

    return this.db(UserModel.tableName).insert({
      ...createUserDto,
      id,
      password: hash,
      salt: salt,
      header: '',
      dept_id: '000001',
      memo: '',
      status: 0,
      deleted: 0
    });
  }

  /**
   * 根据登录账号获取用户信息
   * @param account
   * @returns
   */
  async getUserByAccount(account: string): Promise<UserModel> {
    const _user = this.db(UserModel.tableName).where({ account: account, deleted: 0 }).first();
    if (!_user) return null;

    return UserModel.toEntity(_user);
  }

  /**
   * 获取用户角色
   * @param userId 用户ID
   * @returns 返回角色ID列表
   */
  async getUserRole(userId: string): Promise<Array<string>> {
    const roles = await this.db({ ur: UserRoleModel.tableName })
      .innerJoin({ r: RoleModel.tableName }, 'ur.role_id', 'r.id')
      .where({ 'ur.user_id': userId, 'ur.status': 1, 'ur.deleted': 0, 'r.status': 1, 'r.deleted': 0 })
      .select({ id: 'r.id', name: 'r.name' });
    if (!roles) return [];

    return roles.map(r => r.id);
  }

  /**
   * 获取用户导航(全量)
   * @param userId 用户ID
   * @param roles 角色列表
   * @returns
   */
  async getModuleNav(userId: string): Promise<{ modules: Array<AppModuleModel>; navs: Array<NavModel> }> {
    const cacheNav = await this.aclService.getCacheNav(userId);

    if (cacheNav) {
      return cacheNav;
    }

    const modulePromise = this.db(AppModuleModel.tableName)
      .where({ status: 0, deleted: 0 })
      .orderBy('order', 'asc')
      .select();
    const navPromise = this.db(NavModel.tableName).where({ status: 0, deleted: 0 }).orderBy('order', 'asc').select();
    const result = await Promise.all([modulePromise, navPromise]);

    const userNav = {
      modules: AppModuleModel.toEntity(result[0]),
      navs: NavModel.toEntity(result[1])
    };

    await this.aclService.setCacheNav(userId, userNav);

    return userNav;
  }

  /**
   * 获取用户权限
   * @param userId 用户ID
   * @param roles 角色列表
   * @returns
   */
  async getUserPermission(userId: string, roles: Array<string>): Promise<Array<RolePermissionModel>> {
    const cachePermission = await this.aclService.getCachePermission(userId);

    if (cachePermission) {
      return cachePermission;
    }

    const result = await this.db({ r: RoleModel.tableName })
      .innerJoin({ rpm: RolePermissionModel.tableName }, 'r.id', 'rpm.role_id')
      .innerJoin({ p: PermissionModel.tableName }, 'rpm.permission_id', 'p.id')
      .innerJoin({ n: NavModel.tableName }, 'p.nav_id', 'n.id')
      .where({
        'r.status': 1,
        'r.deleted': 0,
        'rpm.status': 1,
        'rpm.deleted': 0,
        'p.status': 1,
        'p.deleted': 0,
        'n.status': 1,
        'n.deleted': 0
      })
      .whereIn('r.id', roles)
      .groupBy('p.id')
      .select({
        role_id: 'r.id',
        nav_id: 'n.id',
        nav_code: 'n.code',
        permission_id: 'p.id',
        permission_code: 'p.code',
        create_time: 'rpm.create_time'
      });

    const permission = RolePermissionModel.toEntity(result);

    await this.aclService.setCachePermission(userId, permission);

    return permission;
  }

  /**
   * 获取用户导航权限
   * @param userId
   * @param roles
   * @returns
   */
  async getUserNav(userId: string, roles: Array<string>): Promise<Array<RolePermissionModel>> {
    const cacheNav = await this.aclService.getCacheNav(userId);

    if (cacheNav) {
      return cacheNav;
    }

    const result = await this.db({ r: RoleModel.tableName })
      .innerJoin({ rnm: RoleNavModel.tableName }, 'r.id', 'rnm.role_id')
      .innerJoin({ n: NavModel.tableName }, 'rnm.nav_id', 'n.id')
      .where({
        'r.status': 1,
        'r.deleted': 0,
        'rnm.status': 1,
        'rnm.deleted': 0,
        'n.status': 1,
        'n.deleted': 0
      })
      .whereIn('r.id', roles)
      .groupBy('n.id')
      .select({
        role_id: 'r.id',
        nav_id: 'n.id',
        nav_code: 'n.code',
        create_time: 'rnm.create_time'
      });

    const navs = RoleNavModel.toEntity(result);

    await this.aclService.setCacheNav(userId, navs);

    return navs;
  }
}
