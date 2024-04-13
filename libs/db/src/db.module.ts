import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CacheModule } from './cache/cache.module';
import { KnexModule } from './knex/knex.module';

@Module({
  imports: [
    // redis连接
    CacheModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService]
    }),
    // mysql数据库
    KnexModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        config: config.get('DATABASE')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [],
  exports: []
})
export class DatabaseModule {}
