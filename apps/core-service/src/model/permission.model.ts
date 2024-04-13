import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_permission')
export class PermissionModel extends BaseModel {
  @Expose()
  id: string;

  @Expose({ name: 'nav_id' })
  navId: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  memo: string;
}
