import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDtoSchema, LoginDto, AuthenticatedUser } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    this.logger.log(`Login attempt for email: ${body.email}`);

    const validationResult = LoginDtoSchema.validate(body);
    if (validationResult.error) {
      this.logger.warn(
        `Validation failed: ${JSON.stringify(validationResult.error.details)}`,
      );
      return {
        message: 'Invalid input',
        details: validationResult.error.details,
      };
    }

    const user: AuthenticatedUser = await this.authService.validateUser(
      validationResult.value.email,
      validationResult.value.password,
    );
    return this.authService.login(user);
  }
}
