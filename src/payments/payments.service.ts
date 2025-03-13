import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { Installment } from '../installments/models/installment.model';
import { InstallmentPlan } from '../installments/models/installment-plan.model';
import { CreationAttributes } from 'sequelize';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Installment) private installmentModel: typeof Installment,
    @InjectModel(InstallmentPlan) private installmentPlanModel: typeof InstallmentPlan,
  ) {}

  async createPayment(
    data: { installmentId: number; amount: number; paymentMethod: string },
    userId: number
  ) {
    this.logger.log(`Processing payment for installment ${data.installmentId}`);

    const installment = await this.installmentModel.findByPk(data.installmentId, {
      include: ['installmentPlan'],
    });

    if (!installment) {
      this.logger.warn(`Attempt to pay non-existing installment ${data.installmentId}`);
      throw new NotFoundException('Installment not found');
    }

    const paymentsCount = await this.paymentModel.count({
      where: { installmentId: data.installmentId },
    });

    if (paymentsCount > 0) {
      this.logger.warn(`Installment ${data.installmentId} has already been paid.`);
      throw new BadRequestException('This installment has already been paid.');
    }

    const allInstallments = await this.installmentModel.findAll({
      where: { installmentPlanId: installment.installmentPlanId },
    });

    const totalInstallments = allInstallments.length;
    const totalPayments = await this.paymentModel.count({
      where: { installmentId: allInstallments.map(i => i.installmentId) },
    });

    const totalRemaining = totalInstallments - totalPayments;
    const installmentAmount = installment.amount;
  
    if (data.amount !== installmentAmount && data.amount !== totalRemaining * installmentAmount) {
      this.logger.warn(`Invalid payment amount: ${data.amount} for installment ${data.installmentId}`);
      throw new BadRequestException(
        'Payment must match either an installment amount or the total remaining balance'
      );
    }

    if (data.amount === totalRemaining * installmentAmount) {
      const bulkPayments = allInstallments
        .filter(inst => !this.paymentModel.findOne({ where: { installmentId: inst.installmentId } }))
        .map(inst => ({
          installmentId: inst.installmentId,
          amount: inst.amount,
          paymentMethod: data.paymentMethod,
          userId,
          paidAt: new Date(),
        }));

      await this.paymentModel.bulkCreate(bulkPayments as CreationAttributes<Payment>[]);

      this.logger.log(`All remaining installments have been paid.`);
    } else {
      await this.paymentModel.create({
        installmentId: data.installmentId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        userId,
        paidAt: new Date(),
      } as CreationAttributes<Payment>);

      this.logger.log(`This installment has been paid.`);
    }
  
    const totalPaid = await this.paymentModel.count({
      where: { installmentId: allInstallments.map(i => i.installmentId) },
    });
  
    if (totalPaid === totalInstallments) {
      const installmentPlan = await this.installmentPlanModel.findOne({
        where: { installmentPlanId: installment.installmentPlanId },
      });
  
      if (installmentPlan) {
        installmentPlan.isPaid = true;
        await installmentPlan.save();

        this.logger.log(`Installment plan ${installmentPlan.installmentPlanId} is fully paid.`);
      }
    }
  
    return { message: 'Payment processed successfully' };
  }
}
