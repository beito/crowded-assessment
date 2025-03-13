import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Installment } from './models/installment.model';
import { InstallmentPlan } from './models/installment-plan.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class InstallmentsService {
  private readonly logger = new Logger(InstallmentsService.name);

  constructor(
    @InjectModel(Installment) private installmentModel: typeof Installment,
    @InjectModel(InstallmentPlan) private installmentPlanModel: typeof InstallmentPlan
  ) {}

  async createInstallment(data: any) {
    if (!data.serviceId || !data.totalAmount || !data.installmentsCount) {
      this.logger.warn(`Invalid installment data received`);
      throw new BadRequestException('Invalid installment data');
    }
  
    this.logger.log(`Creating installment plan for service ${data.serviceId}`);
  
    if (!data.userId) {
      this.logger.warn(`Installment plan must be linked to a user.`);
      throw new BadRequestException('User ID is required.');
    }
  
    const installmentPlan = await this.installmentPlanModel.create({
      serviceId: data.serviceId,
      totalAmount: data.totalAmount,
      userId: data.userId,
      isPaid: false,
    } as CreationAttributes<InstallmentPlan>);

    const installmentAmount = data.totalAmount / data.installmentsCount;
    const dueDates = this.generateDueDates(data.installmentsCount);
  
    const installments = dueDates.map((dueDate) => ({
      installmentPlanId: installmentPlan.installmentPlanId,
      userId: data.userId,
      dueDate: dueDate,
      amount: installmentAmount,
      remainingAmount: installmentAmount,
    }));
  
    await this.installmentModel.bulkCreate(installments as any[]);
  
    return installmentPlan;
  }
  
  private generateDueDates(count: number): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date();
    for (let i = 0; i < count; i++) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      dates.push(new Date(currentDate));
    }
    return dates;
  }

  async getAllInstallments() {
    return this.installmentPlanModel.findAll({
      include: [Installment],
    });
  }

  async getCompletedInstallments() {
    return this.installmentPlanModel.findAll({
      where: { isPaid: true },
      include: [Installment],
    });
  }
}
