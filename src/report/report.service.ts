import { Injectable } from '@nestjs/common';
import { literal, Model, Op } from 'sequelize';
import { col, fn } from 'sequelize';
import { Chef } from 'src/modules/chef/chef.entity';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import { Location } from 'src/modules/location/location.entity';
import { OrderItem } from 'src/modules/order-item/order-item.entity';
import { Orders } from 'src/modules/orders/orders.entity';
import { ProductItem } from 'src/modules/product-item/product-item.entity';
import { Product } from 'src/modules/product/product.entity';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';
import { SalesItem } from 'src/modules/sales-item/sales-item.entity';
import { Sales } from 'src/modules/sales/sales.entity';


@Injectable()
export class ReportService {
  async getInvoiceSales(startDate: any, endDate: any) {
    const salesDetails = await Sales.findAll({
      attributes: [
        [col('Location.location_name'), 'location_name'],
      ],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 1,
            status: 0,
          },
          attributes: [
            [col('sales'), 'sales'],
          ],
          order: [
            ['id', 'ASC']
          ]
        },
        {
          model: Location,
          attributes: [],
        }
      ],
      where: {
        approved_date: {
          [Op.and]: [
            { [Op.gte]: new Date(startDate) },
            { [Op.lte]: new Date(endDate) },
          ],
        },
        status: 0
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC']
      ]
    })

    const invoiceDetails = await Orders.findAll({
      attributes: [
        'id',
        ['location_id', 'location_id'],
        [col('Location.location_name'), 'location_name'],
        [literal("ukupna_cena + order_price"), 'sales'],
      ],
      include: [
        {
          model: Location,
          attributes: [],
        }
      ],
      where: {
        ship_date: {
          [Op.and]: [
            { [Op.gte]: new Date(startDate) },
            { [Op.lte]: new Date(endDate) },
          ],
        },
        status: 0
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC']
      ]
    })
    return { salesDetails, invoiceDetails };
  }
}
