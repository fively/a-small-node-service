import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_role_nav_map')
export class RoleNavModel extends BaseModel {
  @Expose()
  id: string;

  @Expose({ name: 'role_id' })
  roleId: string;

  @Expose({ name: 'nav_id' })
  navId: string;

  @Expose({ name: 'nav_code' })
  navCode: string;
}
