import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import {
  CreateInstallmentDtoSchema,
  CreateInstallmentDto,
} from './dtos/create-installment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    userId: number;
  };
}

@Controller('installments')
export class InstallmentsController {
  private readonly logger = new Logger(InstallmentsController.name);

  constructor(private installmentsService: InstallmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createInstallment(
    @Body() body: CreateInstallmentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    this.logger.log(
      `Received request to create installment: ${JSON.stringify(body)}`,
    );

    const validationResult = CreateInstallmentDtoSchema.validate(body);
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
      return { message: 'server error' };
    }

    this.logger.log(`Extracted userId from token: ${userId}`);
    return this.installmentsService.createInstallment({
      ...validationResult.value,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInstallments() {
    this.logger.log('Fetching all installment plans');
    return this.installmentsService.getAllInstallments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('completed')
  async getCompletedInstallmentPlans() {
    this.logger.log('Fetching completed installment plans');
    return this.installmentsService.getCompletedInstallments();
  }
}
