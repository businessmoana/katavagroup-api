import { Injectable } from '@nestjs/common';
// import analyticsJson from '@db/analytics.json';
// import categoryWiseProductJson from '@db/category-wise-product.json';
// import lowStockProductsJson from '@db/low-stock-products.json';
// import topRateProductJson from '@db/top-rate-product.json';
// import { plainToClass } from 'class-transformer';
// import { Analytics } from './entities/analytics.entity';
// import { CategoryWiseProduct } from './entities/category-wise-product.entity';
// import { TopRateProduct } from './entities/top-rate-product.entity';
import { Product } from 'src/modules/product/product.entity';
import { Chef } from 'src/modules/chef/chef.entity';
import { Location } from 'src/modules/location/location.entity';
import { Orders } from 'src/modules/orders/orders.entity';
import { literal } from 'sequelize';

// const analytics = plainToClass(Analytics, analyticsJson);

// const categoryWiseProduct = plainToClass(
//   CategoryWiseProduct,
//   categoryWiseProductJson,
// );

// const lowStockProducts = plainToClass(Product, lowStockProductsJson);

// const topRateProduct = plainToClass(TopRateProduct, topRateProductJson);

@Injectable()
export class AnalyticsService {
  // private analytics = analytics;
  // private categoryWiseProduct = categoryWiseProduct;
  // private lowStockProducts: Product[] = lowStockProducts;
  // private topRateProduct: TopRateProduct[] = topRateProduct;

  // findAll() {
  //   return this.analytics;
  // }

  // findAllCategoryWiseProduct() {
  //   return this.categoryWiseProduct;
  // }

  // findAllLowStockProducts() {
  //   return this.lowStockProducts;
  // }

  // findAllTopRateProduct() {
  //   return this.topRateProduct;
  // }

  async adminAnalytics() {
    const chefsCount = await Chef.count({ where: { status: 0 } });
    const locationsCount = await Location.count({ where: { status: 0 } });
    const productsCount = await Product.count({ where: { status: 0 } });
    const ordersCount = await Orders.count({ where: { status: 0 } });
    return {
      chefs: chefsCount,
      locations: locationsCount,
      products: productsCount,
      orders: ordersCount,
    };
  }

  async adminOrdersAnalytics() {
    const orders = await Orders.findAll({
      attributes: [
        [literal("DATE_FORMAT(Orders.datum,'%m/%d/%Y')"), 'datum_string'],
      ],
      include: [
        {
          model: Location,
          attributes: [
            'location_name'
          ],
          required: true,
          order: ['location_name']
        },
        {
          model: Chef,
          required: true,
          attributes:[
            [literal("CONCAT(first_name,' ', last_name)"),'chef_name']
          ],
          order: ['first_name']
        }
      ],
      where: {
        status: 0,
        flag_approved: 1
      }
    })
    return orders;
  }
}
