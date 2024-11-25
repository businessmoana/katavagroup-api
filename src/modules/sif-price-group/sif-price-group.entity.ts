import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Location } from '../location/location.entity';

@Table({ tableName: 'sif_price_group', timestamps: false })
export class SifPriceGroup extends Model<SifPriceGroup> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
  })
  sifra!: number;

  @Column({
    type: DataType.INTEGER
  })
  status: number;

  @Column(DataType.STRING(50))
  naziv!: string;

  @HasMany(() => Location, { foreignKey: 'sif_price_group_id' })
  locations!: Location[];
}