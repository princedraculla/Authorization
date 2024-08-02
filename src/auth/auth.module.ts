import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/ability/casl-ability.factory/casl-ability.factory';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'anythingjustpleasework',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CaslAbilityFactory],
  exports: [AuthService],
})
export class AuthModule {}
