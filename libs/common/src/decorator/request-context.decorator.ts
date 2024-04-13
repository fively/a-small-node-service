import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContextDto } from '../dto';
import { UtilsService } from '../utils/utils.service';

/**
 * 根据请求信息创建请求体
 */
export const RequestContext = createParamDecorator((data: any, ctx: ExecutionContext): RequestContextDto => {
  return UtilsService.createRequestContext(ctx.switchToHttp().getRequest());
});
