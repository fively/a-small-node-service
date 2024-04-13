import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsDefined, IsString, Length, ValidateIf } from 'class-validator';
import { UpdateAppModuleDto } from './update-app-module.dto';

/**
 * 登录实体
 */
export class CreateAppModuleDto extends PartialType(OmitType(UpdateAppModuleDto, ['id'])) {
  @IsString()
  @IsDefined({ message: '模块编码不能为空' })
  @Length(2, 20, {
    message: '模块编码长度在2-20之间'
  })
  code: string;

  @ValidateIf((object, value) => value !== null)
  name: string;

  @ValidateIf((object, value) => value !== null)
  url: string;

  @ValidateIf((object, value) => value !== null)
  baseRoute: string;
}
