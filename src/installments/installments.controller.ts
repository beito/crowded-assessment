import { Controller, Post, Get, Body } from '@nestjs/common';
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDtoSchema } from './dtos/create-installment.dto';

@Controller('installments')
export class InstallmentsController {
  constructor(private installmentsService: InstallmentsService) {}

  @Post()
  async createInstallment(@Body() body: any) {
    const { error, value } = CreateInstallmentDtoSchema.validate(body);
    if (error) return { message: 'Invalid data', details: error.details };

    return this.installmentsService.createInstallment(value);
  }

  @Get()
  async getInstallments() {
    return this.installmentsService.getAllInstallments();
  }
}
