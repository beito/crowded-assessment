import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDtoSchema } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const { error, value } = LoginDtoSchema.validate(body);
    if (error) {
      return { message: 'Invalid input', details: error.details };
    }

    const user = await this.authService.validateUser(value.email, value.password);
    return this.authService.login(user);
  }
}
