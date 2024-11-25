import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ProductReceivingItem } from '../product-receiving-item/product-receiving-item.entity';

@Table({ tableName: 'product_receiving', timestamps: false })
export class ProductReceiving extends Model<ProductReceiving> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.DATE)
  receiving_date!: Date;

  @Column(DataType.STRING(255))
  note!: string;

  @HasMany(() => ProductReceivingItem, { foreignKey: 'product_receiving_id' })
  productReceivingItems!: ProductReceivingItem[];
}