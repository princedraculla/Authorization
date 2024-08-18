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

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(type);

    if (!token) {
      throw new UnauthorizedException('token not found');
    }
    const decodedToken = this.jwtService.decode(token);
    const user: User = decodedToken;
    console.log(user);
    if (!user || !user.permissions) {
      throw new UnauthorizedException('token expierd or dont have permission');
    }
    const ability: AppAbility = this.caslAbilityFactory.defineAbility(user);
    console.log(user.permissions['action']);
    console.log(
      ability.can(user.permissions['action'], user.permissions['subject']),
    );
    if (
      !user.permissions.some((permission) => {
        console.log(permission);
        console.log(ability);
      })
    ) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
