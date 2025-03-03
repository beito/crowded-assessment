import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    mockUserRepository = {
      findOne: jest.fn().mockResolvedValue({
        userId: 1,
        email: 'test@example.com',
        password: hashedPassword,
        toJSON: jest.fn().mockReturnValue({
          userId: 1,
          email: 'test@example.com',
          password: hashedPassword,
        }),
      }),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked_token'),
    };

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
    const user = await service.validateUser('test@example.com', '123456');

    expect(user).toEqual({ userId: 1, email: 'test@example.com' });
  });

  it('should return a JWT token on login', async () => {
    const token = await service.login({ userId: 1, email: 'test@example.com' });

    expect(token).toEqual({ access_token: 'mocked_token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 1, email: 'test@example.com' });
  });
});
