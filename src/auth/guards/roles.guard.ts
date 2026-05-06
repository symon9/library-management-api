import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// 1. Define the shape of your user to satisfy TypeScript
interface UserWithRole {
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route from @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // If no roles are required, any authenticated user is allowed
    if (!requiredRoles) {
        return true;
    }
    // Get the user that JwtStrategy.validate() attached to the request
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserWithRole;
    // Safety check: if somehow we got here without a user or role property, deny access
    if (!user || !user.role ) {
      throw new ForbiddenException('No user information found in request');
    }

    // Check if the user's role is in the allowed list
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
