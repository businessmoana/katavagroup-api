import { Injectable, NotFoundException } from '@nestjs/common';
import { extname, join } from 'path';
import { col, literal, Op, where } from 'sequelize';
import { paginate } from 'src/common/pagination/paginate';
import { ProductItem } from 'src/modules/product-item/product-item.entity';
import { Product } from 'src/modules/product/product.entity';
import { SifKategorija } from 'src/modules/sif-ktegorija/sifK-ktegorija.entity';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';
import { Vendor } from 'src/modules/vendor/vendor.entity';
import { promises as fs } from 'fs';
import { Orders } from 'src/modules/orders/orders.entity';
import { OrderItem } from 'src/modules/order-item/order-item.entity';
import { Location } from 'src/modules/location/location.entity';
import { LocationDate } from 'src/modules/location-date/location-date.entity';

@Injectable()
export class ProductsService {
  async getProducts({ search, orderBy, sortedBy, limit, page, is_active }: any): Promise<any> {
    if (!page) page = 1;
    const searchOptions = search ? {
      where: {
        [Op.or]: [
          { item_name: { [Op.like]: `%${search}%` } },
          { item_brand: { [Op.like]: `%${search}%` } },
        ],
      },
    } : {};
    const order = [];
    if (orderBy && sortedBy) {
      order.push([orderBy, sortedBy.toUpperCase()]);
    }
    // Fetch chefs with joins
    let status = (is_active == "true") ? 0 : 1;
    if (is_active == undefined)
      status = 0;
    const products = await Product.findAll({
      attributes: [
        'id',
        'item_number',
        'item_name',
        'item_brand',
        'status',
        [col('sifKategorija.naziv'), 'item_category'],
        'item_image',
      ],
      include: [
        {
          model: SifKategorija,
          attributes: [],
          order: [
            'naziv'
          ],
        },
      ],
      where: {
        status: status,
        ...searchOptions.where
      },
      order,
    })
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = products.slice(startIndex, endIndex);
    const url = `/products?search=${search}&status=${status}&limit=${limit}`;

    return {
      data: results,
      ...paginate(products.length, page, limit, results.length, url),
    };
  }

  async getProduct(id: number) {
    const productDetail = await Product.findByPk(id, {
      attributes: [
        'id',
        'item_number',
        'item_name',
        'item_brand',
        'shelf_life',
        [literal("COALESCE(lot_number,'')"), 'lot_number'],
        'width',
        'height',
        'length',
        'weight',
        [literal("COALESCE(ti,'')"), 'ti'],
        [literal("COALESCE(hi,'')"), 'hi'],
        [literal("COALESCE(pallet_ct,'')"), 'pallet_ct'],
        [literal("COALESCE(min_qty_on_hand,'')"), 'min_qty_on_hand'],
        [literal("COALESCE(reordering_amount,'')"), 'reordering_amount'],
        [col('sifKategorija.naziv'), 'naziv_kategorije'],
        'note',
        'sif_kategorija_id',
        'item_image',
        'public',
        [literal("COALESCE(Product.package_qty,'')"), 'package_qty'],
        [literal("COALESCE(vendor_cost,'')"), 'vendor_cost'],

      ],
      include: [
        {
          model: SifKategorija,
          attributes: [],
        },
      ]
    })

    const itemDetail = await ProductItem.findAll({
      attributes: [
        "id",
        "package",
        [literal("COALESCE(cost,'')"), 'cost'],
        [literal("COALESCE(price_1,'')"), 'price_1'],
        [literal("COALESCE(price_2,'')"), 'price_2'],
        [literal("COALESCE(price_3,'')"), 'price_3'],
        [literal("COALESCE(price_4,'')"), 'price_4'],
        [literal("COALESCE(price_5,'')"), 'price_5'],
        [literal("COALESCE(ProductItem.package_qty,'')"), 'package_qty'],
      ],
      where: {
        status: 0,
        product_id: id
      }
    })

    const priceGroupDetail = await SifPriceGroup.findAll({
      where: {
        status: 0
      },
      order: [
        'sifra'
      ]
    })

    return { productDetail, itemDetail, priceGroupDetail };
  }

