import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { KorisnickiNalog } from '../korisnicki-nalog/korisnicki-nalog.entity';

@Table({ tableName: 'sif_uloga', timestamps: false })
export class SifUloga extends Model<SifUloga> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  naziv!: string;

  @Column(DataType.STRING(255))
  opis!: string;

  @HasMany(() => KorisnickiNalog, { foreignKey: 'sif_uloga_id' })
  korisnickiNalogs!: KorisnickiNalog[];
}