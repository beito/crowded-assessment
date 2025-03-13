import { Test, TestingModule } from '@nestjs/testing';
import { InstallmentsService } from './installments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';
import { BadRequestException } from '@nestjs/common';

describe('InstallmentsService', () => {
  let service: InstallmentsService;

  const mockInstallmentModel = {
    bulkCreate: jest.fn().mockResolvedValue([]),
  };

  const mockInstallmentPlanModel = {
    create: jest.fn().mockResolvedValue({
      installmentPlanId: 1,
      serviceId: 1,
      totalAmount: 200,
      userId: 1,
      isPaid: false,
    }),
    findAll: jest.fn().mockResolvedValue([
      { installmentPlanId: 1, isPaid: false },
      { installmentPlanId: 2, isPaid: true },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstallmentsService,
        { provide: getModelToken(Installment), useValue: mockInstallmentModel },
        { provide: getModelToken(InstallmentPlan), useValue: mockInstallmentPlanModel },
      ],
    }).compile();

    service = module.get<InstallmentsService>(InstallmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an installment plan correctly', async () => {
    const installmentData = {
      serviceId: 1,
      totalAmount: 200,
      installmentsCount: 2,
      userId: 1,
    };

    const result = await service.createInstallment(installmentData);

    expect(result).toEqual({
      installmentPlanId: 1,
      serviceId: 1,
      totalAmount: 200,
      userId: 1,
      isPaid: false,
    });

    expect(mockInstallmentPlanModel.create).toHaveBeenCalledWith({
      serviceId: 1,
      totalAmount: 200,
      userId: 1,
      isPaid: false,
    });
    expect(mockInstallmentModel.bulkCreate).toHaveBeenCalled();
  });

  it('should throw BadRequestException if installment data is invalid', async () => {
    await expect(service.createInstallment({} as any)).rejects.toThrow(BadRequestException);
  });

  it('should return all installment plans', async () => {
    const result = await service.getAllInstallments();

    expect(result).toEqual([
      { installmentPlanId: 1, isPaid: false },
      { installmentPlanId: 2, isPaid: true },
    ]);

    expect(mockInstallmentPlanModel.findAll).toHaveBeenCalled();
  });

  it('should return only completed installment plans', async () => {
    mockInstallmentPlanModel.findAll.mockResolvedValueOnce([{ installmentPlanId: 2, isPaid: true }]);

    const result = await service.getCompletedInstallments();

    expect(result).toEqual([{ installmentPlanId: 2, isPaid: true }]);
    expect(mockInstallmentPlanModel.findAll).toHaveBeenCalledWith({
      where: { isPaid: true },
      include: [Installment],
    });
  });
});
