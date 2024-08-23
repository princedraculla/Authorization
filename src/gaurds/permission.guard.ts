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

    if (!requiredPermissions) {
      return true;
    }
    try {
      const request = context.switchToHttp().getRequest();
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      console.log(type);

      if (!token) {
        throw new UnauthorizedException('token not found');
      }
      const decodedToken = this.jwtService.decode(token);
      const user: User = decodedToken;

      const ability: AppAbility = this.caslAbilityFactory.defineAbility(user);

      return requiredPermissions.every((handler) => {
        this.excutePolicyHandler(handler, ability);
      });
    } catch (error) {
      console.log(error);
    }
  }

  private excutePolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      console.log('ability in execution:');
      console.log(ability);

      return handler(ability);
    }
    return handler.handle(ability);
  }
}
