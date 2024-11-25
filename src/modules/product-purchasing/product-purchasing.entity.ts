import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ProductPurchasingItem } from '../product-purchasing-item/product-purchasing-item.entity';

@Table({ tableName: 'product_purchasing', timestamps: false })
export class ProductPurchasing extends Model<ProductPurchasing> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.DATE)
  purchase_date!: Date;

  @Column(DataType.DATE)
  entry_date!: Date;

  @Column(DataType.TEXT)
  notes!: string;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.INTEGER)
  received_flag!: number;

  @HasMany(() => ProductPurchasingItem, { foreignKey: 'product_purchasing_id' })
  productPurchasingItems!: ProductPurchasingItem[];
}