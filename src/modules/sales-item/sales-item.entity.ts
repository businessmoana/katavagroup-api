import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sales } from '../sales/sales.entity';

@Table({ tableName: 'sales_item', timestamps: false })
export class SalesItem extends Model<SalesItem> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(200))
  description!: string;

  @Column(DataType.DATE)
  start_date!: Date;

  @Column(DataType.DATE)
  end_date!: Date;

  @Column(DataType.STRING(100))
  date_period!: string;

  @Column(DataType.DECIMAL(65, 2))
  sales!: number;

  @Column(DataType.INTEGER)
  quantity!: number;

  @Column(DataType.DECIMAL(65, 2))
  commission!: number;

  @Column(DataType.DECIMAL(65, 2))
  chef_commission!: number;

  @ForeignKey(() => Sales)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sales_id!: number;

  @Column(DataType.INTEGER)
  tip!: number;

  @Column(DataType.INTEGER)
  status!: number;
}