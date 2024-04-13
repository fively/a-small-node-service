import { IsString, Length, IsNumber, IsDefined, IsBoolean } from '@common/validator';

/**
 * 更新用户对象实体
 */
export class UpdateAppModuleDto {
  @IsString()
  @IsDefined({ message: '模块ID不能为空' })
  public id: string;

  @IsString()
  @IsDefined({ message: '模块名称不能为空' })
  @Length(2, 20, {
    message: '账号长度在2-20之间'
  })
  name: string;

  @IsString()
  @IsDefined({ message: '模块地址不能为空' })
  @Length(2, 256, {
    message: '模块地址长度在2-256之间'
  })
  url: string;

  @IsString()
  @IsDefined({ message: '基础路由不能为空' })
  @Length(2, 256, {
    message: '基础路由长度在2-128之间'
  })
  baseRoute: string;

  @IsBoolean()
  isMain: boolean;

  @IsNumber()
  order: number;

  @IsString()
  @Length(0, 100, {
    message: '备注信息长度在0-256之间'
  })
  memo: string;

  @IsNumber()
  status: number;
}
