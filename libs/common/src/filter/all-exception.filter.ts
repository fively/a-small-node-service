import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as dayjs from 'dayjs';
import { UtilsService } from '../utils/utils.service';
import { LoggerService } from '../logger/logger.service';

/**
 * 错误信息捕获
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setModule(AllExceptionFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const context = UtilsService.createRequestContext(request);

    const errorMessage = (exception as { message: string }).message;

    // 错误信息写入日志
    this.logger.error(context, 'catch', errorMessage);

    response.status(HttpStatus.OK).send({
      errorcode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      path: context.url,
      message: errorMessage
    });
  }
}
