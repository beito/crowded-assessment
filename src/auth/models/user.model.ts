import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  userId: number;

  @Column
  email: string;

  @Column
  password: string;
}
