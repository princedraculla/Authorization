import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const Permissions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService({ secret: 'anythingjustpleasework' });
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      const decodedToken = jwtService.decode(token);
      return decodedToken['permissions'];
    }
    return [];
  },
);
