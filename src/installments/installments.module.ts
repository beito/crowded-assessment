import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstallmentsController } from './installments.controller';
import { InstallmentsService } from './installments.service';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';

@Module({
  imports: [SequelizeModule.forFeature([Installment, InstallmentPlan])],
  controllers: [InstallmentsController],
  providers: [InstallmentsService],
  exports: [InstallmentsService],
})
export class InstallmentsModule {}
