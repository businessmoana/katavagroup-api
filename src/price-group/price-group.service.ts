import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceGroupPaginator, GetPriceGroupsDto } from '../price-group/dto/get-chef.dto';
import { paginate } from 'src/common/pagination/paginate';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';
import { Op } from 'sequelize';

@Injectable()
export class PriceGroupService {

  async getPriceGroups({ search, orderBy, sortedBy, limit, page, is_active }: GetPriceGroupsDto): Promise<PriceGroupPaginator> {
    if (!page) page = 1;
    const searchOptions = search ? {
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
        ],
      },
    } : {};
    const order = [];
    if (orderBy && sortedBy) {
      order.push([orderBy, sortedBy.toUpperCase()]);
    }
    let status = (is_active == "true") ? 0 : 1;
    if (is_active == undefined)
      status = 0;
    const priceGroups = await SifPriceGroup.findAll({
      where: {
        status: status, // Filter by status
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = priceGroups.slice(startIndex, endIndex);
    const url = `/price-group?search=${search}&status=${status}&limit=${limit}`;

    return {
      data: results,
      ...paginate(priceGroups.length, page, limit, results.length, url),
    };
  }

  async getPriceGroup(id: number): Promise<SifPriceGroup> {
    const priceGroup = await SifPriceGroup.findByPk(id);
    return priceGroup;
  }

  async remove(id: number) {
    const priceGroup = await SifPriceGroup.findByPk(id);
    if (!priceGroup) {
      throw new NotFoundException(`Chef with ID ${id} not found`);
    }
    await priceGroup.destroy();
  }

  async update(priceGroupId: number, updatePriceGroup: any) {
    const priceGroup = await SifPriceGroup.findByPk(priceGroupId);
    if (!priceGroup) {
      throw new NotFoundException(`Chef with ID ${priceGroupId} not found`);
    }
    priceGroup.naziv = updatePriceGroup.naziv;
    await priceGroup.save();
    return this.getPriceGroup(priceGroupId);

  }

  async create(creatPriceGroupDto: any) {
    const priceGroup = await SifPriceGroup.findAll({
      order:[
        ['sifra' , 'DESC']
      ],
      limit:1
    });
    if(priceGroup?.length){
      creatPriceGroupDto.sifra = priceGroup[0].sifra + 1;
    }
    else{
      creatPriceGroupDto.sifra = 1;
    }
    const newPriceGroup = await SifPriceGroup.create({
      naziv: creatPriceGroupDto.naziv,
      sifra: creatPriceGroupDto.sifra,
      status:0,
    })
    return newPriceGroup;
  }

  async activePriceGroup(id: number): Promise<SifPriceGroup> {
    const priceGroup = await SifPriceGroup.findByPk(id);
    if (!priceGroup) {
      throw new NotFoundException(`PriceGroup with ID ${id} not found`);
    }
    priceGroup.status = 0; // Assuming you have an state field
    await priceGroup.save();
    return priceGroup;
  }

  async inActivePriceGroup(id: number): Promise<SifPriceGroup> {
    const priceGroup = await SifPriceGroup.findByPk(id);
    if (!priceGroup) {
      throw new NotFoundException(`PriceGroup with ID ${id} not found`);
    }
    priceGroup.status = 1; // Assuming you have an state field
    await priceGroup.save();
    return priceGroup;
  }

  async getPriceGroupList(){
    const priceGroupList = await SifPriceGroup.findAll({
      where:{
        status:0
      }
    })
    return priceGroupList;
  }
}