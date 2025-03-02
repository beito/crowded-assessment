import { Injectable, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${email}`);
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      this.logger.warn(`Invalid password attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user.toJSON();
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
