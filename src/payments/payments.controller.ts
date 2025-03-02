import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDtoSchema } from './dtos/create-payment.dto';
import * as Joi from 'joi';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() body: any) {
    const { error, value } = CreatePaymentDtoSchema.validate(body);
    if (error) return { message: 'Invalid data', details: error.details };

    return this.paymentsService.createPayment(value);
  }
}
