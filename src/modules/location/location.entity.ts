import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LocationDate } from '../location-date/location-date.entity';
import { Orders } from '../orders/orders.entity';
import { ChefLocation } from '../chef-location/chef-location.entity';
import { SifPriceGroup } from '../sif-price-group/sif-price-group.entity';
import { Sales } from '../sales/sales.entity';

@Table({ tableName: 'location', timestamps: false })
export class Location extends Model<Location> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(50))
  location_number!: string;

  @Column(DataType.STRING(255))
  location_name!: string;

  @Column(DataType.STRING(500))
  location_address!: string;

  @Column(DataType.DATE)
  license_permit_due!: Date;

  @Column(DataType.TEXT)
  note!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  status: number;
  
  @ForeignKey(() => SifPriceGroup)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sif_price_group_id!: number;

  @BelongsTo(() => SifPriceGroup)
  sifPriceGroup!: SifPriceGroup;

  @HasMany(() => Sales, { foreignKey: 'location_id' })
  sales!: Sales[];

  @HasMany(() => LocationDate, { foreignKey: 'location_id' })
  locationDates!: LocationDate[];

  @HasMany(() => Orders, { foreignKey: 'location_id' })
  orders!: Orders[];

  @HasMany(() => ChefLocation, { foreignKey: 'location_id' })
  chefLocations!: ChefLocation[];
}