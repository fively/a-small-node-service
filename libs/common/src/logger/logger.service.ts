import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger, transports, format, QueryOptions } from 'winston';
import * as WinstonDailyRotateFile from 'winston-daily-rotate-file';
import { RequestContextDto } from '../dto/request-context.dto';

/**
 * 自定义日志内容格式
 */
const LoggerFormat = format.printf(({ label, level, message, timestamp, ctx, module, router }) => {
  return `${timestamp} [${level} - ${label}] module: ${module} , router: ${router}, ctx: ${JSON.stringify(
    ctx
  )}, message: ${message}`;
});

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private module?: string;
  private logger: Logger;

  public setModule(context: string): void {
    this.module = context;
  }

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.label({ label: 'Log' }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        LoggerFormat
      ),
      transports: [],
      // 处理未捕获的异常
      exceptionHandlers: [
        new WinstonDailyRotateFile({
          dirname: 'logs/exception',
          filename: 'exception-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d'
        })
      ],
      // 处理未捕获的 Promise 拒绝
      rejectionHandlers: [
        new WinstonDailyRotateFile({
          dirname: 'logs/rejection',
          filename: 'rejection-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d'
        })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.label({ label: 'Log' }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            LoggerFormat
          )
        })
      );
    } else {
      this.logger.add(
        new WinstonDailyRotateFile({
          level: 'error',
          dirname: 'logs/error',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '10m',
          maxFiles: '14d'
        })
      );
    }
  }

  error(ctx: RequestContextDto, router: string, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.error({
      message,
      module: this.module,
      router,
      ctx,
      timestamp,
      ...meta
    });
  }

  warn(ctx: RequestContextDto, router: string, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.warn({
      message,
      module: this.module,
      router,
      ctx,
      timestamp,
      ...meta
    });
  }

  debug(ctx: RequestContextDto, router: string, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.debug({
      message,
      module: this.module,
      router,
      ctx,
      timestamp,
      ...meta
    });
  }

  verbose(ctx: RequestContextDto, router: string, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.verbose({
      message,
      module: this.module,
      router,
      ctx,
      timestamp,
      ...meta
    });
  }

  log(ctx: RequestContextDto, router: string, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.info({
      message,
      module: this.module,
      router,
      ctx,
      timestamp,
      ...meta
    });
  }

  query(options: QueryOptions) {
    return new Promise((resolve, reject) => {
      this.logger.query(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
