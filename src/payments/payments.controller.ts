import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDtoSchema,
  CreatePaymentDto,
} from './dtos/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    userId: number;
  };
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(
    @Body() body: CreatePaymentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    this.logger.log(`Received payment request: ${JSON.stringify(body)}`);

    const validationResult = CreatePaymentDtoSchema.validate(body);

    if (validationResult.error) {
      this.logger.warn(
        `Validation failed: ${JSON.stringify(validationResult.error.details)}`,
      );
      return {
        message: 'Invalid data',
        details: validationResult.error.details,
      };
    }

    const userId = req.user?.userId;
    if (!userId) {
      this.logger.warn(`Missing userId in token`);
      return { message: 'Server error' };
    }

    this.logger.log(`Extracted userId from token: ${userId}`);
    return this.paymentsService.createPayment(validationResult.value, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserPayments(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.userId;
    if (!userId) {
      this.logger.warn(`Missing userId in token`);
      return { message: 'Server error' };
    }

    this.logger.log(`Fetching payments for user ${userId}`);

    return this.paymentsService.getPaymentsByUser(userId);
  }
}
