import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Sales } from '../sales/sales.entity';

@Table({ tableName: 'sales_date_interval', timestamps: false })
export class SalesDateInterval extends Model<SalesDateInterval> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.DATE)
  start_date!: Date;

  @Column(DataType.DATE)
  end_date!: Date;

  @Column(DataType.STRING)
  year!: String;

  @Column({
    type: DataType.INTEGER
  })
  status: number;

  @HasMany(() => Sales)
  sales!: Sales[];
}