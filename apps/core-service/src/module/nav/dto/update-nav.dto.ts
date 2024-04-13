import { IsString, Length, IsNumber, IsDefined } from '@common/validator';

/**
 * 更新用户对象实体
 */
export class UpdateNavDto {
  @IsString()
  @IsDefined({ message: '导航ID不能为空' })
  public id: string;

  @IsString()
  @IsDefined({ message: '所属模块不能为空' })
  @Length(2, 36, {
    message: '所属模块长度在2-36之间'
  })
  moduleId: string;

  @IsString()
  @Length(0, 36, {
    message: '上级导航长度不能超过36字符'
  })
  pid: string;

  @IsString()
  pidPath: string;

  @IsString()
  @IsDefined({ message: '导航名称不能为空' })
  @Length(2, 36, {
    message: '导航名称长度在2-20之间'
  })
  name: string;

  @IsString()
  @Length(0, 36, {
    message: '图标长度不能超过36字符'
  })
  icon: string;

  @IsString()
  @Length(0, 128, {
    message: '导航地址不能超过128字符'
  })
  path: string;

  @IsNumber()
  order: number;

  @IsString()
  @Length(0, 256, {
    message: '备注信息长度不能超过128字符'
  })
  memo: string;

  @IsNumber()
  status: number;
}
