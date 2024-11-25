import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChefsService } from './chefs.service';
import { GetPaginator, GetDto } from './dto/get-chef.dto';
import { LocationsService } from 'src/locations/locations.service';
import { ChefsOrdersPaginator, GetChefsOrdersDto } from './dto/get-chefs-orders.dto';
import { ChefsInvoicesPaginator, GetChefsInvoicesDto } from './dto/get-chefs-invoices.dto';

@Controller('admin/chefs')
export class ChefsController {
  constructor(private readonly chefsService: ChefsService,
    private readonly locationsService: LocationsService,
  ) { }

  @Post()
  async createChef(@Body() createChefDto) {
    return this.chefsService.createChef(createChefDto);
  }

  @Get()
  async getChefs(@Query() query: GetDto): Promise<GetPaginator> {
    return this.chefsService.getChefs(query);
  }

  @Get('/group-statement')
  async getGroupChefsStatement(@Query() query: GetDto): Promise<GetPaginator> {
    return this.chefsService.getGroupChefsStatement(query);
  }

  @Get('getLocations')
  getLocations() {
    return this.locationsService.getAllLocations();
  }

  @Get(':param')
  getChef(
    @Param('param') param: number,
  ) {
    return this.chefsService.getChef(param);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateChef,
  ) {
    return this.chefsService.updateChef(+id, updateChef); 
  }

  @Delete(':id')
  removeChef(@Param('id') id: string) {
    return this.chefsService.removeChef(+id);
  }
}

@Controller('admin/active-chef')
export class ActiveChefController {
  constructor(private chefsService: ChefsService) { }

  @Post()
  async activeChef(@Body('id') id) {
    return this.chefsService.activeChef(id);
  }
}

@Controller('admin/inactive-chef')
export class InActiveChefController {
  constructor(private chefsService: ChefsService) { }

  @Post()
  async inActiveChef(@Body('id') id) {
    return this.chefsService.inActiveChef(id);
  }
}

@Controller('admin/chefs-orders')
export class ChefsOrdersController {
  constructor(private chefsService: ChefsService) { }
  @Get()
  async getChefsOrders(@Query() query: any): Promise<any> {
    return this.chefsService.getChefsOrders(query);
  }

  @Get(':param')
  getOrder(
    @Param('param') param: number,
  ) {
    return this.chefsService.getOrder(param);
  }
}

@Controller('admin/order-items')
export class OrderItemsController {
  constructor(private chefsService: ChefsService) { }

  @Get(':param')
  getOrderItems(
    @Param('param') param: number,
  ) {
    return this.chefsService.getOrderItems(param);
  }
}

@Controller('admin/chefs-invoices')
export class ChefsInvoicesController {
  constructor(private chefsService: ChefsService) { }
  @Get()
  async getChefsInvoices(@Query() query: GetChefsInvoicesDto): Promise<ChefsInvoicesPaginator> {
    return this.chefsService.getChefsInvoices(query);
  }

  @Get(':param')
  getOrder(
    @Param('param') param: number,
  ) {
    return this.chefsService.getOrder(param);
  }
}

@Controller('admin/sales')
export class SalesController {
  constructor(private chefsService: ChefsService) { }
  @Get()
  async getIntervals() {
    return this.chefsService.getIntervals();
  }

  @Get(':param')
  getSales(
    @Param('param') param: number,
  ) {
    return this.chefsService.getSales(param);
  }

  @Get('sale-items/:id')
  getSaleItems(
    @Param('id') id: number,
  ) {
    return this.chefsService.getSaleItems(id);
  }
  
  @Post()
  async createSale(@Body() data) {
    return this.chefsService.createOrUpdateSale(data);
  }

  @Post('other')
  async createSaleOther(@Body() data) {
    return this.chefsService.createOrUpdateSalesOther(data);
  }
  
  @Put('deactive-sale-items/:id')
  async deactiveSalesItem( @Param('id') id: number,) {
    return this.chefsService.deactiveSalesItem(id);
  }

  @Put('deactive-sale-other-items/:id')
  async deactiveSalesOtherItem( @Param('id') id: number,) {
    return this.chefsService.deactiveSalesOtherItem(id);
  }

  @Delete(':id')
  deactiveSales(@Param('id') id: string) {
    return this.chefsService.deactiveSales(+id);
  }

  @Put('approve-sales/:id')
  async approveSales(@Param('id') id: number,) {
    return this.chefsService.approveSales(id);
  }

  @Get('sales-other-items/:id')
  getSalesOtherItem(
    @Param('id') id: number,
  ) {
    return this.chefsService.getSalesOtherItem(id);
  }

}

@Controller('admin/market-statement')
export class MarketStatementController {
  constructor(private chefsService: ChefsService) { }
  @Get()
  async getMarketStatements(@Query() query: any): Promise<any> {
    return this.chefsService.getMarketStatements(query);
  }
}