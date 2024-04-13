import { IsString, Length, IsEmail, IsNumber, IsDefined, IsPhone, IsDate } from '@common/validator';

/**
 * 更新用户对象实体
 */
export class UpdateUserDto {
  @IsString()
  @IsDefined({ message: '手机号码不能为空' })
  @IsPhone({ message: '手机号码格式不正确' })
  telephone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsDefined({ message: '姓名不能为空' })
  @Length(2, 20, {
    message: '账号长度在2-20之间'
  })
  name: string;

  @IsNumber()
  sex: number;

  @IsDate({ message: '出生日期格式[YYYY-MM-DD]格式不正确' })
  birth: Date;

  @IsString()
  @Length(0, 100, {
    message: '备注信息在0-100之间'
  })
  memi: string;
}
