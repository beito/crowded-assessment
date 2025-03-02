import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private readonly mockUser = {
    id: 1,
    email: 'mockedmail@test.com',
    password: 'mockedpass123',
  };

  async validateUser(email: string, password: string): Promise<any> {
    if (email === this.mockUser.email && password === this.mockUser.password) {
      const { password, ...result } = this.mockUser;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
