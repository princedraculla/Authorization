import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { AppAbility } from '../ability/casl-ability.factory/casl-ability.factory';
import { CaslAbilityFactory } from '../ability/casl-ability.factory/casl-ability.factory';
import { PolicyHandler } from '../interfaces/policyhandle.interface';
import { CHECK_POLICIES } from '../decorators/policies.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES,
        context.getHandler(),
      ) || [];

    if (requiredPermissions.length === 0) {
      return true;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      if (type !== 'Bearer' || !token) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'invalid token',
          },
          HttpStatus.FORBIDDEN,
          {
            cause: 'token checking error',
          },
        );
      }
      const payload = this.jwtService.verify(token);
      const userInfo = payload['0'] || payload;

      const user: User = {
        userId: userInfo.sub,
        username: userInfo.username,
        email: 'does not matter right now',
        permissions: userInfo.permissions,
      };

      const ability: AppAbility = this.caslAbilityFactory.defineAbility(user);

      const resualt = requiredPermissions.every((handler) => {
        return this.excutePolicyHandler(handler, ability);
      });
      return resualt;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'not valid or exist token',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  private excutePolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      const resulat = handler(ability);

      return resulat;
    }
    return handler.handle(ability);
  }
}
