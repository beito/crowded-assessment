import { Table, Column, Model, ForeignKey, HasMany } from 'sequelize-typescript';
import { InstallmentPlan } from './installment-plan.model';
import { Payment } from '../../payments/models/payment.model';

@Table({ tableName: 'installments', timestamps: false })
export class Installment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  installmentId: number;

  @ForeignKey(() => InstallmentPlan)
  @Column
  installmentPlanId: number;

  @Column
  dueDate: Date;

  @Column
  amount: number;

  @Column
  remainingAmount: number;

  @HasMany(() => Payment)
  payments: Payment[];
}