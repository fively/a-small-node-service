import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PERMISSION_KEY } from '../constant';
import { AuthService, AclService } from '../service';

@Injectable()
export class AclGuard implements CanActivate {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(AclService)
  private readonly aclService: AclService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  /**
   * 验证权限
   * @param context
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();

    const user = (request as any).user;
    if (!user) {
      throw new UnauthorizedException('登录身份失效，请重新登录');
    }

    const userPermission = await this.aclService.getCachePermission(user.userId);
    const { navCode = '', permissionCode = '' } = this.reflector.get(PERMISSION_KEY, context.getHandler()) || {};

    if (navCode && permissionCode) {
      if (!Array.isArray(userPermission)) {
        throw new ForbiddenException('没有权限访问该接口');
      }

      if (!userPermission.some(up => up.navCode === navCode && up.permissionCode === permissionCode)) {
        throw new ForbiddenException('没有权限访问该接口');
      }
    }

    return true;
  }
}
