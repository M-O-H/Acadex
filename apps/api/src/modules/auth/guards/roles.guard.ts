import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

type AuthUser = {
  role?: string;
};

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      this.logger.debug('No roles required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;

    if (!user?.role) {
      this.logger.warn('No user role found, denying access');
      return false;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (hasRole) {
      this.logger.debug(
        `Role check passed: user has ${user.role}, required: ${requiredRoles.join(', ')}`,
      );
    } else {
      this.logger.warn(
        `Role check failed: user has ${user.role}, required: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}
