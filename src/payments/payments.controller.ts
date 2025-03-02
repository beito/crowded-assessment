import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDtoSchema } from './dtos/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() body: any) {
    this.logger.log(`Received payment request: ${JSON.stringify(body)}`);

    const { error, value } = CreatePaymentDtoSchema.validate(body);
    if (error) {
      this.logger.warn(`Validation failed: ${JSON.stringify(error.details)}`);
      return { message: 'Invalid data', details: error.details };
    }

    return this.paymentsService.createPayment(value);
  }
}
