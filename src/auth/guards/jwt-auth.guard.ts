import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if this route was decorated with @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // check the method first
      context.getClass(), // then check the class
    ]);

    // If public, skip JWT verification entirely
    if (isPublic) return true;

    // Otherwise run the standard JWT check
    return super.canActivate(context);
  }

  // Customize the error message when no token is provided
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('You must be logged in to access this resource');
    }
    return user;
  }
}
