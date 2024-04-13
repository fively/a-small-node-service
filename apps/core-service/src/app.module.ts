import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommonModule, RequestMiddleware, EnvService } from '@common';
import { AuthModule } from '@auth';
import { DatabaseModule } from '@db';
import { UserModule } from './module/user/user.module';
import { PublicModule } from './module/public/public.module';
import { NavModule } from './module/nav/nav.module';
import { AppModuleModule } from './module/app-module/app-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: EnvService.loadConfig(),
      ignoreEnvFile: false,
      isGlobal: true
    }),
    CommonModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    PublicModule,
    NavModule,
    AppModuleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
