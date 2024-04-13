import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constant';

/**
 * 权限装饰器
 * @param navCode 导航编码
 * @param permissionCode 权限编码
 * @returns
 */
export const Permission = (navCode: string, permissionCode: string) =>
  SetMetadata(PERMISSION_KEY, { navCode, permissionCode });
