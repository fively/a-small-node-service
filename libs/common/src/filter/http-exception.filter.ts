import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as dayjs from 'dayjs';
import { UtilsService } from '../utils/utils.service';
import { LoggerService } from '../logger/logger.service';

/**
 * 请求异常捕获
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setModule(HttpExceptionFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const context = UtilsService.createRequestContext(request);

    const exceptionCode = exception.getStatus();
    const exceptionMessage = exception.getResponse();

    // 字符串时，直接返回exceptionCode和message
    if (typeof exceptionMessage === 'string') {
      // 错误信息写入日志
      this.logger.error(context, 'catch', exceptionMessage);

      response.status(exceptionCode).send({
        errorcode: exceptionCode,
        timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        path: context.url,
        message: exceptionMessage
      });
      return;
    }
    const { statusCode = 500, message = '未知错误' } = exceptionMessage as {
      statusCode: number;
      message: string | Array<string>;
    };

    // 错误信息写入日志
    this.logger.error(context, 'catch', JSON.stringify(message));

    response.status(HttpStatus.OK).send({
      errorcode: statusCode,
      timestamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      path: context.url,
      message: message
    });
  }
}
