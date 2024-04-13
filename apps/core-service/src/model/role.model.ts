import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_role')
export class RoleModel extends BaseModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  memo: string;
}
