import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { InstallmentsService } from '../installments/installments.service';
import { Installment } from '../installments/models/installment.model';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Installment) private installmentModel: typeof Installment,
    private installmentsService: InstallmentsService
  ) {}

  async createPayment(data: { installmentId: number; amount: number; paymentMethod: string }) {
    this.logger.log(`Processing payment for installment ${data.installmentId}`);

    const installment = await this.installmentModel.findByPk(data.installmentId);
    if (!installment) {
      this.logger.warn(`Attempt to pay non-existing installment ${data.installmentId}`);
      throw new NotFoundException('Installment not found');
    }

    if (data.amount > installment.remainingAmount) {
      this.logger.warn(`Overpayment attempt on installment ${data.installmentId}`);
      throw new BadRequestException('Payment exceeds remaining amount');
    }

    const payment = await this.paymentModel.create(data);

    const planPaid = await this.installmentsService.registerPayment(data.installmentId, data.amount);

    if (planPaid) {
      this.logger.log(`Installment plan fully paid for installment ${data.installmentId}`);
    }

    return payment;
  }
}
