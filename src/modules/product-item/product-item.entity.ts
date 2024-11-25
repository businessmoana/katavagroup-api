import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Product } from '../product/product.entity';
import { OrderItem } from '../order-item/order-item.entity';

@Table({ tableName: 'product_item', timestamps: false })
export class ProductItem extends Model<ProductItem> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(255))
  package!: string;

  @Column(DataType.DECIMAL(65, 2))
  cost!: number;

  @Column(DataType.DECIMAL(65, 2))
  price_1!: number;

  @Column(DataType.DECIMAL(65, 2))
  price_2!: number;

  @Column(DataType.DECIMAL(65, 2))
  price_3!: number;

  @Column(DataType.DECIMAL(65, 2))
  price_4!: number;

  @Column(DataType.DECIMAL(65, 2))
  price_5!: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.DECIMAL(65, 2))
  package_qty!: number;

  
  @HasMany(() => OrderItem, { foreignKey: 'product_item_id' })
  orderItems!: OrderItem[];
}