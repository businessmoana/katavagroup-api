import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PortalService } from './portal.service';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard';
import { LocationsService } from 'src/locations/locations.service';

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService, 
    private readonly locationsService: LocationsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrders(@Request() req, @Query() query: any): Promise<any> {
    const user = req.user;
    return this.portalService.getOrders(user, query);
  }

  @Get('orders/:param')
  getOrder(
    @Param('param') param: number,
  ) {
    return this.portalService.getOrder(param);
  }

  @Get('getLocations')
  getLocations() {
    return this.locationsService.getAllLocations();
  }

  @UseGuards(JwtAuthGuard)
  @Get('invoices')
  async getInvoices(@Request() req, @Query() query: any): Promise<any> {
    const user = req.user;
    return this.portalService.getInvoices(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statements')
  async getStatements(@Request() req, @Query() query: any): Promise<any> {
    const user = req.user;
    return this.portalService.getStatements(user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async getProducts(@Request() req, @Query() query: any): Promise<any> {
    const user = req.user;
    return this.portalService.getProducts(user, query);
  }
  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(@Request() req, @Body() data) {
    const user = req.user;
    return this.portalService.createOrder(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  async getCategories(@Request() req): Promise<any> {
    const user = req.user;
    return this.portalService.getCategories();
  }
}
