import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentModel: typeof Payment) {}

  async createPayment(data: any) {
    return this.paymentModel.create(data);
  }
}
