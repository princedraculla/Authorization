import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  CaslAbilityFactory,
  Permissions,
} from 'src/ability/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<
      {
        action: Action;
        subject: Subject;
      }[]
    >('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userPermissions: Permissions[] = request.user?.permissions || [];
    const ability = this.caslAbilityFactory.defineAbility(userPermissions);

    return requiredPermissions.every(({ action, subject }) => {
      ability.can(action, subject);
    });
  }
}