  async deactiveProductItem(id: number) {
    await ProductItem.update(
      {
        status: 1
      },
      {
        where: {
          id: id
        }
      }
    )
    return true;
  }

  async createOrUpdateProductItem(data: any) {
    data.productItem.forEach(async (item: any) => {
      if (item.id == 0) {
        if (item.cost != '' || item.price_1 != '' || item.price_2 != '' || item.price_3 != '' || item.price_4 != '' || item.price_5 != '' || item.package_qty != '')
          await ProductItem.create({
            package: item.package,
            cost: item.cost,
            price_1: item.price_1,
            price_2: item.price_2,
            price_3: item.price_3,
            price_4: item.price_4,
            price_5: item.price_5,
            product_id: data.productId,
            status: 0,
            package_qty: item.package_qty,
          })
      } else {
        await ProductItem.update(
          {
            package: item.package,
            cost: item.cost,
            price_1: item.price_1,
            price_2: item.price_2,
            price_3: item.price_3,
            price_4: item.price_4,
            price_5: item.price_5,
            package_qty: item.package_qty,
          },
          {
            where: {
              id: item.id
            }
          }
        )
      }
    })
    return true;
  }

  async changeProductStatus(data: any) {
    await Product.update(
      {
        status: data.status == 0 ? 1 : 0
      },
      {
        where: {
          id: data.id
        }
      }
    )
    return true;
  }

  async createOrUpdateProduct(data: any) {
    let product: any;
    if (data.id == 0) {
      product = await Product.create({
        item_number: data.item_number,
        item_name: data.item_name,
        item_brand: data.item_brand,
        sif_kategorija_id: data.sif_kategorija,
        package_qty: data.package_qty,
        vendor_cost: data.vendor_cost,
        shelf_life: data.shelf_life,
        lot_number: data.lot_number,
        width: data.width,
        height: data.height,
        length: data.length,
        weight: data.weight,
        ti: data.ti,
        hi: data.hi,
        pallet_ct: data.pallet_ct,
        min_qty_on_hand: data.min_qty_on_hand,
        reordering_amount: data.reordering_amount,
        public: data.public,
        note: data.note,
        status: 0,
      })
    } else {
      await Product.update(
        {
          item_number: data.item_number,
          item_name: data.item_name,
          item_brand: data.item_brand,
          sif_kategorija_id: Number(data.sif_kategorija),
          package_qty: data.package_qty,
          vendor_cost: data.vendor_cost,
          shelf_life: data.shelf_life,
          lot_number: data.lot_number,
          width: data.width,
          height: data.height,
          length: data.length,
          weight: data.weight,
          ti: data.ti,
          hi: data.hi,
          pallet_ct: data.pallet_ct,
          min_qty_on_hand: data.min_qty_on_hand,
          reordering_amount: data.reordering_amount,
          public: data.public,
          note: data.note,
        },
        {
          where: {
            id: data.id
          }
        }
      )

      product = await Product.findByPk(data.id)
    }
    return product;
  }

  async updateProductImage(productId: number, oldFileName: string): Promise<void> {
    const newFileName = `${productId}_${oldFileName}`; // Create new file name with product ID
    const oldPath = join(__dirname, '../../media/product-images', oldFileName); // Path to the old file
    const newPath = join(__dirname, '../../media/product-images', newFileName); // New file path

    await fs.rename(oldPath, newPath); // Rename (move) the file
    await Product.update({ item_image: oldFileName }, { where: { id: productId } }); // Update the product with the new image filename
  }

