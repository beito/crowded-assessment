import { Table, Column, Model, HasMany, DataType } from 'sequelize-typescript';
import { InstallmentPlan } from '../../installments/models/installment-plan.model';

@Table({ tableName: 'services', timestamps: false })
export class Service extends Model<Service> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare serviceId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  declare price: number;

  @HasMany(() => InstallmentPlan)
  declare installmentPlan: InstallmentPlan[];
}
