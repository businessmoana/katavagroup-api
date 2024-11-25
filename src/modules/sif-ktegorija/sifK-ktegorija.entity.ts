import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from '../product/product.entity';

@Table({ tableName: 'sif_kategorija', timestamps: false })
export class SifKategorija extends Model<SifKategorija> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(50))
  naziv!: string;

  @HasMany(() => Product, { foreignKey: 'sif_kategorija_id' })
  products!: Product[];
}