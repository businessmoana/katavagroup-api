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
import { ChefsOrdersService } from './chefs-orders.service';
import { ChefsOrdersPaginator, GetChefsOrdersDto } from './dto/get-chefs-orders.dto';

@Controller('chefs-orders')
export class ChefsOrdersController {
  constructor(private readonly chefsOrdersService: ChefsOrdersService) { }
  
  @Get()
  async getChefsOrders(@Query() query: GetChefsOrdersDto): Promise<ChefsOrdersPaginator> {
    return this.chefsOrdersService.getChefsOrders(query);
  }

  @Get(':param')
  getOrder(
    @Param('param') param: number,
  ) {
    return this.chefsOrdersService.getOrder(param);
  }
}