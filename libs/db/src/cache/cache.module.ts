import { DynamicModule, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { ICacheOptions } from './cache.interfaces';

@Module({})
export class CacheModule {
  public static forRootAsync(options: ICacheOptions): DynamicModule {
    return {
      module: CacheModule,
      global: options.isGlobal || false,
      imports: [],
      providers: [
        CacheService,
        {
          provide: 'REDIS_CLIENT',
          inject: options.inject || [],
          async useFactory(configService: ConfigService) {
            const client = createClient({
              database: parseInt(configService.get('REDIS.database') || '0'),
              socket: {
                host: configService.get('REDIS.host'),
                port: configService.get('REDIS.port')
              },
              password: `${configService.get('REDIS.user')}:${configService.get('REDIS.password')}`
            });
            await client.connect();
            return client;
          }
        }
      ],
      exports: [CacheService]
    };
  }
}
