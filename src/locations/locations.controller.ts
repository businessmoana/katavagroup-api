import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationPaginator, GetLocationsDto } from './dto/get-location.dto';

@Controller('admin/location')
export class LocationsController {
  constructor(private readonly locationService: LocationsService) { }

  @Get()
  async getLocations(@Query() query: GetLocationsDto): Promise<LocationPaginator> {
    return this.locationService.getLocations(query);
  }

  @Post('/change-status')
  async activeChef(@Body('id') id) {
    return this.locationService.changeLocationStatus(id);
  }

  @Get(':param')
  async getLocation(@Param('param') id:any){
    return this.locationService.getLocation(id);
  }

  @Post('/create-or-update')
  async createOrUpdate(@Body() data) {
    return this.locationService.createOrUpdate(data);
  }

  @Get('/:id/order-date')
  async getOrderDateList(@Param('id') id:any) {
    return this.locationService.getOrderDateList(id);
  }

  @Get('/order-date/:id')
  async getOrderDate(@Param('id') id:any) {
    return this.locationService.getOrderDate(id);
  }

  @Post('/order-date')
  async updateOrCreateOrderDate(@Body() data){
    return this.locationService.updateOrCreateOrderDate(data);
  }

  @Delete('/order-date/:id')
  async removeOrderDate(@Param('id') id:any){
    return this.locationService.removeOrderDate(id);
  }
}
