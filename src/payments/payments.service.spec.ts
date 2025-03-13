import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { Installment } from '../installments/models/installment.model';
import { InstallmentPlan } from '../installments/models/installment-plan.model';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPaymentRepository = {
    create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, paymentId: 1 })),
    findOne: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(0), // 🔥 Inicialmente no hay pagos
    bulkCreate: jest.fn().mockResolvedValue([]),
  };

  const mockInstallmentRepository = {
    findByPk: jest.fn().mockResolvedValue({
      installmentId: 1,
      amount: 100,
      installmentPlanId: 1,
      save: jest.fn(),
    }),
    findAll: jest.fn().mockResolvedValue([
      { installmentId: 1, amount: 100 },
      { installmentId: 2, amount: 100 },
    ]),
  };

  const mockInstallmentPlanRepository = {
    findOne: jest.fn().mockResolvedValue({
      installmentPlanId: 1,
      isPaid: false,
      save: jest.fn(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getModelToken(Payment), useValue: mockPaymentRepository },
        { provide: getModelToken(Installment), useValue: mockInstallmentRepository },
        { provide: getModelToken(InstallmentPlan), useValue: mockInstallmentPlanRepository },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment when the amount matches the installment amount', async () => {
    const paymentData: CreatePaymentDto = { installmentId: 1, amount: 100, paymentMethod: 'Card' };
    const userId = 1;

    const result = await service.createPayment(paymentData, userId);

    expect(result).toMatchObject({ message: 'Payment processed successfully' });
    expect(mockPaymentRepository.create).toHaveBeenCalledWith(expect.objectContaining(paymentData));
  });

  it('should allow payment that matches the total owed amount', async () => {
    mockInstallmentRepository.findAll.mockResolvedValue([
      { installmentId: 1, amount: 100 },
      { installmentId: 2, amount: 100 },
    ]);
    
    const paymentData: CreatePaymentDto = { installmentId: 1, amount: 200, paymentMethod: 'Card' };
    const userId = 1;

    const result = await service.createPayment(paymentData, userId);

    expect(result).toMatchObject({ message: 'Payment processed successfully' });
    expect(mockPaymentRepository.bulkCreate).toHaveBeenCalled();
  });

  it('should throw BadRequestException if trying to pay more than owed', async () => {
    const paymentData: CreatePaymentDto = { installmentId: 1, amount: 300, paymentMethod: 'Card' };
    const userId = 1;

    await expect(service.createPayment(paymentData, userId)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if installment does not exist', async () => {
    mockInstallmentRepository.findByPk.mockResolvedValueOnce(null);

    const paymentData: CreatePaymentDto = { installmentId: 999, amount: 100, paymentMethod: 'Card' };
    const userId = 1;

    await expect(service.createPayment(paymentData, userId)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if trying to pay an installment that is already paid', async () => {
    mockPaymentRepository.count.mockResolvedValueOnce(1);

    const paymentData: CreatePaymentDto = { installmentId: 1, amount: 100, paymentMethod: 'Card' };
    const userId = 1;

    await expect(service.createPayment(paymentData, userId)).rejects.toThrow(BadRequestException);
  });
});
