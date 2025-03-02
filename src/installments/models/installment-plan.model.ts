import { Table, Column, Model, ForeignKey, HasMany } from 'sequelize-typescript';
import { Service } from '../../service/models/service.model';
import { Installment } from './installment.model';

@Table({ tableName: 'installment_plans', timestamps: false })
export class InstallmentPlan extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  installmentPlanId: number;

  @ForeignKey(() => Service)
  @Column
  serviceId: number;

  @Column
  totalAmount: number;

  @HasMany(() => Installment)
  installments: Installment[];
}
