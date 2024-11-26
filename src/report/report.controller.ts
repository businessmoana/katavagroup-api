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
import { ReportService } from './report.service';;

@Controller('admin/report')
export class ReportController {
  constructor(private reportService: ReportService) { }
  @Get('/invoice-sales')
  async getInvoiceSales(@Query('startDate') startDate:any, @Query('endDate') endDate:any){
    return await this.reportService.getInvoiceSales(startDate, endDate);
  }
}