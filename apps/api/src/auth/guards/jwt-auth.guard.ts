import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      const isDevBypass =
        process.env['NODE_ENV'] === 'development' &&
        process.env['ENABLE_DEV_AUTH_BYPASS'] === 'true';

      if (isDevBypass) {
        const req = context.switchToHttp().getRequest();
        req.user = {
          sub: 'dev_super_admin',
          userId: 'dev_super_admin',
          email: 'admin@unite-attendance.com',
          globalRole: 'SUPER_ADMIN',
        };
        return true;
      }

      throw err;
    }
  }
}
