import { PolicyHandlerCallback } from 'src/interfaces/policyhandle.interface';
import { SetMetadata } from '@nestjs/common';

export const CHECK_POLICIES = 'check_policies';
export const CheckPolicies = (...handlers: PolicyHandlerCallback[]) =>
  SetMetadata(CHECK_POLICIES, handlers);
