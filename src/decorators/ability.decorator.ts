import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY = 'check_ability';

export interface RequierdRule {
  action: string;
  subject: string;
  condition?: any;
}

export const check_abilities = (...requierments: RequierdRule[]) => {
  SetMetadata(CHECK_ABILITY, requierments);
};
