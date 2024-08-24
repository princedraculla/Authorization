import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { AppAbility } from 'src/ability/casl-ability.factory/casl-ability.factory';
import { CaslAbilityFactory } from 'src/ability/casl-ability.factory/casl-ability.factory';
import { PolicyHandler } from 'src/interfaces/policyhandle.interface';
import { CHECK_POLICIES } from 'src/decorators/policies.decorator';

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
        throw new UnauthorizedException('invalid token');
      }
      const payload = this.jwtService.verify(token);
      console.log('decode token payload: ', payload);

      const user: User = {
        userId: payload.sub,
        username: payload.username,
        email: 'does not matter right now',
        permissions: payload.permissions,
      };
      console.log('Extracted User: ', user);

      const ability: AppAbility = this.caslAbilityFactory.defineAbility(user);

      const resualt = requiredPermissions.every((handler) => {
        return this.excutePolicyHandler(handler, ability);
      });
      console.log('check policy result: ', resualt);
      return resualt;
    } catch (error) {
      console.log('Authorization error: ', error);
      throw new UnauthorizedException('first LogIn and SignIn then try...');
    }
  }

  private excutePolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    console.log('execution Policy Handler');
    if (typeof handler === 'function') {
      const resulat = handler(ability);
      console.log('policy handler resualt: ', resulat);
      return resulat;
    }
    return handler.handle(ability);
  }
}