  async removeProductImage(productId: any, imageName: any) {
    await Product.update(
      {
        item_image: '',
      },
      {
        where: {
          id: productId
        }
      }
    )

    const filePath = join(__dirname, '../../media/product-images', `${productId}_${imageName}`);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      return false;
    }
    return true;
  }

  async duplicateProduct(productId: any) {
    const oldProduct = await Product.findByPk(productId);
    const newProduct = await Product.create({
      item_number: oldProduct.item_number,
      item_name: oldProduct.item_name,
      item_brand: oldProduct.item_brand,
      shelf_life: oldProduct.shelf_life,
      lot_number: oldProduct.lot_number,
      width: oldProduct.width,
      height: oldProduct.height,
      length: oldProduct.length,
      weight: oldProduct.weight,
      ti: oldProduct.ti,
      hi: oldProduct.hi,
      pallet_ct: oldProduct.pallet_ct,
      min_qty_on_hand: oldProduct.min_qty_on_hand,
      reordering_amount: oldProduct.reordering_amount,
      note: oldProduct.note,
      sif_kategorija_id: Number(oldProduct.sif_kategorija_id),
      status: oldProduct.status,
      public: oldProduct.public,
      pomocna: oldProduct.pomocna,
      package_qty: oldProduct.package_qty,
      vendor_cost: oldProduct.vendor_cost,
    })
    const oldProductItem = await ProductItem.findOne({
      where: {
        product_id: productId,
        status: 0
      }
    });
    const newProductItem = await ProductItem.create({
      package: oldProductItem.package,
      cost: oldProductItem.cost,
      price_1: oldProductItem.price_1,
      price_2: oldProductItem.price_2,
      price_3: oldProductItem.price_3,
      price_4: oldProductItem.price_4,
      price_5: oldProductItem.price_5,
      product_id: productId,
      status: 0
    })

    return newProduct;
  }

  async getOrders(data: any) {
    const orders = await Orders.findAll({
      attributes: [
        [col('Orders.id'), 'order_id'],
        [col("location.location_name"), 'location_name'],
        [literal("COALESCE(DATE_FORMAT(locationDate.order_date,'%m/%d/%Y'), '')"), 'date_for_list'],
        [literal("COALESCE(DATE_FORMAT(Orders.datum,'%m/%d/%Y'), '')"), 'datum_porudzbine'],
        // 'delivery_option',
        'flag_approved',
        'pallet_cost',
        'tax',
      ],
      include: [
        {
          model: Location,
          attributes: [],
        },
        {
          model: LocationDate,
          attributes: [],
        },
        {
          model: OrderItem,
          attributes: [
            'id',
            'prodajna_kolicina',
          ],
          include: [
            {
              model: Product,
              attributes: ['item_name'],
            },
            {
              model: ProductItem,
              attributes: ['package'],
            },
          ],
          where: {
            status: {
              [Op.ne]: 3,
            },
          },
        },
      ],
      where: {
        datum: {
          [Op.gte]: new Date(data.startDate + 'T00:00:00'), // Start of the day
          [Op.lte]: new Date(data.endDate + 'T23:59:59'),   // End of the day
        },
        status: 0,
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC'],
        ['datum', 'ASC'],
      ],
    });
    return orders
  }

  async approveOrder(data: any) {
    const detail: any = await Orders.findOne({
      attributes: [
        // [col("Location.location_name"), 'location_name'],
        [literal("DATE_FORMAT(now(),'%m%d%y')"), 'ship_date']
      ],
      include: [
        {
          model: Location,
          attributes: ['location_name'],
        }
      ],
      where: {
        id: data.orderId
      }
    })
    const invoiceNumber = `${detail.location.location_name}_${detail.ship_date}`;
    await Orders.update({
      flag_approved: 0,
      ship_date: new Date(),
      invoice_number: invoiceNumber
    },
      {
        where: {
          id: data.orderId
        }
      })
    return true;
  }

  async removeOrderItem(data: any) {
    let orderItems = await OrderItem.findAll({
      where: {
        orders_id: data.orderId,
        status: {
          [Op.ne]: 3,
        },
      }
    })
    if (orderItems.length == 1) {
      await LocationDate.update(
        {
          orders_id: null
        },
        {
          where: {
            orders_id: data.orderId
          }
        }
      )
      await Orders.update(
        {
          status: 1
        },
        {
          where: {
            id: data.orderId
          }
        }
      )
    }

    await OrderItem.update(
      {
        status: 3
      },
      {
        where: {
          id: data.orderItemId
        }
      }
    )

    orderItems = await OrderItem.findAll({
      where: {
        orders_id: data.orderId,
        status: {
          [Op.ne]: 3,
        },
      }
    })

    const totalPrice = orderItems.reduce((total, item) => {
      return total + (item.price * item.prodajna_kolicina);
    }, 0);

    await Orders.update(
      {
        ukupna_cena: totalPrice
      },
      {
        where: {
          id: data.orderId
        }
      }
    )

    return true;
  }

  async removeOrder(id: any) {
    await LocationDate.update({
      orders_id: null
    }, {
      where: {
        orders_id: id
      }
    })

    await OrderItem.update(
      {
        status: 3
      },
      {
        where: {
          orders_id: id
        }
      }
    )
    await Orders.update(
      {
        status: 1
      }, {
      where: {
        id: id
      }
    }
    )
    return true;
  }

  async savePalletTax(data: any) {
    await Orders.update(
      {
        pallet_cost: data.pallet_cost,
        tax: data.tax
      },
      {
        where: {
          id: data.orderId
        }
      }
    )
    return true;
  }

  async getOrderItem(orderItemId: any) {
    const orderItem = await OrderItem.findByPk(orderItemId);
    return orderItem
  }

  async updateOrderItem(data: any) {
    await OrderItem.update(
      {
        prodajna_kolicina: data.quantity,
        status: 2
      },
      {
        where: {
          id: data.orderItemId
        }
      }
    )
    const orderItems = await OrderItem.findAll({
      where: {
        orders_id: data.orderId,
        status: {
          [Op.ne]: 3,
        },
      }
    })

    const totalPrice = orderItems.reduce((total, item) => {
      return total + (item.price * item.prodajna_kolicina);
    }, 0);

    await Orders.update(
      {
        ukupna_cena: totalPrice
      },
      {
        where: {
          id: data.orderId
        }
      }
    )
    return true;
  }

  async getProductsList() {
    const products = await Product.findAll({
      attributes: [
        [col('Product.id'), 'product_id'],
        [col("Product.item_name"), "item_name"],
        [col("Product.item_number"), "item_number"],
        [col("Product.item_brand"), "item_brand"],
        [col("productItems.id"), "product_item_id"],
        [col("productItems.package"), "package"],
      ],
      include: [
        {
          model: ProductItem,
          attributes: [],
          where: {
            status: 0
          }
        }
      ],
      where: {
        status: 0
      },
      order: [
        'item_name'
      ]
    })
    return products;
  }

  async newOrderItem(data: any) {
    const order = await Orders.findOne({
      where: {
        id: data.orderId
      },
      include: [
        {
          model: Location,
          include: [
            {
              model: SifPriceGroup,
              attributes: ['sifra']
            }
          ]
        }
      ]
    })
    const sifra = order.location.sifPriceGroup.sifra;
    const columnName = `price_${sifra}`;
    const productItem = await ProductItem.findByPk(data.product.product_item_id)
    const price = productItem[`${columnName}`];

    await OrderItem.create({
      kolicina: data.quantity,
      product_id: data.product.product_id,
      orders_id: data.orderId,
      product_item_id: data.product.product_item_id,
      prodajna_kolicina: data.quantity,
      status: 1,
      new: 1,
      price: price
    })

    const orderItems = await OrderItem.findAll({
      where: {
        orders_id: data.orderId,
        status: {
          [Op.ne]: 3,
        },
      }
    })

    const totalPrice = orderItems.reduce((total, item) => {
      return total + (item.price * item.prodajna_kolicina);
    }, 0);

    await Orders.update(
      {
        ukupna_cena: totalPrice,
        br_proizvoda:literal('br_proizvoda + 1'),
      },
      {
        where: {
          id: data.orderId
        }
      }
    )

    return true;
  }
}
