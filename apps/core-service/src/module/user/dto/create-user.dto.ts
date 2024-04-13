import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length, IsDefined, ValidateIf } from '@common/validator';
import { UpdateUserDto } from './update-user.dto';

export class CreateUserDto extends PartialType(UpdateUserDto) {
  @IsString()
  @IsDefined({ message: '账号不能为空' })
  @Length(2, 20, {
    message: '账号长度在2-20之间'
  })
  account: string;

  @ValidateIf((object, value) => value !== null)
  telephone: string;

  @ValidateIf((object, value) => value !== null)
  name: string;
}
