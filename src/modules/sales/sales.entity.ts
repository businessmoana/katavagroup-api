import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { SalesDateInterval } from '../sales-date-interval/sales-date-interval.entity';
import { Location } from '../location/location.entity';
import { Chef } from '../chef/chef.entity';
import { SalesItem } from '../sales-item/sales-item.entity';

@Table({ tableName: 'sales', timestamps: false })
export class Sales extends Model<Sales> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => SalesDateInterval)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sales_date_interval_id!: number;

  @BelongsTo(() => SalesDateInterval)
  salesDateInterval!: SalesDateInterval;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  location_id!: number;

  @BelongsTo(() => Location)
  location!: Location;

  @ForeignKey(() => Chef)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  chef_id!: number;

  @BelongsTo(() => Chef)
  chef!: Chef;

  @Column(DataType.INTEGER)
  orders_id!: number;

  @Column(DataType.INTEGER)
  items_count!: number;

  @Column(DataType.INTEGER)
  flag_approved!: number;

  @Column(DataType.DATE)
  approved_date!: Date;

  @Column(DataType.INTEGER)
  status!: number;

  @HasMany(() => SalesItem)
  salesItems!: SalesItem[];
}