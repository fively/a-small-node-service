import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommonModule, RequestMiddleware, EnvService } from '@common';
import { DatabaseModule } from '@db';
import { MpModule } from './module/mp/mp.module';
import { MiniModule } from './module/mini/mini.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: EnvService.loadConfig(),
      ignoreEnvFile: true,
      isGlobal: true
    }),
    CommonModule,
    DatabaseModule,
    MpModule,
    MiniModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
