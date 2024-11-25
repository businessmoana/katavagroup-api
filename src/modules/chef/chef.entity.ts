import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { KorisnickiNalog } from '../korisnicki-nalog/korisnicki-nalog.entity';
import { ChefLocation } from '../chef-location/chef-location.entity';
import { Orders } from '../orders/orders.entity';

@Table({ tableName: 'chef', timestamps: false })
export class Chef extends Model<Chef> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(255))
  first_name!: string;

  @Column(DataType.STRING(100))
  middle_name!: string;

  @Column(DataType.STRING(255))
  last_name!: string;

  @Column(DataType.STRING(50))
  email!: string;

  @Column(DataType.DATE)
  dob!: Date;

  @Column(DataType.STRING(50))
  phone_number!: string;

  @Column(DataType.STRING(100))
  ssn!: string;

  @Column(DataType.STRING(500))
  address!: string;

  @Column(DataType.STRING(50))
  city!: string;

  @Column(DataType.STRING(50))
  state!: string;

  @Column(DataType.STRING(20))
  zip_code!: string;

  @Column(DataType.STRING(255))
  company_name!: string;

  @Column(DataType.STRING(50))
  company_email!: string;

  @Column(DataType.STRING(50))
  company_phone!: string;

  @Column(DataType.STRING(100))
  company_ein!: string;

  @Column(DataType.STRING(255))
  company_address!: string;

  @Column(DataType.STRING(50))
  company_city!: string;

  @Column(DataType.STRING(50))
  company_state!: string;

  @Column(DataType.STRING(20))
  company_zip_code!: string;

  @Column(DataType.STRING(200))
  emergency_contact!: string;

  @Column(DataType.DATE)
  license_due!: Date;

  @Column(DataType.TEXT)
  note!: string;

  @ForeignKey(() => KorisnickiNalog)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  korisnicki_nalog_id!: number;

  @BelongsTo(() => KorisnickiNalog)
  korisnickiNalog!: KorisnickiNalog;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  status: number;

  @HasMany(() => ChefLocation, { foreignKey: 'chef_id' })
  chefLocations!: ChefLocation[];

  @HasMany(() => Orders, { foreignKey: 'chef_id' })
  orders!: Orders[];
}