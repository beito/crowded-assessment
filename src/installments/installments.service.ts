import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';

@Injectable()
export class InstallmentsService {
  private readonly logger = new Logger(InstallmentsService.name);

  constructor(
    @InjectModel(Installment) private installmentModel: typeof Installment,
    @InjectModel(InstallmentPlan) private installmentPlanModel: typeof InstallmentPlan
  ) {}

  async createInstallment(data: any) {
    if (!data.serviceId || !data.totalAmount || !data.installments || data.installments.length === 0) {
      this.logger.warn(`Invalid installment data received`);
      throw new BadRequestException('Invalid installment data');
    }

    this.logger.log(`Creating installment plan for service ${data.serviceId}`);
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

    if (!installment) {
      this.logger.warn(`Attempt to pay non-existing installment ${installmentId}`);
      throw new NotFoundException('Installment not found');
    }

    if (amount > installment.remainingAmount) {
      this.logger.warn(`Overpayment attempt on installment ${installmentId}`);
      throw new BadRequestException('Payment exceeds remaining amount');
    }

    installment.remainingAmount -= amount;
    await installment.save();

    const plan = await this.installmentPlanModel.findByPk(installment.installmentPlanId, {
      include: [Installment],
    });

    if (!plan) {
      this.logger.warn(`Installment plan not found for installment ${installmentId}`);
      throw new NotFoundException('InstallmentPlan not found');
    }

    const allInstallmentsPaid = plan.installments.every(i => i.remainingAmount === 0);
    if (allInstallmentsPaid) {
      plan.isPaid = true;
      await plan.save();
      this.logger.log(`Installment plan ${plan.installmentPlanId} is fully paid.`);
      return true;
    }

    return false;
  }
}
