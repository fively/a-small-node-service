import { FastifyRequest } from 'fastify';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  private readonly authService: AuthService;

  constructor(private reflector: Reflector) {}

  /**
   * 验证token
   * @param context
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /** 开放接口不验证 */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const request: FastifyRequest = context.switchToHttp().getRequest();
    const authorization: string = request.headers['authorization'] || '';

    if (!authorization) {
      throw new UnauthorizedException('登录身份失效，请重新登录');
    }

    const user = await this.authService.getCacheUser(authorization);
    if (user) {
      (request as any).user = user;
      return true;
    }

    throw new UnauthorizedException('登录身份失效，请重新登录');
  }
}
