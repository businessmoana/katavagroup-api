import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { Chef } from '../chef/chef.entity';
import { Location } from '../location/location.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { LocationDate } from '../location-date/location-date.entity';

@Table({ tableName: 'orders', timestamps: false })
export class Orders extends Model<Orders> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.DECIMAL(65, 2))
  ukupna_cena!: number;

  @Column(DataType.INTEGER)
  br_proizvoda!: number;

  @Column(DataType.DATE)
  datum!: Date;

  @Column(DataType.INTEGER)
  delivery_option!: number;

  @ForeignKey(() => Chef)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  chef_id!: number;

  @BelongsTo(() => Chef)
  chef!: Chef;

  @ForeignKey(() => Location)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  location_id!: number;
  
  @BelongsTo(() => Location)
  location!: Location;

  @Column(DataType.INTEGER)
  status!: number;
  
  @Column(DataType.INTEGER)
  flag_approved!: number;

  @Column(DataType.DATE)
  ship_date!: Date;

  @Column(DataType.STRING(50))
  invoice_number!: string;

  @Column(DataType.DECIMAL(65, 2))
  pallet_cost!: number;

  @Column(DataType.DECIMAL(65, 2))
  tax!: number;

  @Column(DataType.DECIMAL(65, 2))
  order_price!: number;

  @HasMany(() => OrderItem, { foreignKey: 'orders_id' })
  orderItems!: OrderItem[];
  
  @HasOne(() => LocationDate, { foreignKey: 'orders_id' })
  locationDate!: LocationDate;
}