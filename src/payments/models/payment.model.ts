import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Installment } from '../../installments/models/installment.model';
import { User } from '../../auth/models/user.model';

@Table({ tableName: 'payments', timestamps: false })
export class Payment extends Model<Payment> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare paymentId: number;

  @ForeignKey(() => Installment)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare installmentId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare paymentMethod: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare amount: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare paidAt: Date;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Installment)
  declare installment: Installment;
}
