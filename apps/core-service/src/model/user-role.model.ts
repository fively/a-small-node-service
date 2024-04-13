import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_user_role_map')
export class UserRoleModel extends BaseModel {
  @Expose()
  id: string;

  @Expose({ name: 'user_id' })
  userId: string;

  @Expose({ name: 'role_id' })
  roleId: string;
}
