import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

/**
 * 分页参数
 */
export class PaginationParamDto {
  @ApiPropertyOptional({
    description: '页码',
    type: Number
  })
  @IsOptional() // 可选参数
  @IsPositive() // 是否为正数
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page: number = 1;

  @ApiPropertyOptional({
    description: '每页显示数',
    type: Number
  })
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional() // 可选参数
  @IsPositive() // 是否为正数
  limit: number = 50;
}
