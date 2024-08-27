import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {
  CaslAbilityFactory,
  AppAbility,
} from '../src/ability/casl-ability.factory/casl-ability.factory';
import { PermissionsGuard } from '../src/gaurds/permission.guard';
import { User } from '../src/user/entities/user.entity';
import { Action } from '../src/enums/action.enum';
import { Subject } from '../src/enums/subject.enum';

describe('Authorization Tests', () => {
  let caslAbilityFactory: CaslAbilityFactory;
  let permissionsGuard: PermissionsGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaslAbilityFactory,
        PermissionsGuard,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    caslAbilityFactory = module.get<CaslAbilityFactory>(CaslAbilityFactory);
    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });
  describe('CaslAbilityFactory', () => {
    it('should create an ability for a user with permissions', () => {
      const user: User = {
        userId: 1,
        username: 'fortest',
        email: 'fortest2',
        permissions: [
          { action: Action.Read, subject: Subject.User },
          { action: Action.Create, subject: Subject.Product },
        ],
      };
      const ability: AppAbility = caslAbilityFactory.defineAbility(user);

      expect(ability.can(Action.Read, Subject.User)).toBeTruthy();
      expect(ability.can(Action.Create, Subject.Product)).toBeTruthy();
      expect(ability.can(Action.Update, Subject.Product)).toBeFalsy();
    });

    it('should create an ability for a user without permissions', () => {
      const user2: User = {
        userId: 2,
        username: 'fortest2',
        email: 'EmailForTest',
        permissions: [],
      };

      const ability: AppAbility = caslAbilityFactory.defineAbility(user2);

      expect(ability.can(Action.Read, Subject.User)).toBeFalsy();
      expect(ability.can(Action.Create, Subject.Product)).toBeFalsy();
    });
  });

  describe('PermissionsGuard', () => {
    let mockExecutionContext: ExecutionContext;

    beforeEach(() => {
      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            Headers: {
              authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
              .eyJzdWIiOjEsInVzZXJuYW1lIjoiYW1pciIsInBlcm1pc3Npb25zIjpbeyJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoicHJvZHVjdCJ9XSwiaWF0IjoxNzI0NTI3NTgzLCJleHAiOjE3MjQ1MzExODN9
              .pS-eicpBamV29lEqwjBHCpqO-Np-JZMJCr8SA5iHNCw`,
            },
          }),
        }),
        getHandler: jest.fn(),
      } as unknown as ExecutionContext;
    });

    it('should allow access when user has required permissions', async () => {
      const mockUser = {
        sub: 1,
        username: 'testuser',
        permissions: [{ action: Action.Read, subject: Subject.User }],
      };

      (jwtService.verify as jest.Mock).mockResolvedValue(mockUser);
      (reflector.get as jest.Mock).mockResolvedValue([
        (ability: AppAbility) => ability.can(Action.Read, Subject.User),
      ]);
      const result = await permissionsGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it('should deny access when user lacks required permissions', async () => {
      const mockUser = {
        sub: 3,
        username: 'testing',
        permissions: [{ action: Action.Read, subject: Subject.Product }],
      };

      (jwtService.verify as jest.Mock).mockResolvedValue(mockUser);
      (reflector.get as jest.Mock).mockResolvedValue([
        (ability: AppAbility) => ability.can(Action.Read, Subject.User),
      ]);
      const result = await permissionsGuard.canActivate(mockExecutionContext);

      expect(result).toBeFalsy();
    });
  });

  describe('End-to-End Authorization Flow', () => {
    beforeEach(() => {
      (jwtService.verify as jest.Mock).mockReset();
    });

    it('should authorize a user with correct permissions', async () => {
      const mockToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
              .eyJzdWIiOjEsInVzZXJuYW1lIjoiYW1pciIsInBlcm1pc3Npb25zIjpbeyJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoicHJvZHVjdCJ9XSwiaWF0IjoxNzI0NTI3NTgzLCJleHAiOjE3MjQ1MzExODN9
              .pS-eicpBamV29lEqwjBHCpqO-Np-JZMJCr8SA5iHNCw`;

      const mockUser = {
        sub: 12,
        username: 'justfortest',
        permissions: [{ action: Action.Read, subject: Subject.User }],
      };

      (jwtService.verify as jest.Mock).mockResolvedValue(mockUser);
      (reflector.get as jest.Mock).mockResolvedValue([
        (ability: AppAbility) => ability.can(Action.Read, Subject.User),
      ]);

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: mockToken,
            },
          }),
        }),
        getHandler: jest.fn(),
      } as unknown as ExecutionContext;

      const result = await permissionsGuard.canActivate(mockContext);

      expect(jwtService.verify).toHaveBeenCalledWith(mockToken.split(' ')[1]);
      expect(result).toBeTruthy();
    });

    it('should reject a user with incorrect permissions', async () => {
      const mockToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        .eyJzdWIiOjEsInVzZXJuYW1lIjoiYW1pciIsInBlcm1pc3Npb25zIjpbeyJhY3Rpb24iOiJjcmVhdGUiLCJzdWJqZWN0IjoicHJvZHVjdCJ9XSwiaWF0IjoxNzI0NTI3NTgzLCJleHAiOjE3MjQ1MzExODN9
        .pS-eicpBamV29lEqwjBHCpqO-Np-JZMJCr8SA5iHNCw`;
      const mockUser = {
        sub: 1,
        username: 'testuser',
        permissions: [{ action: Action.Read, subject: Subject.Product }],
      };
      (jwtService.verify as jest.Mock).mockResolvedValue(mockUser);
      (reflector.get as jest.Mock).mockReturnValue([
        (ability: AppAbility) => ability.can(Action.Update, Subject.User),
      ]);
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: `Bearer ${mockToken}`,
            },
            getHandler: jest.fn(),
          }),
        }),
      } as unknown as ExecutionContext;
      const result = await permissionsGuard.canActivate(mockContext);
      await expect(permissionsGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
      expect(result).toBeFalsy();
    });
  });
});
