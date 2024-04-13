import { APP_FILTER } from '@nestjs/core';
import { Global, Module } from '@nestjs/common';
import { CryptoService } from './crypto/crypto.service';
import { LoggerService } from './logger/logger.service';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Global()
@Module({
  providers: [
    CryptoService,
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ],
  exports: [CryptoService, LoggerService]
})
export class CommonModule {}
