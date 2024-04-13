import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@db';
import { UtilsService } from '@common';

@Injectable()
export class AuthService {
  @Inject(CacheService)
  private readonly cacheService: CacheService;

  /**
   * 缓存key
   */
  private cacheKey: string = '';

  constructor(private readonly configService: ConfigService) {
    this.cacheKey = this.configService.get('COMMON.cacheKey.token');
  }

  /**
   * 缓存用户信息
   * @param user
   * @returns 返回存储key，即token
   */
  async setCacheUser(user: any): Promise<any> {
    const token = UtilsService.uuid() + new Date().getTime();
    const expires = parseInt(this.configService.get('COMMON.cacheKey.tokenExpires') || '-1');
    await this.cacheService.set(`${this.cacheKey}:${token}`, user, expires);
    return token;
  }

  /**
   * 获取缓存用户信息
   * @param token
   * @returns
   */
  async getCacheUser(token: string): Promise<any> {
    return await this.cacheService.get(`${this.cacheKey}:${token}`);
  }
}
