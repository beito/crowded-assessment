import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      toJSON: function () {
        return { id: this.id, email: this.email };
      },
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return user if credentials are valid', async () => {
    const user = await service.validateUser('test@example.com', 'password123');

    expect(user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should return a JWT token on login', async () => {
    const token = await service.login({ id: 1, email: 'test@example.com' });

    expect(token).toEqual({ access_token: 'mocked_token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'test@example.com' });
  });
});
