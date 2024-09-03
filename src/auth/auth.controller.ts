import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from './validation/validation.pipe';
import { signInSchema, SignInDTO } from './schema/sign-in.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(signInSchema))
  signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO);
  }
}
