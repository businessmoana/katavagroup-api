import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'chef',
    timestamps: false
})
export class Chef extends Model<Chef> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middle_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dob: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ssn: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zip_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_ein: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_state: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  company_zip_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emergency_contact: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  license_due: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  note: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  korisnicki_nalog_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  status: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  pomocna: number;
}