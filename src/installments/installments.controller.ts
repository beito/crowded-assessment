import { Controller, Post, Get, Body, Logger } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDtoSchema } from './dtos/create-installment.dto';

@Controller('installments')
export class InstallmentsController {
  private readonly logger = new Logger(InstallmentsController.name);

  constructor(private installmentsService: InstallmentsService) {}

  @Post()
  async createInstallment(@Body() body: any) {
    this.logger.log(`Received request to create installment: ${JSON.stringify(body)}`);

    const { error, value } = CreateInstallmentDtoSchema.validate(body);
    if (error) {
      this.logger.warn(`Validation failed: ${JSON.stringify(error.details)}`);
      return { message: 'Invalid data', details: error.details };
    }

    return this.installmentsService.createInstallment(value);
  }

  @Get()
  async getInstallments() {
    this.logger.log('Fetching all installment plans');
    return this.installmentsService.getAllInstallments();
  }

  @Get('completed')
  async getCompletedInstallmentPlans() {
    this.logger.log('Fetching completed installment plans');
    return this.installmentsService.getCompletedInstallments();
  }
}
