import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { InstallmentsService } from '../installments/installments.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    private installmentsService: InstallmentsService
  ) {}

  async createPayment(data: { installmentId: number; amount: number; paymentMethod: string }) {
    const payment = await this.paymentModel.create(data);

    await this.installmentsService.registerPayment(data.installmentId, data.amount);

    return payment;
  }
}
