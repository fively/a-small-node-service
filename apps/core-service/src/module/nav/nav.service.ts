import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectKnex, Knex } from '@db';
import { NavModel } from '@/model';
import { CreateNavDto } from './dto';
import { RequestContextDto, UtilsService } from '@common';

@Injectable()
export class NavService {
  @InjectKnex() private readonly db: Knex;

  /**
   * 查询导航列表
   * @returns
   */
  async query(): Promise<Array<NavModel>> {
    const result = await this.db(NavModel.tableName).where({ status: 1, deleted: 0 }).orderBy('order', 'asc').select();
    return NavModel.toEntity(result);
  }

  /**
   * 创建导航
   * @param createNavDto
   * @param ctx
   * @returns
   */
  async create(createNavDto: CreateNavDto, ctx: RequestContextDto): Promise<boolean> {
    const { moduleId, pid, pidPath, code, name, icon, path, order, memo, status } = createNavDto;
    const { user } = ctx;

    try {
      const navCode = await this.db(NavModel.tableName).where({ code, status: 1, deleted: 0 }).first();
      if (navCode) {
        throw `导航编码[${code}]已存在`;
      }

      await this.db(NavModel.tableName).insert({
        id: UtilsService.uuid(),
        module_id: moduleId,
        pid,
        pid_path: pidPath,
        code,
        name,
        icon,
        path,
        order,
        memo,
        status,
        create_user_id: user.userId,
        create_fullname: user.userName,
        update_user_id: user.userId,
        update_fullname: user.userName
      });

      return true;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
