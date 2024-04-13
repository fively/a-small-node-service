import { Expose, Exclude, Transform, Type, plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

export abstract class BaseModel {
  @Expose({ name: 'create_user_id', toPlainOnly: true })
  createUserId: string;

  @Expose({ name: 'create_fullname', toPlainOnly: true })
  createFullName: string;

  @Expose({ name: 'create_time' })
  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''), { toClassOnly: true })
  createTime: Dayjs;

  @Expose({ name: 'update_user_id', toPlainOnly: true })
  updateUserId: string;

  @Expose({ name: 'update_fullname', toPlainOnly: true })
  updateFullName: string;

  @Expose({ name: 'update_time', toPlainOnly: true })
  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''), { toClassOnly: true })
  updateTime: Dayjs;

  @Expose()
  status: number;

  @Exclude()
  deleted: number;

  /**
   * 提供获取表名称方式
   */
  @Expose()
  static get tableName(): string {
    const name = Reflect.getMetadata('tableName', this);
    if (!name) {
      throw Error(`类${this.name}未设置对象映射表名的关系`);
    }
    return name;
  }

  /**
   * 将SQL数据转换为对应实体对象数据
   * @param this
   * @param tableData SQL查询数据
   * @returns
   */
  static toEntity<T extends BaseModel>(this: new (...args: any[]) => T, tableData: object): any {
    return plainToInstance(this, tableData, { excludeExtraneousValues: true });
  }
}
