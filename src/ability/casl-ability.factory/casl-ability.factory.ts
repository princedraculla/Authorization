import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';
import { User } from 'src/user/entities/user.entity';

export type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User): AppAbility {
    const { can, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );
    try {
      console.log('Defining Ability for user:', user);
      if (Array.isArray(user.permissions)) {
        user.permissions.forEach((permission) => {
          const { action, subject, condition } = permission;
          const actions = Array.isArray(action) ? action : [action];
          actions.forEach((act) => {
            if (this.isValidEnumValue(Action, act) && subject) {
              console.log(`Adding permissions: ${act}, ${subject}`);
              if (condition) {
                can(act, subject, condition);
              } else {
                can(act, subject);
              }
            }
          });
        });
      } else {
        console.log('no permission found for user');
      }
    } catch (error) {
      console.log(error);
    }

    //return build() as AppAbility;

    const ability = build({
      detectSubjectType: (object: any) =>
        object.constructor as ExtractSubjectType<Subject>,
    });
    console.log('built ability: ', ability);
    return ability;
  }
  private isValidEnumValue(enumType: Record<string, any>, value: any) {
    return Object.values(enumType).includes(value);
  }
}
