import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { ProductItem } from '../product-item/product-item.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { ProductPurchasingItem } from '../product-purchasing-item/product-purchasing-item.entity';
import { ProductReceivingItem } from '../product-receiving-item/product-receiving-item.entity';
import { SifKategorija } from '../sif-ktegorija/sifK-ktegorija.entity';
import { Vendor } from '../vendor/vendor.entity';

@Table({ tableName: 'product', timestamps: false })
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column(DataType.STRING(50))
  item_number!: string;

  @Column(DataType.STRING(200))
  item_name!: string;

  @Column(DataType.STRING(100))
  item_brand!: string;

  @Column(DataType.STRING(50))
  shelf_life!: string;

  @Column(DataType.INTEGER)
  lot_number!: number;

  @Column(DataType.STRING(50))
  width!: string;

  @Column(DataType.STRING(50))
  height!: string;

  @Column(DataType.STRING(50))
  length!: string;

  @Column(DataType.STRING(50))
  weight!: string;

  @Column(DataType.INTEGER)
  ti!: number;

  @Column(DataType.INTEGER)
  hi!: number;

  @Column(DataType.INTEGER)
  pallet_ct!: number;

  @Column(DataType.INTEGER)
  min_qty_on_hand!: number;

  @Column(DataType.INTEGER)
  reordering_amount!: number;

  @Column(DataType.TEXT)
  note!: string;

  @Column(DataType.STRING(100))
  item_image!: string;

  @ForeignKey(() => SifKategorija)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  sif_kategorija_id!: number;

  @BelongsTo(() => SifKategorija)
  sifKategorija!: SifKategorija;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.INTEGER)
  public!: number;

  @Column(DataType.INTEGER)
  pomocna!: number;

  @Column(DataType.DECIMAL(65, 2))
  package_qty!: number;

  @Column(DataType.DECIMAL(65, 2))
  vendor_cost!: number;

  @HasOne(() => ProductItem, { foreignKey: 'product_id' })
  productItem!: ProductItem;

  @HasMany(() => OrderItem, { foreignKey: 'product_id' })
  orderItems!: OrderItem[];

  @HasOne(() => ProductPurchasingItem, { foreignKey: 'product_id' })
  productPurchasingItem!: ProductPurchasingItem;

  @HasMany(() => ProductReceivingItem, { foreignKey: 'product_id' })
  productReceivingItems!: ProductReceivingItem[];
}