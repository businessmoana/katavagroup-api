import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Orders } from '../orders/orders.entity';
import { Product } from '../product/product.entity';
import { ProductItem } from '../product-item/product-item.entity';

@Table({ tableName: 'order_item', timestamps: false })
export class OrderItem extends Model<OrderItem> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.DECIMAL(65, 2))
  kolicina!: number;

  @Column(DataType.DECIMAL(65, 2))
  prodajna_kolicina!: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => ProductItem)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  product_item_id!: number;

  @BelongsTo(() => ProductItem)
  productItem!: ProductItem;

  @ForeignKey(() => Orders)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  orders_id!: number;
  @BelongsTo(() => Orders)
  orders!: Orders;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.INTEGER)
  new!: number;

  @Column(DataType.DECIMAL(65, 2))
  price!: number;
}