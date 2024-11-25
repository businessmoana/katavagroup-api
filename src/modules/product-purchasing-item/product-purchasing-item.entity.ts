import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProductPurchasing } from '../product-purchasing/product-purchasing.entity';
import { Product } from '../product/product.entity';

@Table({ tableName: 'product_purchasing_item', timestamps: false })
export class ProductPurchasingItem extends Model<ProductPurchasingItem> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => ProductPurchasing)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_purchasing_id!: number;

  @BelongsTo(() => ProductPurchasing)
  productPurchasing!: ProductPurchasing;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column(DataType.DECIMAL(65, 2))
  quantity!: number;

  @Column(DataType.DECIMAL(65, 2))
  unit_price!: number;
}