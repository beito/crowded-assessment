import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';

@Injectable()
export class InstallmentsService {
  constructor(
    @InjectModel(Installment) private installmentModel: typeof Installment,
    @InjectModel(InstallmentPlan) private installmentPlanModel: typeof InstallmentPlan
  ) {}

  async createInstallment(data: any) {
    return this.installmentPlanModel.create(data);
  }

  async getAllInstallments() {
    return this.installmentPlanModel.findAll();
  }

  async getCompletedInstallments() {
    return this.installmentPlanModel.findAll({ where: { isPaid: true } });
  }

  async registerPayment(installmentId: number, amount: number): Promise<boolean> {
    const installment = await this.installmentModel.findByPk(installmentId, {
      include: [InstallmentPlan],
    });

    if (!installment) throw new Error('Installment not found');
    if (amount > installment.remainingAmount) throw new Error('Payment exceeds remaining amount');

    installment.remainingAmount -= amount;
    await installment.save();

    const plan = await this.installmentPlanModel.findByPk(installment.installmentPlanId, {
      include: [Installment],
    });

    if (!plan) throw new Error('InstallmentPlan not found');

    const allInstallmentsPaid = plan.installments.every(i => i.remainingAmount === 0);
    if (allInstallmentsPaid) {
      plan.isPaid = true;
      await plan.save();
      return true;
    }

    return false;
  }
}
