import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Installment } from '../../installments/models/installment.model';
import { User } from '../../auth/models/user.model';

@Table({ tableName: 'payments', timestamps: false })
export class Payment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  paymentId: number;

  @ForeignKey(() => Installment)
  @Column
  installmentId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  paymentMethod: string;

  @Column
  amount: number;

  @Column
  paidAt: Date;

  @BelongsTo(() => User)
  user: User;
}
