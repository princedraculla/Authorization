import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(email);
    let payload;
    const exist = user.map((el: User) => {
      if (!(el.username === username)) {
        throw new UnauthorizedException();
      }
      payload = { sub: el.userId, username: el.username };
    });
    console.log(exist);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
