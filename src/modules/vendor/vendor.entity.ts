import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { SifVendorTerms } from '../sif-vendor-terms/sif-vendor-terms.entity';

@Table({ tableName: 'vendor', timestamps: false })
export class Vendor extends Model<Vendor> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(255))
  vendor_name!: string;

  @ForeignKey(() => SifVendorTerms)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sif_vendor_terms_id!: number;

  @BelongsTo(() => SifVendorTerms)
  sifVendorTerms!: SifVendorTerms;

  @Column(DataType.STRING(255))
  contact_person!: string;

  @Column(DataType.STRING(50))
  phone_number!: string;

  @Column(DataType.STRING(50))
  email!: string;

  @Column(DataType.STRING(255))
  address!: string;

  @Column(DataType.STRING(50))
  city!: string;

  @Column(DataType.STRING(50))
  state!: string;

  @Column(DataType.STRING(20))
  zip_code!: string;

  @Column(DataType.TEXT)
  notes!: string;
}