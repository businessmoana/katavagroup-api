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
import { DateIntervalService } from './date-interval.service';
import { DateIntervalPaginator, GetDateIntervalsDto } from './dto/get-date-interval.dto';
import { LocationsService } from 'src/locations/locations.service';

@Controller('admin/date-interval')
export class DateIntervalController {
  constructor(private readonly dateIntervalService: DateIntervalService) { }

  
  @Post()
  async createDateInterval(@Body() creatDateIntervalDto) {
    return this.dateIntervalService.create(creatDateIntervalDto);
  }
  
  @Get()
  async getDateIntervals(@Query() query: GetDateIntervalsDto): Promise<DateIntervalPaginator> {
    return this.dateIntervalService.getDateIntervals(query);
  }

  @Get(':param')
  getDateInterval(
    @Param('param') param: number,
  ) {
    return this.dateIntervalService.getDateInterval(param);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDateInterval,
  ) {
    return this.dateIntervalService.update(+id, updateDateInterval);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dateIntervalService.remove(+id);
  }

}


@Controller('admin/active-date-interval')
export class ActiveDateIntervalController {
  constructor(private priceGroupService: DateIntervalService) { }

  @Post()
  async activeDateInterval(@Body('id') id) {
    return this.priceGroupService.activeDateInterval(id);
  }
}

@Controller('admin/inactive-date-interval')
export class InActiveDateIntervalController {
  constructor(private priceGroupService: DateIntervalService) { }

  @Post()
  async inActiveDateInterval(@Body('id') id) {
    return this.priceGroupService.inActiveDateInterval(id);
  }
}