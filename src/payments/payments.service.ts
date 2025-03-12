import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { InstallmentsService } from '../installments/installments.service';
import { Installment } from '../installments/models/installment.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Installment) private installmentModel: typeof Installment,
    private installmentsService: InstallmentsService
  ) {}

  async createPayment(
    data: { installmentId: number; amount: number; paymentMethod: string },
    userId: number
  ) {
    this.logger.log(`Processing payment for installment ${data.installmentId}`);

    const installment = await this.installmentModel.findByPk(data.installmentId);
    if (!installment) {
      this.logger.warn(`Attempt to pay non-existing installment ${data.installmentId}`);
      throw new NotFoundException('Installment not found');
    }
  
    const totalRemaining = await this.installmentModel.sum('remainingAmount', {
      where: { installmentPlanId: installment.installmentPlanId },
    });

    if (data.amount !== installment.amount && data.amount !== totalRemaining) {
      this.logger.warn(`Invalid payment amount: ${data.amount} for installment ${data.installmentId}`);
      throw new BadRequestException(
        'Payment must match either an installment amount or the total remaining balance'
      );
    }
  
    const payment = await this.paymentModel.create({
      installmentId: data.installmentId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      userId,
      paidAt: new Date(),
    } as CreationAttributes<Payment>);
  
    const planPaid = await this.installmentsService.registerPayment(data.installmentId, data.amount);
  
    if (planPaid) {
      this.logger.log(`Installment plan fully paid for installment ${data.installmentId}`);
    }
  
    return payment;
  }  
   
}
