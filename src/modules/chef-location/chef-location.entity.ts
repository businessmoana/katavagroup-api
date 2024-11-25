import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Chef } from '../chef/chef.entity';
import { Location } from '../location/location.entity';

@Table({ tableName: 'chef_location', timestamps: false })
export class ChefLocation extends Model<ChefLocation> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

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
}