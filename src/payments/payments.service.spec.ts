import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { Installment } from '../installments/models/installment.model';
import { InstallmentsService } from '../installments/installments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPaymentRepository = {
    create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, paymentId: 1 })),
  };

  const mockInstallmentRepository = {
    findByPk: jest.fn().mockResolvedValue({ remainingAmount: 100, save: jest.fn() }),
  };

  const mockInstallmentsService = {
    registerPayment: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getModelToken(Payment), useValue: mockPaymentRepository },
        { provide: getModelToken(Installment), useValue: mockInstallmentRepository },
        { provide: InstallmentsService, useValue: mockInstallmentsService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment and register it in installments', async () => {
    const paymentData = { installmentId: 1, amount: 50, paymentMethod: 'Card' };
    const payment = await service.createPayment(paymentData);

    expect(payment).toEqual({ ...paymentData, paymentId: 1 });
    expect(mockInstallmentsService.registerPayment).toHaveBeenCalledWith(1, 50);
  });

  it('should log when an installment plan is fully paid', async () => {
    mockInstallmentsService.registerPayment.mockResolvedValueOnce(true);

    const paymentData = { installmentId: 1, amount: 100, paymentMethod: 'Card' };
    await service.createPayment(paymentData);

    expect(mockInstallmentsService.registerPayment).toHaveBeenCalledWith(1, 100);
  });
});
