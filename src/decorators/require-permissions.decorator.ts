import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/enums/action.enum';
import { Subject } from 'src/enums/subject.enum';

export const RequirePermissions = (
  ...permissions: { action: Action; subject: Subject }[]
) => SetMetadata('permissions', permissions);
