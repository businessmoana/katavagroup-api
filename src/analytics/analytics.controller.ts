import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('/admin/common')
  async adminAnalytics() {
    return await this.analyticsService.adminAnalytics();
  }
  @Get('/admin/orders')
  async adminOrdersAnalytics() {
    return await this.analyticsService.adminOrdersAnalytics();
  }

  // @Get('/manager')
  // managerAnalytics() {
  //   return this.analyticsService.findAll();
  // }
}

// @Controller('category-wise-product')
// export class CategoryWiseProductController {
//   constructor(private readonly analyticsService: AnalyticsService) { }

//   @Get()
//   analytics() {
//     return this.analyticsService.findAllCategoryWiseProduct();
//   }
// }

// @Controller('low-stock-products')
// export class LowStockProductsController {
//   constructor(private readonly analyticsService: AnalyticsService) { }

//   @Get()
//   analytics() {
//     return this.analyticsService.findAllLowStockProducts();
//   }
// }

// @Controller('top-rate-product')
// export class TopRateProductController {
//   constructor(private readonly analyticsService: AnalyticsService) { }

//   @Get()
//   analytics() {
//     return this.analyticsService.findAllTopRateProduct();
//   }
// }
