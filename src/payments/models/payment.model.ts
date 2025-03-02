import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Installment } from '../../installments/models/installment.model';

@Table({ tableName: 'payments', timestamps: false })
export class Payment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  paymentId: number;

  @ForeignKey(() => Installment)
  @Column
  installmentId: number;

  @Column
  paymentMethod: string; // "ACH" o "Card"

  @Column
  amount: number;

  @Column
  paidAt: Date;
}
