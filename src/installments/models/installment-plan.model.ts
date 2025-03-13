import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasMany,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Service } from '../../service/models/service.model';
import { Installment } from './installment.model';
import { User } from '../../auth/models/user.model';

@Table({ tableName: 'installment_plan', timestamps: true })
export class InstallmentPlan extends Model<InstallmentPlan> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare installmentPlanId: number;

  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare serviceId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isPaid: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @HasMany(() => Installment)
  declare installments: Installment[];

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Service)
  declare service: Service;
}
