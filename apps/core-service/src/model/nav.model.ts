import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_nav')
export class NavModel extends BaseModel {
  @Expose()
  id: string;

  @Expose({ name: 'pid' })
  parentId: string;

  @Expose({ name: 'pid_path' })
  parentIds: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  icon: string;

  @Expose()
  path: string;

  @Expose()
  order: number;

  @Expose()
  memo: string;
}
