import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@db';

@Injectable()
export class AclService {
  @Inject(CacheService)
  private readonly cacheService: CacheService;

  /**
   * 缓存key
   */
  private cachePermissionKey: string = '';
  private cacheNavKey: string = '';

  constructor(private readonly configService: ConfigService) {
    this.cachePermissionKey = this.configService.get('COMMON.cacheKey.permission');
    this.cacheNavKey = this.configService.get('COMMON.cacheKey.nav');
  }

  /**
   * 缓存用户权限
   * @param userId
   * @param permission
   * @returns
   */
  async setCachePermission(userId: string, permission: any) {
    const expires = parseInt(this.configService.get('COMMON.cacheKey.permissionExpires') || '-1');
    await this.cacheService.set(`${this.cachePermissionKey}:${userId}`, permission, expires);
  }

  /**
   * 缓存用户导航
   * @param userId
   * @param nav
   */
  async setCacheNav(userId: string, nav: any) {
    const expires = parseInt(this.configService.get('COMMON.cacheKey.navExpires') || '-1');
    await this.cacheService.set(`${this.cacheNavKey}:${userId}`, nav, expires);
  }

  /**
   * 获取缓存用户权限
   * @param userId
   * @returns
   */
  async getCachePermission(userId: string): Promise<any> {
    return await this.cacheService.get(`${this.cachePermissionKey}:${userId}`);
  }

  /**
   * 获取缓存的用户导航
   * @param userId
   */
  async getCacheNav(userId: string): Promise<any> {
    return await this.cacheService.get(`${this.cacheNavKey}:${userId}`);
  }
}
