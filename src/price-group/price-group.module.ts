import { Module } from '@nestjs/common';
import { PriceGroupService } from './price-group.service';
import {
  PriceGroupController,
  ActivePriceGroupController,
  InActivePriceGroupController
} from './price-group.controller';

@Module({
  controllers: [
    PriceGroupController,
    ActivePriceGroupController,
    InActivePriceGroupController
  ],
  providers: [PriceGroupService],
})
export class PriceGroupModule { }
