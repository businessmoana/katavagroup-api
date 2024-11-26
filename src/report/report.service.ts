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
import { SifKategorija } from 'src/modules/sif-ktegorija/sifK-ktegorija.entity';


@Injectable()
export class ReportService {
  async getInvoiceSales(startDate: any, endDate: any) {
    const salesDetails = await Sales.findAll({
      attributes: [
        [col('location.location_name'), 'location_name'],
      ],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 1,
            status: 0,
            // start_date:{
            //   [Op.gte]: new Date(startDate)
            // },
            // end_date:{
            //   [Op.lte]: new Date(endDate)
            // },
          },
          attributes: [
            [col('sales'), 'sales'],
            'quantity',
          ],
          order: [
            ['id', 'ASC']
          ],
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
        [col('location.location_name'), 'location_name'],
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

  async getCombinedInvoices(startDate: any, endDate: any) {
    const invoiceDetails = await Orders.findAll({
      attributes: [
        'id',
        ['location_id', 'location_id'],
        [col('location.location_name'), 'location_name'],
        [literal("ukupna_cena + order_price"), 'sales'],
      ],
      include: [
        {
          model: Location,
          attributes: [],
        },
        {
          model: OrderItem,
          attributes: [
            'id',
            [
              literal(`CASE 
                WHEN orderItems.status IN (0, 1, 2) THEN prodajna_kolicina 
                WHEN orderItems.status = 3 THEN 0 
              END`),
              'quantity'
            ],
            'price'
          ],
          include: [
            {
              model: Product,
              attributes: [
                [col('item_number'), 'item_number'],
                [col('item_name'), 'item_name'],
                [col('item_brand'), 'item_brand'],
              ], // Exclude default attributes from Product
              required: true,
              include:[
                {
                  model:ProductItem,
                  required:true,
                }
              ]
            },
          ],
          where: {
            [Op.and]: [
              literal(`CASE WHEN orderItems.status = 3 THEN new = 0 ELSE 1 = 1 END`),
            ],
          },
          order: [
            [col('product.item_name'), 'ASC'],
          ],
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

    return invoiceDetails;
  }

  async getSalesDetail(startDate: any, endDate: any) {
    const salesDetails = await Sales.findAll({
      attributes: [
        [col('location.location_name'), 'location_name'],
      ],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 1,
            status: 0,
            start_date:{
              [Op.gte]: new Date(startDate)
            },
            end_date:{
              [Op.lte]: new Date(endDate)
            },
          },
          attributes: [
            [col('sales'), 'sales'],
            'quantity',
          ],
          order: [
            ['id', 'ASC']
          ],
        },
        {
          model: Location,
          attributes: [],
        }
      ],
      where: {
        status: 0
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC']
      ]
    })

    return salesDetails;
  }
}
