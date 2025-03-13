import { Controller, Post, Body, Logger, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDtoSchema, CreatePaymentDto } from './dtos/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(@Body() body: CreatePaymentDto, @Request() req) {
    this.logger.log(`Received payment request: ${JSON.stringify(body)}`);

    const { error, value } = CreatePaymentDtoSchema.validate(body);
    if (error) {
      this.logger.warn(`Validation failed: ${JSON.stringify(error.details)}`);
      return { message: 'Invalid data', details: error.details };
    }

    const userId = req.user?.userId;
    if (!userId) {
      this.logger.warn(`Missing userId in token`);
      return { message: 'Server error' };
    }

    this.logger.log(`Extracted userId from token: ${userId}`);
    return this.paymentsService.createPayment(value, userId);
  }
}
