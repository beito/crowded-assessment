import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { InstallmentPlan } from '../../installments/models/installment-plan.model';
import { Payment } from '../../payments/models/payment.model';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @HasMany(() => InstallmentPlan)
  declare installmentPlan: InstallmentPlan[];

  @HasMany(() => Payment)
  declare payments: Payment[];
}
