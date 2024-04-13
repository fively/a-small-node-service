import { Expose } from 'class-transformer';
import { BaseModel, Table } from '@db';

@Table('ss_module')
export class AppModuleModel extends BaseModel {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  url: string;

  @Expose({ name: 'base_route' })
  baseRoute: string;

  @Expose({ name: 'is_main' })
  isMain: string;

  @Expose({ name: 'is_destroy' })
  isDestroy: string;

  @Expose()
  order: number;

  @Expose()
  memo: string;
}
