import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsDefined, IsString, Length, ValidateIf } from 'class-validator';
import { UpdateNavDto } from './update-nav.dto';

/**
 * 登录实体
 */
export class CreateNavDto extends PartialType(OmitType(UpdateNavDto, ['id'])) {
  @ValidateIf((object, value) => value !== null)
  moduleId: string;

  @IsString()
  @IsDefined({ message: '导航编码不能为空' })
  @Length(2, 36, {
    message: '导航编码长度在2-36之间'
  })
  code: string;

  @ValidateIf((object, value) => value !== null)
  name: string;
}
