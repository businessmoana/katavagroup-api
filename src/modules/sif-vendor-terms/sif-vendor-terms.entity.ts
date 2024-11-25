import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Vendor } from '../vendor/vendor.entity';

@Table({ tableName: 'sif_vendor_terms', timestamps: false })
export class SifVendorTerms extends Model<SifVendorTerms> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(50))
  name!: string;

  @Column(DataType.STRING(255))
  description!: string;

  @Column(DataType.INTEGER)
  payment_days!: number;

  @Column(DataType.DECIMAL(65, 2))
  discount_percentage!: number;

  @HasMany(() => Vendor, { foreignKey: 'sif_vendor_terms_id' })
  vendors!: Vendor[];
}