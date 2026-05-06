import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Usage in a controller: currentUser(@CurrentUser() user: any)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;   // set by JwtStrategy.validate() after token is verified
  },
);
