import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { InstallmentPlan } from '../../installments/models/installment-plan.model';

@Table({ tableName: 'services', timestamps: false })
export class Service extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  serviceId: number;

  @Column
  name: string;

  @Column
  price: number;

  @HasMany(() => InstallmentPlan)
  installmentPlans: InstallmentPlan[];
}
