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
    const { can, cannot, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else if (user.isSeller) {
      can(Action.Create, Product);
      can(Action.Read, Product);
      can(Action.Read, User);
      can(Action.Delete, Product, { userId: '${user.id}' });
      can(Action.Update, Product, { userId: '${user.id}' });
      cannot(Action.Delete, User).because('Delete Users not Allowed!!');
    } else {
      can(Action.Read, Product);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
