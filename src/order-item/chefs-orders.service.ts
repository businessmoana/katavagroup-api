import { Injectable, NotFoundException } from '@nestjs/common';
import { ChefsOrdersPaginator, GetChefsOrdersDto } from './dto/get-chefs-orders.dto';
import { paginate } from 'src/common/pagination/paginate';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';
import { col, fn, Op } from 'sequelize';
import { Orders } from 'src/modules/orders/orders.entity';
import { Location } from 'src/modules/location/location.entity';
import { Chef } from 'src/modules/chef/chef.entity';

@Injectable()
export class ChefsOrdersService {

  async getChefsOrders({ search, orderBy, sortedBy, limit, page }: GetChefsOrdersDto): Promise<ChefsOrdersPaginator> {
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
      if (orderBy === 'location_name') {
        order.push([{ model: Location, as: 'location' }, 'location_name', sortedBy.toUpperCase()]); // Sort by role's ID
      } else if (orderBy === 'first_name') {
        order.push([{ model: Chef, as: 'chef' }, 'first_name', sortedBy.toUpperCase()]); // Sort by role's ID
      } else {
        order.push([orderBy, sortedBy.toUpperCase()]);
      }
    }
    else {
      order.push([['datum', 'DESC'],
      [col('Location.location_name'), 'ASC'],
      [col('Chef.first_name'), 'ASC']])
    }
    const chefsOrders = await Orders.findAll({
      include: [
        {
          model: Location,// Exclude default attributes from Location
          attributes: [
            'location_name'
          ]
        },
        {
          model: Chef,// Exclude default attributes from Chef
          attributes: [
            'first_name',
            'last_name'
          ]
        }
      ],
      where: {
        status: 0, // Filter by status
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = chefsOrders.slice(startIndex, endIndex);
    const url = `/chefs-orders?search=${search}&status=0&limit=${limit}`;

    return {
      data: results,
      ...paginate(chefsOrders.length, page, limit, results.length, url),
    };
  }

  async getOrder(id: number): Promise<Orders> {
    const chefOrder = await Orders.findByPk(id,{
      include: [
        {
          model: Location,// Exclude default attributes from Location
          attributes: [
            'location_name'
          ]
        },
        {
          model: Chef,// Exclude default attributes from Chef
          attributes: [
            'first_name',
            'last_name'
          ]
        }
      ],
    });
    return chefOrder;
  }
}