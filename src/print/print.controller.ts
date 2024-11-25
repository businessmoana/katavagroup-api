import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrintService } from './print.service';;

@Controller('print-chef')
export class PrintChefController {
  constructor(private printService: PrintService) { }
  @Get()
  getPrintChef() {
    return this.printService.getPrintChef();
  }
}


@Controller('print-invoice')
export class PrintInvoiceController {
  constructor(private printService: PrintService) { }
  @Get(':param')
  getPrintInvoice(
    @Param('param') param: number,
  ) {
    return this.printService.getPrintInvoice(param);
  }
}


@Controller('print-chef-statement')
export class PrintChefStatementController {
  constructor(private printService: PrintService) { }
  @Get(':param')
  getPrintChefStatement(
    @Param('param') param: number,
  ) {
    return this.printService.getPrintChefStatement(param);
  }
}

@Controller('print-group-statement')
export class PrintGroupStatementController {
  constructor(private printService: PrintService) { }
  @Get(':param')
  async getPrintGroupStatement( @Param('param') param: number): Promise<any> {
    return this.printService.getPrintGroupStatement(param);
  }
}

@Controller('print-market-invoice')
export class PrintMarketInvoiceController {
  constructor(private printService: PrintService) { }
  @Get(':param')
  getPrintMargetInvoice(
    @Param('param') param: number,
  ) {
    return this.printService.getPrintMargetInvoice(param);
  }
}


@Controller('print-market-statement')
export class PrintMarketStatementController {
  constructor(private printService: PrintService) { }
  @Get(':param')
  getPrintMargetStatement(
    @Param('param') param: number,
  ) {
    return this.printService.getPrintMargetStatement(param);
  }
}

@Controller('print-location')
export class PrintLocationController {
  constructor(private printService: PrintService) { }
  @Get()
  getPrintLocation() {
    return this.printService.getPrintLocation();
  }
}

@Controller('print-pack-list')
export class PrintPackListController {
  constructor(private printService: PrintService) { }
  @Get()
  async getPrintPackList(@Query() query: any): Promise<any> {
    return this.printService.getPrintPackList(query);
  }
}