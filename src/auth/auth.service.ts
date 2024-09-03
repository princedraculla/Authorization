import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './schema/sign-in.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDTO): Promise<{ access_token: string }> {
    const user = this.userService.findOne(signInDto.email);

    const { ...payload } = user.map((el: User) => {
      if (!(el.username === signInDto.username)) {
        throw new UnauthorizedException();
      }
      return {
        sub: el.userId,
        username: el.username,
        permissions: [el.permissions],
      };
    });
    return {
      access_token: this.jwtService.sign(payload[0]),
    };
  }
}
