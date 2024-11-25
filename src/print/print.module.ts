import { Module } from '@nestjs/common';
import { PrintService } from './print.service';
import {
  PrintChefController,
  PrintInvoiceController,
  PrintChefStatementController,
  PrintGroupStatementController,
  PrintMarketInvoiceController,
  PrintMarketStatementController,
  PrintLocationController,
  PrintPackListController,
} from './print.controller';

@Module({
  controllers: [
    PrintChefController,
    PrintInvoiceController,
    PrintChefStatementController,
    PrintGroupStatementController,
    PrintMarketInvoiceController,
    PrintMarketStatementController,
    PrintLocationController,
    PrintPackListController,
  ],
  providers: [PrintService],
})
export class PrintModule { }
