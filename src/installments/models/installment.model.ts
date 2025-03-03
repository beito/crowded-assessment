import { Table, Column, Model, ForeignKey, HasMany, BelongsTo, DataType } from 'sequelize-typescript';
import { InstallmentPlan } from './installment-plan.model';
import { Payment } from '../../payments/models/payment.model';

@Table({ tableName: 'installments', timestamps: false })
export class Installment extends Model<Installment> {
  @Column({ 
    type: DataType.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  })
  declare installmentId: number;

  @ForeignKey(() => InstallmentPlan)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare installmentPlanId: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare dueDate: Date;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare amount: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare remainingAmount: number;

  @HasMany(() => Payment)
  declare payments: Payment[];

  @BelongsTo(() => InstallmentPlan)
  declare installmentPlan: InstallmentPlan;
}
