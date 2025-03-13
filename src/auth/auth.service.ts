import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user.toJSON();
    return result as AuthenticatedUser;
  }

  login(user: AuthenticatedUser) {
    const payload = { sub: user.userId, email: user.email };
    this.logger.log(`User logged in: ${user.email} (ID: ${user.userId})`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
