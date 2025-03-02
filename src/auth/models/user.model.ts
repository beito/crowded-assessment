import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { InstallmentPlan } from '../../installments/models/installment-plan.model';
import { Payment } from '../../payments/models/payment.model';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  userId: number;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => InstallmentPlan)
  installmentPlans: InstallmentPlan[];

  @HasMany(() => Payment)
  payments: Payment[];
}
