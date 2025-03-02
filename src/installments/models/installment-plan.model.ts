import { Table, Column, Model, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { Service } from '../../service/models/service.model';
import { Installment } from './installment.model';
import { User } from '../../auth/models/user.model';

@Table({ tableName: 'installment_plans', timestamps: false })
export class InstallmentPlan extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  installmentPlanId: number;

  @ForeignKey(() => Service)
  @Column
  serviceId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  totalAmount: number;

  @Column({ defaultValue: false })
  isPaid: boolean;

  @HasMany(() => Installment)
  installments: Installment[];
}
