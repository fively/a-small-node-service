import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectKnex, Knex, CacheService } from '@db';
import { AppModuleModel } from '@/model';
import { RequestContextDto, UtilsService } from '@common';
import { CreateAppModuleDto, UpdateAppModuleDto } from './dto';

@Injectable()
export class AppModuleService {
  @InjectKnex() private readonly db: Knex;

  @Inject(CacheService)
  private readonly cacheService: CacheService;

  /**
   * 模块缓存KEY
   */
  private readonly cacheKey: string = '';

  /**
   * 获取模块信息
   * @returns
   */
  async query(): Promise<Array<AppModuleModel>> {
    // const cacheModules = await this.cacheService.get(this.cacheKey);
    // if (Array.isArray(cacheModules) && cacheModules.length > 0) {
    //   return cacheModules;
    // }

    const result = await this.db(AppModuleModel.tableName)
      .where({ status: 1, deleted: 0 })
      .orderBy('order', 'asc')
      .select();

    const _modules = AppModuleModel.toEntity(result);

    // 数据存储缓存
    // await this.cacheService.set(this.cacheKey, _modules, 172800);

    return _modules;
  }

  /**
   * 创建模块
   * @param createAppModuleDto
   * @param ctx
   */
  async create(createAppModuleDto: CreateAppModuleDto, ctx: RequestContextDto): Promise<boolean> {
    const { code, name, url, baseRoute, isMain, order, memo, status } = createAppModuleDto;
    const { user } = ctx;

    try {
      const moduleCode = await this.db(AppModuleModel.tableName).where({ code, status: 1, deleted: 0 }).first();
      if (moduleCode) {
        throw `模块编码[${code}]已存在`;
      }

      await this.db(AppModuleModel.tableName).insert({
        id: UtilsService.uuid(),
        code,
        name,
        url,
        base_route: baseRoute,
        is_main: isMain ? 1 : 0,
        order,
        memo,
        status,
        create_user_id: user.userId,
        create_fullname: user.userName,
        update_user_id: user.userId,
        update_fullname: user.userName
      });

      // await this.cacheService.del(this.cacheKey);

      return true;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 更新模块
   * @param updateAppModuleDto
   * @param ctx
   */
  async update(updateAppModuleDto: UpdateAppModuleDto, ctx: RequestContextDto): Promise<boolean> {
    const { id, name, url, baseRoute, isMain, order, memo, status } = updateAppModuleDto;
    const { user } = ctx;
    try {
      await this.db(AppModuleModel.tableName)
        .update({
          name,
          url,
          base_route: baseRoute,
          is_main: isMain ? 1 : 0,
          order,
          memo,
          status,
          update_user_id: user.userId,
          update_fullname: user.userName
        })
        .where({ id });

      // await this.cacheService.del(this.cacheKey);

      return true;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 删除平台模块
   * @param id
   * @param ctx
   * @returns
   */
  async delete(id: string, ctx: RequestContextDto): Promise<boolean> {
    if (!id) {
      throw new HttpException('模块编码不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { user } = ctx;

    try {
      await this.db(AppModuleModel.tableName)
        .update({
          deleted: 1,
          update_user_id: user.userId,
          update_fullname: user.userName
        })
        .where({ id });

      // await this.cacheService.del(this.cacheKey);

      return true;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
