import { IsDefined, IsString, Length } from 'class-validator';

/**
 * 登录实体
 */
export class AuthCredentialsDto {
  @IsString()
  @IsDefined({ message: '账号不能为空' })
  @Length(2, 32, {
    message: '账号长度在 2-32 之间'
  })
  account: string;

  @IsString()
  @IsDefined({ message: '密码不能为空' })
  @Length(6, 256, {
    message: '密码长度不能小于6位'
  })
  password: string;
}
