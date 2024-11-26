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
import { SifUloga } from 'src/modules/sif-uloga.entity/sif-uloga.entity';


@Injectable()
export class PrintService {

  async getPrintChef(): Promise<Chef[]> {
    const chef = await Chef.findAll({
      attributes: [
        'first_name',
        'last_name',
        'phone_number',
        [col('korisnickiNalog.sifUloga.naziv'), 'user_role'],
      ],
      include: [
        {
          model: KorisnickiNalog,
          attributes: [],
          include: [
            {
              model: SifUloga,
              attributes: [], // Fetch the user role
            },
          ],
        },
      ],
      where: {
        status: 0,
      },
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC'],
      ]
    });
    return chef;
  }

  async getPrintInvoice(o_id: number): Promise<any> {
    const sushi = await Chef.findByPk(3, {
      attributes: [
        'company_name',
        [col('company_address'), 'address'],
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone'
      ],
    })

    const orderDetails = await Orders.findByPk(o_id, {
      attributes: [
        [col('chef.company_name'), 'company_name'],
        [fn('CONCAT', col('chef.company_address'), ', ', col('chef.company_city'), ', ', col('chef.company_state'), ' ', col('chef.company_zip_code')), 'address'],
        [col('chef.company_phone'), 'company_phone'],
        [col('location.location_name'), 'location_name'],
        [col('location.location_address'), 'location_address'],
        [fn('DATE_FORMAT', fn('NOW'), '%b %D %Y'), 'invoice_date'],
        'invoice_number',
        [fn('DATE_FORMAT', col('datum'), '%m/%d/%y'), 'order_date'],
        [fn('DATE_FORMAT', col('ship_date'), '%m/%d/%y'), 'ship_date'],
        'delivery_option',
        [col('order_price'), 'shipping'],
        'pallet_cost',
        'tax',
      ],
      include: [
        {
          model: OrderItem,
          where: {
            status: {
              [Op.ne]: 3 // oi.status != 3
            }
          },
          attributes: [
            [col('prodajna_kolicina'), 'kolicina'],
            [col('price'), 'price'],
            [literal('ROUND(prodajna_kolicina * price, 2)'), 'extended_price'],
          ],
          order: [
            ['product.sifKategorija.id', 'ASC'], // Assuming Category is included properly
            ['id', 'ASC']
          ],
          include: [
            {
              model: ProductItem,
              attributes: [
                [col('package'), 'package'],
              ],
              required: true
            },
            {
              model: Product,
              attributes: [
                [col('item_number'), 'item_number'],
                [col('item_name'), 'item_name'],
              ], // Exclude default attributes from Product
              required: true,
              include: [
                {
                  model: SifKategorija, // Assuming this is the model for `sif_kategorija`
                  attributes: [
                    [col('naziv'), 'kategorija_naziv'],
                  ], // Exclude default attributes from Category
                  required: true,
                }
              ]
            },
          ]
        },
        {
          model: Chef,
          attributes: [],
        },
        {
          model: Location,
          attributes: [],
        }
      ]
    })

    return { sushi, orderDetails };
  }

  async getPrintChefStatement(s_id: number): Promise<any> {
    const sushi = await Chef.findByPk(3, {
      attributes: [
        'company_name',
        [col('company_address'), 'address'],
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone'
      ],
    })

    const salesDetail = await Sales.findByPk(s_id, {
      attributes: [
        [fn('CONCAT', col('chef.first_name'), ' ', col('chef.last_name')), 'chef_name'],
        [col('chef.company_name'), 'company_name'],
        [col('location.location_name'), 'location_name'],
        [col('location.location_address'), 'location_address'],
        [fn('DATE_FORMAT', col('approved_date'), '%m/%d/%y'), 'approved_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.start_date'), '%m/%d/%y'), 'start_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.end_date'), '%m/%d/%y'), 'end_date'],
        [literal('COALESCE(orders_id,0)'), 'orders_id'],
      ],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 1,
            status: 0,
          },
          attributes: [
            [col('description'), 'description'],
            [fn('DATE_FORMAT', col('salesItems.start_date'), '%m/%d/%y'), 'start_date_item'],
            [fn('DATE_FORMAT', col('salesItems.end_date'), '%m/%d/%y'), 'end_date_item'],
            [col('sales'), 'sales'],
            [col('chef_commission'), 'commission'],
            [literal('ROUND(sales * (chef_commission/100), 2)'), 'amount'],
          ],
          order: [
            ['id', 'ASC']
          ]
        },
        {
          model: SalesDateInterval,
          attributes: [],
        },
        {
          model: Chef,
          attributes: [],
        },
        {
          model: Location,
          attributes: [],
        }
      ],
    })

    const otherDetail = await SalesItem.findAll({
      attributes: [
        "description",
        "date_period",
        "sales",
        [col("chef_commission"), 'commission'],
        [literal("ROUND(sales * (chef_commission/100), 2)"), 'amount']
      ],
      where: {
        sales_id: s_id,
        tip: 2,
        status: 0
      },
      order: [
        ['id', 'ASC']
      ]
    })
    const orderId = salesDetail.orders_id;
    let orderDetail: any = [];
    if (orderId != 0) {
      orderDetail = await Orders.findByPk(orderId, {
        attributes: [
          ['invoice_number', 'description'],
          [literal("DATE_FORMAT(datum,'%m/%d/%y')"), 'date_period'],
          [literal("ukupna_cena + order_price"), 'sales'],
          [literal('100'), 'commission'],
        ]
      })
    }
    return { sushi, salesDetail, otherDetail, orderDetail };
  }

  async getPrintGroupStatement(param: any): Promise<any> {
    const s_ids = param.split(",").map(Number);
    console.log(s_ids)

    const sushi = await Chef.findByPk(3, {
      attributes: [
        'company_name',
        [col('company_address'), 'address'],
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone'
      ],
    })

    const locationDetail = await Sales.findAll({
      attributes: [
        [fn('CONCAT', col('chef.first_name'), ' ', col('chef.last_name')), 'chef_name'],
        [col('chef.company_name'), 'company_name'],
        [col('location.location_name'), 'location_name'],
        [col('location.location_address'), 'location_address'],
        [fn('DATE_FORMAT', col('approved_date'), '%m/%d/%y'), 'approved_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.start_date'), '%m/%d/%y'), 'start_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.end_date'), '%m/%d/%y'), 'end_date'],
        [literal(`(SELECT COALESCE(GROUP_CONCAT(NULLIF(orders_id, '')), 0) FROM sales WHERE id IN (${s_ids.join(',')}))`), 'orders_id']
      ],
      include: [
        {
          model: SalesDateInterval,
          attributes: []
        },
        {
          model: Location,
          attributes: [],
        },
        {
          model: Chef,
          attributes: [],
        }
      ],
      where: {
        id: {
          [Op.in]: s_ids // Using Op.in for the IN clause
        }
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC']
      ]
    })
    const salesDetails = await Sales.findAll({
      attributes: [],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 1,
            status: 0,
          },
          attributes: [
            [col('description'), 'description'],
            [fn('DATE_FORMAT', col('salesItems.start_date'), '%m/%d/%y'), 'start_date_item'],
            [fn('DATE_FORMAT', col('salesItems.end_date'), '%m/%d/%y'), 'end_date_item'],
            [col('sales'), 'sales'],
            [col('chef_commission'), 'commission'],
            [literal('ROUND(sales * (chef_commission/100), 2)'), 'amount'],
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
        id: {
          [Op.in]: s_ids // Using Op.in for the IN clause
        }
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC'],
      ]
    })

    const otherDetails = await Sales.findAll({
      attributes: [],
      include: [
        {
          model: SalesItem,
          where: {
            tip: 2,
            status: 0,
          },
          attributes: [
            [col('description'), 'description'],
            [col('date_period'), 'date_period'],
            [col('sales'), 'sales'],
            [col('chef_commission'), 'commission'],
            [literal('ROUND(sales * (chef_commission/100), 2)'), 'amount'],
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
        id: {
          [Op.in]: s_ids // Using Op.in for the IN clause
        }
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC'],
      ]
    })
    param.split(",").map(Number);
    let orderIds: any = locationDetail.length ? locationDetail[0].orders_id : null;
    orderIds = orderIds.split(",").map(Number)
    const orderDetails = await Orders.findAll({
      attributes: [
        ['invoice_number', 'description'],
        [literal("DATE_FORMAT(datum,'%m/%d/%y')"), 'date_period'],
        [literal("ukupna_cena + order_price"), 'sales'],
        [literal('100'), 'commission'],
      ],
      include: [
        {
          model: Location,
          required: true,
          attributes: [],
          order: ['location_name']
        }
      ],
      where: {
        id: {
          [Op.in]: orderIds // Using Op.in for the IN clause
        }
      }
    })
    return { sushi, locationDetail, salesDetails, otherDetails, orderDetails };
  }

  async getPrintMargetInvoice(s_id: any): Promise<any> {

    const sushi = await Chef.findByPk(3, {
      attributes: [
        'company_name',
        [col('company_address'), 'address'],
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone',
        'company_email'
      ],
    })

    const market = await Chef.findByPk(14, {
      attributes: [
        'company_name',
        'company_address',
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone',
      ],
    })

    const zaglavlje = await Sales.findByPk(s_id, {
      attributes: [
        [fn('DATE_FORMAT', fn('NOW'), '%b %D %Y'), 'invoice_date'],
        [col('location.location_name'), 'location_name'],
        [fn('DATE_FORMAT', col('salesDateInterval.start_date'), '%m/%d/%y'), 'start_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.end_date'), '%m/%d/%y'), 'end_date'],
        [literal(`CONCAT('HS_',location.location_name,DATE_FORMAT(salesDateInterval.end_date,'%m%d%y'))`), 'invoice_number']
      ],
      include: [
        {
          model: SalesDateInterval,
          attributes: []
        },
        {
          model: Location,
          attributes: [],
        },
        {
          model: Chef,
          attributes: [],
        }
      ],
    })

    const salesDetail = await SalesItem.findAll({
      attributes: [
        "description",
        [fn('DATE_FORMAT', col('end_date'), '%m/%d/%y'), 'end_date_item'],
        "sales",
        "commission",
        [literal("ROUND(sales * (commission/100), 2)"), 'amount']
      ],
      where: {
        sales_id: s_id,
        tip: 1,
        status: 0
      },
      order: [
        ['id', 'ASC']
      ]
    })

    return { sushi, market, zaglavlje, salesDetail };
  }

  async getPrintMargetStatement(di_id: any): Promise<any> {

    const sushi = await Chef.findByPk(3, {
      attributes: [
        'company_name',
        [col('company_address'), 'address'],
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone',
        'company_email'
      ],
    })

    const market = await Chef.findByPk(14, {
      attributes: [
        'company_name',
        'company_address',
        [fn('CONCAT', col('company_city'), ', ', col('company_state'), ' ', col('company_zip_code')), 'place'],
        'company_phone'
      ],
    })

    const zaglavlje = await Sales.findOne({
      attributes: [
        [fn('DATE_FORMAT', fn('NOW'), '%b %D %Y'), 'statement_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.start_date'), '%m/%d/%y'), 'start_date'],
        [fn('DATE_FORMAT', col('salesDateInterval.end_date'), '%m/%d/%y'), 'end_date'],
      ],
      include: [
        {
          model: SalesDateInterval,
          required: true,
          where: { id: di_id },
          attributes: [],
        },
        {
          model: Location,
          required: true,
          attributes: [
            [literal('GROUP_CONCAT(location_number ORDER BY location_number)'), 'locations'],

          ]
        },
      ],
      where: { status: 0 },
    })

    const salesDetail = await Sales.findAll({
      attributes: [
        [col('Sales.id'), 'sales_id'],
        'items_count',
        [
          literal(`(SELECT SUM(sales) FROM sales_item WHERE sales_id=Sales.id AND tip=1 AND status=0)`),
          'sum_sales',
        ],
        [
          literal(`(SELECT SUM(ROUND(sales * (commission/100), 2)) FROM sales_item WHERE sales_id=Sales.id AND tip=1 AND status=0)`),
          'sum_amount',
        ],
      ],
      include: [
        {
          model: SalesItem,
          required: true,
          where: {
            tip: 1,
            status: 0,
          },
          attributes: [
            'description',
            [fn('DATE_FORMAT', col('end_date'), '%m/%d/%y'), 'end_date_item'],
            'sales',
            'commission',
            [literal("ROUND(sales * (commission/100), 2)"), 'amount'],
          ],
          order: [
            ['id', 'ASC']
          ]
        },
        {
          model: Location,
          required: true,
        },
      ],
      where: {
        sales_date_interval_id: 28,
        status: 0,
      },
      order: [
        [{ model: Location, as: 'location' }, 'location_name', 'ASC'],
      ],
    })

    return { sushi, market, zaglavlje, salesDetail };
  }

  async getPrintLocation(): Promise<any> {
    const locations = await Location.findAll({
      attributes: {
        include: [
          [fn('COALESCE', fn('DATE_FORMAT', col('license_permit_due'), '%m/%d/%Y'), ''), 'datum'],
        ],
      },
      where: {
        status: 0,
      },
      order: [
        ['location_name', 'ASC'], // Adjust to your actual column name
      ],
    })
    return locations;
  }

  async getPrintPackList(query: any): Promise<any> {
    console.log(query)
    const tip = query.tip;
    const orderId = query.orderId;

    const orderDetail = await Orders.findByPk(orderId, {
      attributes: [
        [literal("COALESCE(DATE_FORMAT(datum,'%m/%d/%Y'), '')"), 'datum_porudzbine'],
      ],
      include: [
        {
          model: Location,
          attributes:['location_name'],
          required: true
        }
      ]
    })
    let status = 0;
    if (tip == 1) {
      status = 1;
    } else {
      status = 3;
    }

    const itemDetail = await OrderItem.findAll({
      attributes: [
        [literal(`CASE WHEN ${tip}=1 THEN kolicina ELSE prodajna_kolicina END`), 'kolicina']
      ],
      include: [
        {
          model: Product,
          attributes: ['item_number', 'item_name', 'item_brand'],
          include: [
            {
              model: SifKategorija,
              attributes: ['naziv'],
              order:['id']
            }
          ]
        },
        {
          model: ProductItem,
          attributes: ['package'],
        }
      ],
      where: {
        orders_id: orderId,
        status: { [Op.ne]: status },
        new: { [Op.ne]: tip }
      },
      order: [
        ['id', 'ASC'], // Ordering by order item ID
      ],
    })
    return { orderDetail,itemDetail };
  }

}
