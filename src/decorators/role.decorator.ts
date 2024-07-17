/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('role', roles);
