import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { getModelToken } from '@nestjs/sequelize';
import { Service } from './models/service.model';
import { NotFoundException } from '@nestjs/common';

describe('ServiceService', () => {
  let service: ServiceService;
  let mockServiceModel: typeof Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: getModelToken(Service),
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    mockServiceModel = module.get<typeof Service>(getModelToken(Service));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all services', async () => {
    const mockServices = [{ serviceId: 1, name: 'Test Service', price: 100 }];
    mockServiceModel.findAll = jest.fn().mockResolvedValue(mockServices);

    const result = await service.getAllServices();

    expect(result).toEqual(mockServices);
    expect(mockServiceModel.findAll).toHaveBeenCalled();
  });

  it('should create a new service', async () => {
    const newService = { name: 'New Service', price: 150 };
    mockServiceModel.create = jest.fn().mockResolvedValue(newService);

    const result = await service.createService(newService);

    expect(result).toEqual(newService);
    expect(mockServiceModel.create).toHaveBeenCalledWith(newService);
  });

  it('should throw NotFoundException when creating a service with invalid data', async () => {
    await expect(service.createService({ name: '', price: 0 })).rejects.toThrow(NotFoundException);
  });
});
