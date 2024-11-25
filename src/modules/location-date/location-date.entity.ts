import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Location } from '../location/location.entity';
import { Orders } from '../orders/orders.entity';

@Table({ tableName: 'location_date', timestamps: false })
export class LocationDate extends Model<LocationDate> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  location_id!: number;

  @BelongsTo(() => Location)
  location!: Location;

  @ForeignKey(() => Orders)
  @Column({ type: DataType.INTEGER })
  orders_id!: number;

  @BelongsTo(() => Orders)
  order!: Orders;

  @Column(DataType.DATE)
  order_date!: Date;
}