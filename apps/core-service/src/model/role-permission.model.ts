import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_role_permission_map')
export class RolePermissionModel extends BaseModel {
  @Expose()
  id: string;

  @Expose({ name: 'role_id' })
  roleId: string;

  @Expose({ name: 'nav_id' })
  navId: string;

  @Expose({ name: 'nav_code' })
  navCode: string;

  @Expose({ name: 'permission_id' })
  permissionId: string;

  @Expose({ name: 'permission_code' })
  permissionCode: string;
}
