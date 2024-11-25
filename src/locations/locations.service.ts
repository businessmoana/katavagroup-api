import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationPaginator, GetLocationsDto } from './dto/get-location.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Location } from 'src/modules/location/location.entity';
import { literal, Op } from 'sequelize';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import { SifUloga } from 'src/modules/sif-uloga.entity/sif-uloga.entity';
import { LocationDate } from 'src/modules/location-date/location-date.entity';

@Injectable()
export class LocationsService {

  async getLocations({ search, orderBy, sortedBy, limit, page, is_active }: GetLocationsDto): Promise<LocationPaginator> {
    if (!page) page = 1;
    const searchOptions = search ? {
      where: {
        [Op.or]: [
          { location_name: { [Op.like]: `%${search}%` } },
          { location_address: { [Op.like]: `%${search}%` } },
          { location_number: { [Op.like]: `%${search}%` } },
          { license_permit_due: { [Op.like]: `%${search}%` } },
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

    const locations = await Location.findAll({
      where: {
        status: status, // Filter by status
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = locations.slice(startIndex, endIndex);
    const url = `/location?search=${search}&status=${status}&limit=${limit}`;

    return {
      data: results,
      ...paginate(locations.length, page, limit, results.length, url),
    };
  }

  async changeLocationStatus(id: number): Promise<any> {
    const location = await Location.findByPk(id);
    if (!location) {
      throw new NotFoundException(`Chef with ID ${id} not found`);
    }
    location.status = location.status == 0 ? 1 : 0; // Assuming you have an state field
    await location.save();
    return location;
  }

  async getAllLocations() {
    const locations = await Location.findAll({
      where: {
        status: 0,
      }
    });
    return locations;
  }

  async getLocation(id: any) {
    const location = await Location.findByPk(id);
    return location;
  }

  async createOrUpdate(data: any) {
    if (data.id == 0) {
      await Location.create({
        location_number: data.location_number,
        location_name: data.location_name,
        license_permit_due: data.license_permit_due,
        location_address: data.location_address,
        sif_price_group_id: data.sif_price_group_id,
        note: data.note,
        status: 0,
      })
    } else {
      await Location.update(
        {
          location_number: data.location_number,
          location_name: data.location_name,
          license_permit_due: data.license_permit_due,
          location_address: data.location_address,
          note: data.note,
        },
        {
          where: {
            id: data.id
          }
        }
      )
    }
    return true;
  }

  async getOrderDateList(locationId: any) {
    const result = LocationDate.findAll({
      attributes: [
        'id',
        [literal("COALESCE(DATE_FORMAT(order_date,'%m/%d/%Y'), '')"), 'order_date'],
        [literal("YEAR(order_date)"), 'year'],
      ],
      where: {
        location_id: locationId,
      },
      order: [['order_date', 'ASC']],
      include: [
        {
          model: Location,
          required: true,
          where: { id: locationId }
        }
      ]
    })
    return result;
  }

  async getOrderDate(orderDateId: any) {
    const data = await LocationDate.findByPk(orderDateId);
    return data;
  }

  async updateOrCreateOrderDate(data: any) {
    if (data.id == 0) {
      await LocationDate.create({
        order_date: data.order_date,
        location_id: data.locationId
      })
    } else {
      await LocationDate.update(
        {
          order_date: data.order_date
        },
        {
          where: {
            id: data.id
          }
        }
      )
    }
    return true;
  }

  async removeOrderDate(orderDateId: any) {
    const data = await LocationDate.findAll({
      where: {
        id: orderDateId,
        orders_id: {
          [Op.ne]: null
        }
      }
    })
    if (data.length) {
      return false;
    } else {
      const locationDate = await LocationDate.findByPk(orderDateId);
      if (!locationDate) {
        throw new NotFoundException(`LocationDate with ID ${orderDateId} not found`);
      }
      await locationDate.destroy();
    }
    return true;
  }
}