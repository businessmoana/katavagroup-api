import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Chef } from '../chef/chef.entity';
import { Sales } from '../sales/sales.entity';
import { SifUloga } from '../sif-uloga.entity/sif-uloga.entity';

@Table({ tableName: 'korisnicki_nalog', timestamps: false })
export class KorisnickiNalog extends Model<KorisnickiNalog> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  korisnicko_ime!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  lozinka!: string;

  @Column(DataType.DATE)
  datum_otvaranja_naloga!: Date;

  @Column(DataType.INTEGER)
  broj_logovanja!: number;

  @Column(DataType.DATE)
  datum_poslednjeg_logovanja!: Date;

  @ForeignKey(() => SifUloga)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sif_uloga_id!: number;

  @BelongsTo(() => SifUloga)
  sifUloga!: SifUloga;

  @HasMany(() => Chef, { foreignKey: 'korisnicki_nalog_id' })
  chefs!: Chef[];

  @HasMany(() => Sales, { foreignKey: 'korisnicki_nalog_id' })
  sales!: Sales[];
}