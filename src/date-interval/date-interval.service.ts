import { Injectable, NotFoundException } from '@nestjs/common';
import { DateIntervalPaginator, GetDateIntervalsDto } from './dto/get-date-interval.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Op } from 'sequelize';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';

@Injectable()
export class DateIntervalService {

  async getDateIntervals({ search, orderBy, sortedBy, limit, page, is_active }: GetDateIntervalsDto): Promise<DateIntervalPaginator> {
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
    } else{
      order.push(['start_date', "DESC"]);
    }
    let status = (is_active == "true") ? 0 : 1;
    if (is_active == undefined)
      status = 0;
    const dateIntervals = await SalesDateInterval.findAll({
      where: {
        status: status, // Filter by status
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = dateIntervals.slice(startIndex, endIndex);
    const url = `/date-interval?search=${search}&status=${status}&limit=${limit}`;

    return {
      data: results,
      ...paginate(dateIntervals.length, page, limit, results.length, url),
    };
  }

  async getDateInterval(id: number): Promise<SalesDateInterval> {
    const dateInterval = await SalesDateInterval.findByPk(id);
    return dateInterval;
  }

  async remove(id: number) {
    const dateInterval = await SalesDateInterval.findByPk(id);
    if (!dateInterval) {
      throw new NotFoundException(`Date Interval with ID ${id} not found`);
    }
    await dateInterval.destroy();
  }

  async update(dateIntervalId: number, updateDateInterval: any) {
    const dateInterval = await SalesDateInterval.findByPk(dateIntervalId);
    if (!dateInterval) {
      throw new NotFoundException(`Date Interval with ID ${dateIntervalId} not found`);
    }
    dateInterval.start_date = updateDateInterval.start_date;
    dateInterval.end_date = updateDateInterval.end_date;
    dateInterval.year = updateDateInterval.year;
    await dateInterval.save();
    return this.getDateInterval(dateIntervalId);
  }

  async create(createDateIntervalDto: any) {
    const newDateInterval = await SalesDateInterval.create({
      start_date : createDateIntervalDto.start_date,
      end_date : createDateIntervalDto.end_date,
      year : createDateIntervalDto.year,
      status:0,
    })
    return newDateInterval;
  }
  async activeDateInterval(id: number): Promise<SalesDateInterval> {
    const dateInterval = await SalesDateInterval.findByPk(id);
    if (!dateInterval) {
      throw new NotFoundException(`Date Interval with ID ${id} not found`);
    }
    dateInterval.status = 0; // Assuming you have an state field
    await dateInterval.save();
    return dateInterval;
  }

  async inActiveDateInterval(id: number): Promise<SalesDateInterval> {
    const dateInterval = await SalesDateInterval.findByPk(id);
    if (!dateInterval) {
      throw new NotFoundException(`Date Interval with ID ${id} not found`);
    }
    dateInterval.status = 1; // Assuming you have an state field
    await dateInterval.save();
    return dateInterval;
  }
}