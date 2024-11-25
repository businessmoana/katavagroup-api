import { Module } from '@nestjs/common';
import { ChefsOrdersService } from './chefs-orders.service';
import {
  ChefsOrdersController
} from './chefs-orders.controller';

@Module({
  controllers: [
    ChefsOrdersController
  ],
  providers: [ChefsOrdersService],
})
export class ChefsOrdersModule { }
