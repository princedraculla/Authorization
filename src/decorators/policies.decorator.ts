import { PolicyHandler } from 'src/interfaces/policyhandle.interface';
import { SetMetadata } from '@nestjs/common';
export const CHECK_POLICIES = 'check_policies';
export const CheckPolicies = (...handlers: PolicyHandler[]) => {
  SetMetadata(CHECK_POLICIES, handlers);
};
