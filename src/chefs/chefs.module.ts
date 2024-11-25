import { Module } from '@nestjs/common';
import { ChefsService } from './chefs.service';
import {
  ActiveChefController,
  ChefsController,
  ChefsInvoicesController,
  ChefsOrdersController,
  InActiveChefController,
  OrderItemsController,
  SalesController,
  MarketStatementController
} from './chefs.controller';
import { LocationsService } from 'src/locations/locations.service';

@Module({
  controllers: [
    ChefsController,
    ActiveChefController,
    InActiveChefController,
    ChefsOrdersController,
    OrderItemsController,
    ChefsInvoicesController,
    SalesController,
    MarketStatementController
  ],
  providers: [ChefsService, LocationsService],
})
export class ChefsModule { }
