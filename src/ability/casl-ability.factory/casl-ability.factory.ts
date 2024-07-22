import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  PureAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { Action } from 'src/enums/action.enum';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

export type Subjects = InferSubjects<typeof Product | typeof User> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role.isAdmin) {
    } else if (user.role.isSeller) {
    } else {
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
