import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstallmentPlan } from './models/installment-plan.model';

@Injectable()
export class InstallmentsService {
  constructor(@InjectModel(InstallmentPlan) private installmentPlanModel: typeof InstallmentPlan) {}

  async createInstallment(data: any) {
    return this.installmentPlanModel.create(data);
  }

  async getAllInstallments() {
    return this.installmentPlanModel.findAll();
  }
}
