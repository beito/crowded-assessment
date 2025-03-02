import { Test, TestingModule } from '@nestjs/testing';
import { InstallmentsService } from './installments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';

describe('InstallmentsService', () => {
  let service: InstallmentsService;
  let mockInstallmentModel: typeof Installment;
  let mockInstallmentPlanModel: typeof InstallmentPlan;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstallmentsService,
        {
          provide: getModelToken(Installment),
          useValue: {
            findByPk: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(InstallmentPlan),
          useValue: {
            findByPk: jest.fn(),
            save: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InstallmentsService>(InstallmentsService);
    mockInstallmentModel = module.get<typeof Installment>(getModelToken(Installment));
    mockInstallmentPlanModel = module.get<typeof InstallmentPlan>(getModelToken(InstallmentPlan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all installment plans', async () => {
    const mockPlans = [{ installmentPlanId: 1 }, { installmentPlanId: 2 }];
    mockInstallmentPlanModel.findAll = jest.fn().mockResolvedValue(mockPlans);

    const result = await service.getAllInstallments();

    expect(result).toEqual(mockPlans);
    expect(mockInstallmentPlanModel.findAll).toHaveBeenCalled();
  });

  it('should mark a plan as paid if all installments are paid', async () => {
    const installment = { installmentId: 1, remainingAmount: 50, save: jest.fn() };
    const plan = {
      installmentPlanId: 1,
      isPaid: false,
      installments: [{ remainingAmount: 0 }],
      save: jest.fn(),
    };

    mockInstallmentModel.findByPk = jest.fn().mockResolvedValue(installment);
    mockInstallmentPlanModel.findByPk = jest.fn().mockResolvedValue(plan);

    await service.registerPayment(1, 50);

    expect(plan.isPaid).toBe(true);
    expect(plan.save).toHaveBeenCalled();
  });
});
