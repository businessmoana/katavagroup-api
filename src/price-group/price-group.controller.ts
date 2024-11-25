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
import { PriceGroupService } from './price-group.service';
import { PriceGroupPaginator, GetPriceGroupsDto } from '../price-group/dto/get-chef.dto';
import { LocationsService } from 'src/locations/locations.service';

@Controller('admin/price-group')
export class PriceGroupController {
  constructor(private readonly priceGroupService: PriceGroupService) { }

  
  @Post()
  async createPriceGroup(@Body() creatPriceGroupDto) {
    return this.priceGroupService.create(creatPriceGroupDto);
  }
  
  @Get()
  async getPriceGroups(@Query() query: GetPriceGroupsDto): Promise<PriceGroupPaginator> {
    return this.priceGroupService.getPriceGroups(query);
  }

  @Get('/all')
  async getPriceGroupList(){
    return this.priceGroupService.getPriceGroupList();
  }

  @Get(':param')
  getPriceGroup(
    @Param('param') param: number,
  ) {
    return this.priceGroupService.getPriceGroup(param);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriceGroup,
  ) {
    return this.priceGroupService.update(+id, updatePriceGroup);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.priceGroupService.remove(+id);
  }

}


@Controller('admin/active-price-group')
export class ActivePriceGroupController {
  constructor(private priceGroupService: PriceGroupService) { }

  @Post()
  async activePriceGroup(@Body('id') id) {
    return this.priceGroupService.activePriceGroup(id);
  }
}

@Controller('admin/inactive-price-group')
export class InActivePriceGroupController {
  constructor(private priceGroupService: PriceGroupService) { }

  @Post()
  async inActivePriceGroup(@Body('id') id) {
    return this.priceGroupService.inActivePriceGroup(id);
  }
}