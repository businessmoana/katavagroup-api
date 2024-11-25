import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProductReceiving } from '../product-receiving/product-receiving.entity';
import { Product } from '../product/product.entity';

@Table({ tableName: 'product_receiving_item', timestamps: false })
export class ProductReceivingItem extends Model<ProductReceivingItem> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => ProductReceiving)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_receiving_id!: number;

  @BelongsTo(() => ProductReceiving)
  productReceiving!: ProductReceiving;


  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;


  @Column(DataType.DECIMAL(65, 2))
  quantity_received!: number;

  @Column(DataType.STRING(255))
  notes!: string;
}