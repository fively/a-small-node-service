import { Expose, Exclude, Transform, Type } from 'class-transformer';
import { BaseModel, Table } from '@db';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

@Table('ss_user')
export class UserModel extends BaseModel {
  @Expose()
  id: string;

  @Expose()
  account: string;

  @Expose()
  telephone: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  @Expose()
  name: string;

  @Expose()
  header: string;

  @Expose()
  sex: string;

  @Expose()
  @Type(() => Date)
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'), { toClassOnly: true })
  birth: Dayjs;

  @Expose()
  mobile: string;

  @Expose({ name: 'dept_id' })
  deptId: string;

  @Expose()
  memo: string;
}
