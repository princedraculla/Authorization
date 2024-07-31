import { Injectable } from '@nestjs/common';
import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';

export type AppAbility = PureAbility<[Action, Subject]>;
export interface Permissions {
  action: Action;
  subject: Subject;
  condition?: Record<string, any>;
}

@Injectable()
export class CaslAbilityFactory {
  defineAbility(permissions: Permissions[]): AppAbility {
    const { can, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );

    permissions.forEach(({ action, subject, condition }) => {
      can(action, subject, condition);
    });

    return build();
  }
}
