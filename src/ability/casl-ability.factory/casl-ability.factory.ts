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
      if (!Array.isArray(user.permissions)) {
        const permission = [].concat(user.permissions);
        permission.forEach((permission) => {
          const { action, subject, condition } = permission;
          if (Array.isArray(action)) {
            action.forEach((act) => {
              if (subject && this.isValidEnumValue(Action, act)) {
                if (condition) {
                  can(act, subject, condition);
                } else {
                  can(act, subject);
                }
              }
            });
          } else {
            if (subject && this.isValidEnumValue(Action, action)) {
              if (condition) {
                can(action, subject, condition);
              } else {
                can(action, subject);
              }
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }

    //return build() as AppAbility;
    try {
      return build({
        detectSubjectType: (object: any) =>
          object.constructor as ExtractSubjectType<Subject>,
      });
    } catch (error) {
      console.log(error);
    }
  }
  private isValidEnumValue(enumType: Record<string, any>, value: any) {
    return Object.values(enumType).includes(value);
  }
}
