import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPaginator, GetDto } from './dto/get-chef.dto';
import { paginate } from 'src/common/pagination/paginate';
import { Chef } from 'src/modules/chef/chef.entity';
import { col, literal, Op, where } from 'sequelize';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import { SifUloga } from 'src/modules/sif-uloga.entity/sif-uloga.entity';
import { Location } from 'src/modules/location/location.entity';
import { ChefLocation } from 'src/modules/chef-location/chef-location.entity';
import { Orders } from 'src/modules/orders/orders.entity';
import { ChefsOrdersPaginator, GetChefsOrdersDto } from './dto/get-chefs-orders.dto';
import { OrderItem } from 'src/modules/order-item/order-item.entity';
import { Product } from 'src/modules/product/product.entity';
import { ProductItem } from 'src/modules/product-item/product-item.entity';
import { SifKategorija } from 'src/modules/sif-ktegorija/sifK-ktegorija.entity';
import { ChefsInvoicesPaginator, GetChefsInvoicesDto } from './dto/get-chefs-invoices.dto';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';
import { Sales } from 'src/modules/sales/sales.entity';
import { SalesItem } from 'src/modules/sales-item/sales-item.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChefsService {
  async getChefs({ search, orderBy, sortedBy, limit, page, is_active }: GetDto): Promise<GetPaginator> {
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
      if (orderBy === 'role') {
        order.push([{ model: KorisnickiNalog, as: 'korisnickiNalog' }, 'sif_uloga_id', sortedBy.toUpperCase()]); // Sort by role's ID
      } else {
        order.push([orderBy, sortedBy.toUpperCase()]);
      }
    }
    // Fetch chefs with joins
    let status = (is_active == "true") ? 0 : 1;
    if (is_active == undefined)
      status = 0;
    const chefs = await Chef.findAll({
      include: [
        {
          model: KorisnickiNalog,
          include: [
            {
              model: SifUloga,
              attributes: ['naziv'], // Fetch the user role
            },
          ],
        },
      ],
      where: {
        status: status, // Filter by status
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = chefs.slice(startIndex, endIndex);
    const url = `/chefs?search=${search}&status=${status}&limit=${limit}`;

    return {
      data: results,
      ...paginate(chefs.length, page, limit, results.length, url),
    };
  }

  async getGroupChefsStatement({ search, orderBy, sortedBy, limit, page }: GetDto): Promise<GetPaginator> {
    if (!page) page = 1;
    const order = [];
    if (orderBy && sortedBy) {
      if (orderBy === 'role') {
        order.push([{ model: KorisnickiNalog, as: 'korisnickiNalog' }, 'sif_uloga_id', sortedBy.toUpperCase()]); // Sort by role's ID
      } else {
        order.push([orderBy, sortedBy.toUpperCase()]);
      }
    }
    order.push([literal('SalesDateInterval.start_date'), 'DESC'],
      [literal('Location.location_name'), 'ASC'],
      [literal('Chef.first_name'), 'ASC'],)
    const statement = await Sales.findAll({
      attributes: [
        [literal('GROUP_CONCAT(Sales.id)'), 'sales_id'],
        [literal('GROUP_CONCAT(location.location_name ORDER BY location_name)'), 'location_name'],
        [literal("CONCAT(Chef.first_name, ' ', Chef.last_name)"), 'chef_name'],
        [literal("DATE_FORMAT(SalesDateInterval.start_date, '%m/%d/%Y')"), 'start_date'],
        [literal("DATE_FORMAT(SalesDateInterval.end_date, '%m/%d/%Y')"), 'end_date'],
      ],
      include: [
        {
          model: SalesDateInterval,
          attributes: [],
        },
        {
          model: Location,
          attributes: [],
        },
        {
          model: Chef,
          attributes: [],
          where: {
            [Op.or]: [
              { 'first_name': { [Op.like]: `%${search}%` } },
              { 'last_name': { [Op.like]: `%${search}%` } },
            ],
          }
        },
      ],
      where: {
        status: 0,
      },
      group: ['sales_date_interval_id', 'Chef.id'],
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = statement.slice(startIndex, endIndex);
    const url = `/chefs/group-statement?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(statement.length, page, limit, results.length, url),
    };
  }

  async getChef(id: number): Promise<Chef> {
    const chef = await Chef.findByPk(id, {
      include: [
        {
          model: KorisnickiNalog,
          include: [
            {
              model: SifUloga,
              attributes: ['naziv'], // Fetch the user role
            },
          ],
        },
        {
          model: ChefLocation,
          include: [
            {
              model: Location,
            },
          ],
        }
      ],
    });
    return chef;
  }

  async removeChef(id: number) {
    const chef = await Chef.findByPk(id);
    if (!chef) {
      throw new NotFoundException(`Chef with ID ${id} not found`);
    }
    await chef.destroy();
  }

  async updateChef(chefId: number, updateChef: any) {
    const chef = await Chef.findByPk(chefId);
    if (!chef) {
      throw new NotFoundException(`Chef with ID ${chefId} not found`);
    }
    chef.first_name = updateChef.first_name;
    chef.middle_name = updateChef.middle_name;
    chef.last_name = updateChef.last_name;
    chef.email = updateChef.email;
    chef.dob = updateChef.dob ? new Date(updateChef.dob) : null;;
    chef.phone_number = updateChef.phone_number;
    chef.ssn = updateChef.ssn;
    chef.address = updateChef.address;
    chef.city = updateChef.city;
    chef.state = updateChef.state;
    chef.zip_code = updateChef.zip_code;
    chef.company_name = updateChef.company_name;
    chef.company_email = updateChef.company_email;
    chef.company_phone = updateChef.company_phone;
    chef.company_ein = updateChef.company_ein;
    chef.company_address = updateChef.company_address;
    chef.company_city = updateChef.company_city;
    chef.company_state = updateChef.company_state;
    chef.company_zip_code = updateChef.company_zip_code;
    chef.emergency_contact = updateChef.emergency_contact;
    chef.license_due = updateChef.license_due ? new Date(updateChef.license_due) : null;
    chef.note = updateChef.note;
    await chef.save();

    const korisnickiNalog = await KorisnickiNalog.findByPk(chef.korisnicki_nalog_id);
    if (korisnickiNalog) {
      korisnickiNalog.korisnicko_ime = updateChef.korisnicko_ime;
      korisnickiNalog.sif_uloga_id = updateChef.role.value;
      if (updateChef.password) {
        console.log(updateChef.password)
        const hashedPassword = await bcrypt.hash(updateChef.password, 10)
        console.log("updateChef.password=>", updateChef.password)
        console.log("hashedPassword=>", hashedPassword)
        korisnickiNalog.lozinka = hashedPassword; // Ensure to hash the password in a real scenario
      }

      await korisnickiNalog.save();
    }
    if (updateChef.chefLocations) {
      const existingLocations = await ChefLocation.findAll({ where: { chef_id: chefId } });
      const existingLocationIds = existingLocations.map(location => location.location_id);
      const newLocations = updateChef.chefLocations.filter((chefLocation: any) => !existingLocationIds.includes(chefLocation.id));
      for (const newLocation of newLocations) {
        await ChefLocation.create({ chef_id: chefId, location_id: newLocation.id });
      }
      const locationsToDelete = existingLocationIds.filter(location_id => !(updateChef.chefLocations.map((chefLocation: any) => chefLocation.id)).includes(location_id));
      for (const location_id of locationsToDelete) {
        await ChefLocation.destroy({ where: { chef_id: chefId, location_id: location_id } });
      }
    }

    return this.getChef(chefId);
  }

  async createChef(createChefDto: any) {
    const hashedPassword = await bcrypt.hash(createChefDto.password, 10)

    const korisnickiNalog = await KorisnickiNalog.create({
      korisnicko_ime: createChefDto.korisnicko_ime,
      lozinka: hashedPassword, // Remember to hash the password
      sif_uloga_id: createChefDto?.role?.value, // Assuming this is the role ID
    });
    const chef = await Chef.create({
      first_name: createChefDto.first_name,
      middle_name: createChefDto.middle_name,
      last_name: createChefDto.last_name,
      email: createChefDto.email,
      dob: createChefDto.dob ? new Date(createChefDto.dob) : null, // Convert if necessary
      phone_number: createChefDto.phone_number,
      ssn: createChefDto.ssn,
      address: createChefDto.address,
      city: createChefDto.city,
      state: createChefDto.state,
      zip_code: createChefDto.zip_code,
      company_name: createChefDto.company_name,
      company_email: createChefDto.company_email,
      company_phone: createChefDto.company_phone,
      company_ein: createChefDto.company_ein,
      company_address: createChefDto.company_address,
      company_city: createChefDto.company_city,
      company_state: createChefDto.company_state,
      company_zip_code: createChefDto.company_zip_code,
      emergency_contact: createChefDto.emergency_contact,
      license_due: createChefDto.license_due ? new Date(createChefDto.license_due) : null, // Convert if necessary
      note: createChefDto.note,
      korisnicki_nalog_id: korisnickiNalog.id, // Associate with the KorisnickiNalog created
      status: 1,
    });

    if (createChefDto?.chefLocations?.length) {
      for (const chefLocation of createChefDto.chefLocations) {
        await ChefLocation.create({ chef_id: chef.id, location_id: chefLocation.id });
      }
    }
    return this.getChef(chef.id);
  }

  async activeChef(id: number): Promise<Chef> {
    const chef = await Chef.findByPk(id);
    if (!chef) {
      throw new NotFoundException(`Chef with ID ${id} not found`);
    }
    chef.status = 0; // Assuming you have an state field
    await chef.save();
    return chef;
  }

  async inActiveChef(id: number): Promise<Chef> {
    const chef = await Chef.findByPk(id);
    if (!chef) {
      throw new NotFoundException(`Chef with ID ${id} not found`);
    }
    chef.status = 1; // Assuming you have an state field
    await chef.save();
    return chef;
  }

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
      order.push([
        ['datum', 'DESC']
      ])
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
    const chefOrder = await Orders.findByPk(id, {
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

  async getOrderItems(id: number): Promise<OrderItem[]> {
    const orderItems = await OrderItem.findAll({
      attributes: [
        'id',
        'price',
        [col('Product.item_number'), 'item_number'],
        [col('Product.item_name'), 'item_name'],
        [col('Product.item_brand'), 'item_brand'],
        [col('ProductItem.package'), 'package'],
        [col('Product.SifKategorija.id'), 'kategorija_id'],
        [col('Product.SifKategorija.naziv'), 'kategorija_naziv'],
        [
          literal(`CASE 
            WHEN OrderItem.status = 0 THEN kolicina 
            WHEN OrderItem.status = 1 THEN 0 
            WHEN OrderItem.status = 2 AND new = 0 THEN kolicina 
            WHEN OrderItem.status = 2 AND new = 1 THEN 0 
            WHEN OrderItem.status = 3 AND new = 0 THEN kolicina 
          END`),
          'order_kol'
        ],
        [
          literal(`CASE 
            WHEN OrderItem.status IN (0, 1, 2) THEN prodajna_kolicina 
            WHEN OrderItem.status = 3 THEN 0 
          END`),
          'get_kol'
        ],
      ],
      include: [
        {
          model: Orders,
          attributes: [], // Exclude default attributes from Order
          required: true,
        },
        {
          model: Product,
          attributes: [], // Exclude default attributes from Product
          required: true,
          include: [
            {
              model: SifKategorija, // Assuming this is the model for `sif_kategorija`
              attributes: [], // Exclude default attributes from Category
              required: true,
            }
          ]
        },
        {
          model: ProductItem,
          attributes: [], // Exclude default attributes from ProductItem
          required: true,
        },
      ],
      where: {
        '$Orders.id$': id,
        [Op.and]: [
          literal(`CASE WHEN OrderItem.status = 3 THEN new = 0 ELSE 1 = 1 END`),
        ],
      },
      order: [
        [col('Product.SifKategorija.id'), 'ASC'],
        [col('Product.item_name'), 'ASC'],
      ],
    });
    return orderItems;
  }

  async getChefsInvoices({ search, orderBy, sortedBy, limit, page }: GetChefsInvoicesDto): Promise<ChefsInvoicesPaginator> {
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
      order.push([
        ['datum', 'DESC']
      ])
    }
    const chefsInvoices = await Orders.findAll({
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
        flag_approved: 0,
        ...searchOptions.where,
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = chefsInvoices.slice(startIndex, endIndex);
    const url = `/chefs-invoices?search=${search}&status=0&limit=${limit}`;

    return {
      data: results,
      ...paginate(chefsInvoices.length, page, limit, results.length, url),
    };
  }

  async getIntervals(): Promise<any> {
    const intervals = await SalesDateInterval.findAll({
      attributes: [
        'id',
        'year',
        [literal("CONCAT(COALESCE(DATE_FORMAT(start_date,'%m/%d/%Y'), ''),' - ',COALESCE(DATE_FORMAT(end_date,'%m/%d/%Y'), ''))"), 'date_interval']
      ],
      where: {
        status: 0
      },
      order: [
        ['start_date', 'DESC']
      ]
    });
    return intervals;
  }

  async getSales(intervalId: any) {
    if (intervalId != "undefined") {
      const locations = await Location.findAll({
        where: { status: 0 },
        attributes: [
          ['id', 'l_id'],
          'location_name',
          [literal(`COALESCE((SELECT id FROM Sales WHERE location_id = Location.id AND sales_date_interval_id = ${intervalId} AND status = 0), 0)`), 's_id'],
          [literal(`COALESCE((SELECT flag_approved FROM Sales WHERE location_id = Location.id AND sales_date_interval_id = ${intervalId} AND status = 0), 0)`), 'flag_approved'],
          // [literal(`(SELECT GROUP_CONCAT(id) FROM sales_item WHERE sales_id IN (SELECT id FROM Sales WHERE location_id = Location.id AND sales_date_interval_id = ${intervalId} AND status = 0) AND tip = 2)`), 'sales_other'],
        ],
        order: [['location_name', 'ASC']],
      });
      return locations;
    }
    else return [];
  }

  async getSaleItems(salesId: number) {
    const saleItems = await SalesItem.findAll({
      attributes: [
        'id',
        'description',
        [literal("COALESCE(DATE_FORMAT(start_date,'%m/%d/%Y'), '')"), 'start_date'],
        [literal("COALESCE(DATE_FORMAT(end_date,'%m/%d/%Y'), '')"), 'end_date'],
        [literal("COALESCE(sales,0)"), 'sales'],
        [literal("COALESCE(quantity,0)"), 'quantity'],
        [literal("COALESCE(commission,0)"), 'commission'],
      ],
      where: {
        sales_id: salesId,
        tip: 1,
        status: 0,
      },
      order: [
        'id',
      ]
    })

    return {saleItems};
  }

  async createOrUpdateSale(data: any) {
    let saleId = data.saleId;
    if (data.saleId == 0) {
      const interval = await SalesDateInterval.findByPk(data.intervalId, {
        attributes: [
          'start_date',
          'end_date',
        ]
      })

      if (!interval) {
        throw new Error('Interval not found');
      }

      const { start_date, end_date } = interval;

      const order = await Orders.findOne({
        attributes: [
          [literal("GROUP_CONCAT(id)"), 'id'],
        ],
        where: {
          location_id: data.locationId,
          datum: {
            [Op.and]: [
              { [Op.gte]: new Date(start_date + 'T00:00:00') },
              { [Op.lte]: new Date(end_date + 'T23:59:59') },
            ],
          },
          status: 0,
        }
      })

      const chef = await Chef.findOne({
        attributes: [
          'id',
        ],
        include: [{
          model: ChefLocation,
          required: true,
          where: {
            location_id: data.locationId
          }
        }],
        where: {
          status: 0
        }
      })
      const orderId = order.id;
      const chefId = chef.id;

      const newSales = await Sales.create({
        sales_date_interval_id: data.intervalId,
        location_id: data.locationId,
        chef_id: chefId,
        orders_id: orderId,
        flag_approved: 1,
        status: 0
      })
      saleId = newSales.id;
    }

    await Sales.update(
      {
        items_count: data.saleItems.length,
      },
      {
        where: { id: saleId },
        returning: true
      }
    )
    data.saleItems.forEach(async (saleItem: any) => {
      if (saleItem.id == 0) {
        const newSaleItem = await SalesItem.create({
          start_date: saleItem?.start_date ? new Date(saleItem?.start_date) : null,
          end_date: saleItem?.end_date ? new Date(saleItem?.end_date) : null,
          description: saleItem?.description,
          sales: saleItem?.sales,
          quantity: saleItem?.quantity,
          commission: saleItem?.commission,
          sales_id: saleId,
          tip: 1,
          status: 0
        })
      } else {
        await SalesItem.update(
          {
            start_date: saleItem?.start_date ? new Date(saleItem?.start_date) : null,
            end_date: saleItem?.end_date ? new Date(saleItem?.end_date) : null,
            description: saleItem?.description,
            sales: saleItem?.sales,
            quantity: saleItem?.quantity,
            commission: saleItem?.commission
          },
          {
            where: {
              id: saleItem.id
            }
          }
        )
      }
    });
    return true;
  }

  async deactiveSalesItem(itemId: any) {
  const updatedSalesItem = await SalesItem.update(
    {
      status: 1,
    },
    {
      where: {
        id: itemId
      }
    }
  )

  const item = await SalesItem.findByPk(itemId, {
    attributes: [
      'sales_id'
    ]
  })
  const salesId = item?.sales_id;
  const uppdateSales = await Sales.update(
    {
      items_count: literal('items_count - 1'),
    },
    {
      where: {
        id: salesId
      }
    }
  )
  return true;
}

  async deactiveSalesOtherItem(itemId: any) {
  const updatedSalesItem = await SalesItem.update(
    {
      status: 1,
    },
    {
      where: {
        id: itemId
      }
    }
  )
  return true;
}

  async deactiveSales(salesId: any) {
  const updatedSalesItems = await SalesItem.update(
    {
      status: 1,
    },
    {
      where: {
        sales_id: salesId
      }
    }
  )

  const updatedSales = await Sales.update(
    {
      status: 1,
    },
    {
      where: {
        id: salesId
      }
    }
  )

  return true;
}

  async getMarketStatements({ search, orderBy, sortedBy, limit, page }: GetDto): Promise < GetPaginator > {
  if(!page) page = 1;
  const searchOptions = search ? {
    where: {
      [Op.or]: [
        { start_date: { [Op.like]: `%${search}%` } },
        { end_date: { [Op.like]: `%${search}%` } },
      ],
    },
  } : {};
  const order = [];
  if(orderBy && sortedBy) {
  order.push([orderBy, sortedBy.toUpperCase()]);
}
// Fetch chefs with joins
const details = await SalesDateInterval.findAll({
  attributes: [
    'id',
    'year',
    [literal("COALESCE(DATE_FORMAT(start_date, '%m/%d/%Y'), '')"), 'start_date'],
    [literal("COALESCE(DATE_FORMAT(end_date, '%m/%d/%Y'), '')"), 'end_date'],
  ],
  where: {
    id: {
      [Op.in]: literal("(SELECT sales_date_interval_id FROM sales WHERE status = 0)"),
    },
    ...searchOptions.where,
  },
  order: [
    ['year', 'DESC']
  ]
});
const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const results = details.slice(startIndex, endIndex);
const url = `/market-statement?search=${search}&limit=${limit}`;

return {
  data: results,
  ...paginate(details.length, page, limit, results.length, url),
};
  }

  async approveSales(salesId: any) {
  const updatedSales = await Sales.update(
    {
      flag_approved: 0,
      approved_date: new Date()
    },
    {
      where: {
        id: salesId
      }
    }
  )
  return true;
}

  async getSalesOtherItem(salesId: number) {
  const saleItems = await SalesItem.findAll({
    attributes: [
      'id',
      'description',
      [literal("COALESCE(DATE_FORMAT(start_date,'%m/%d/%Y'), '')"), 'start_date'],
      [literal("COALESCE(DATE_FORMAT(end_date,'%m/%d/%Y'), '')"), 'end_date'],
      [literal("COALESCE(sales,0)"), 'sales'],
      [literal("COALESCE(quantity,0)"), 'quantity'],
      [literal("COALESCE(chef_commission,0)"), 'commission'],
    ],
    where: {
      sales_id: salesId,
      tip: 1,
      status: 0,
    },
    order: [
      'id',
    ]
  })

  const saleOtherItems = await SalesItem.findAll({
    attributes: [
      'id',
      'description',
      'date_period',
      [literal("COALESCE(sales,0)"), 'sales'],
      [literal("COALESCE(chef_commission,0)"), 'commission'],
    ],
    where: {
      sales_id: salesId,
      tip: 2,
      status: 0
    },
    order: [
      'id'
    ]
  })

  return { saleItems, saleOtherItems }
}

  async createOrUpdateSalesOther(data: any) {
  data.saleItems.forEach(async (item: any) => {
    const updatedSalesItem = await SalesItem.update(
      {
        chef_commission: item.commission ? item.commission : null
      },
      {
        where: {
          id: item.id
        }
      }
    )
  })

  data.saleOtherItems.forEach(async (item: any) => {
    if (item.id == 0) {
      if (item.date_period != '' || item.description != '' || item.sales != '' || item.commission != '') {
        await SalesItem.create({
          description: item.description,
          date_period: item.date_period,
          sales: item.sales,
          chef_commission: item.commission,
          sales_id: data.saleId,
          tip: 2,
          status: 0
        })
      }
    } else {
      await SalesItem.update(
        {
          description: item.description,
          date_period: item.date_period,
          sales: item.sales,
          chef_commission: item.commission,
        },
        {
          where: {
            id: item.id
          }
        }
      )
    }
  })
  return true;
}
}
