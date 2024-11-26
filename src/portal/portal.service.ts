import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceGroupPaginator, GetPriceGroupsDto } from '../price-group/dto/get-chef.dto';
import { paginate } from 'src/common/pagination/paginate';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';
import { col, literal, Op } from 'sequelize';
import { Chef } from 'src/modules/chef/chef.entity';
import { Location } from 'src/modules/location/location.entity';
import { Orders } from 'src/modules/orders/orders.entity';
import { Sales } from 'src/modules/sales/sales.entity';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';
import { Product } from 'src/modules/product/product.entity';
import { ProductItem } from 'src/modules/product-item/product-item.entity';
import { SifKategorija } from 'src/modules/sif-ktegorija/sifK-ktegorija.entity';
import { OrderItem } from 'src/modules/order-item/order-item.entity';
import nodemailer from 'nodemailer';
@Injectable()
export class PortalService {

  async getOrders(user, { search, orderBy, sortedBy, limit, page }: any): Promise<any> {
    const searchOptions = user.role != 1 ? {
      where: {
        chef_id: user.chefId
      },
    } : {};
    if (!page) page = 1;
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
    const orders = await Orders.findAll({
      include: [
        {
          model: Location,// Exclude default attributes from Location
          attributes: [
            'location_name'
          ],
        },
        {
          model: Chef,// Exclude default attributes from Chef
          attributes: [
            'first_name',
            'last_name'
          ],
        }
      ],
      where: {
        status: 0, // Filter by status
        ...searchOptions.where
      },
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = orders.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&status=0&limit=${limit}`;

    return {
      data: results,
      isAdmin: user.role != 1 ? false : true,
      ...paginate(orders.length, page, limit, results.length, url),
    };
  }

  async getOrder(id: number): Promise<Orders> {
    const order = await Orders.findByPk(id, {
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
    return order;
  }

  async getInvoices(user, { search, orderBy, sortedBy, limit, page }: any): Promise<any> {
    const searchOptions = user.role != 1 ? {
      where: {
        chef_id: user.chefId
      },
    } : {};
    if (!page) page = 1;;
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
    const invoices = await Orders.findAll({
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
    const results = invoices.slice(startIndex, endIndex);
    const url = `/invoices?search=${search}&status=0&limit=${limit}`;

    return {
      data: results,
      isAdmin: user.role != 1 ? false : true,
      ...paginate(invoices.length, page, limit, results.length, url),
    };
  }

  async getStatements(user, { search, orderBy, sortedBy, limit, page }: any): Promise<any> {
    const searchOptions = user.role != 1 ? {
      where: {
        chef_id: user.chefId
      },
    } : {};
    if (!page) page = 1;
    const order = [];
    if (orderBy && sortedBy) {
      if (orderBy === 'role') {
        order.push([{ model: KorisnickiNalog, as: 'korisnickiNalog' }, 'sif_uloga_id', sortedBy.toUpperCase()]); // Sort by role's ID
      } else {
        order.push([orderBy, sortedBy.toUpperCase()]);
      }
    }
    order.push(
      [literal('salesDateInterval.start_date'), 'DESC'],
      [literal('Chef.first_name'), 'ASC'],)
    const statement = await Sales.findAll({
      attributes: [
        [literal('GROUP_CONCAT(Sales.id)'), 'sales_id'],
        [literal('GROUP_CONCAT(location.location_name ORDER BY location_name)'), 'location_name'],
        [literal("CONCAT(chef.first_name, ' ', chef.last_name)"), 'chef_name'],
        [literal("DATE_FORMAT(salesDateInterval.start_date, '%m/%d/%Y')"), 'start_date'],
        [literal("DATE_FORMAT(salesDateInterval.end_date, '%m/%d/%Y')"), 'end_date'],
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
        ...searchOptions.where
      },
      group: ['sales_date_interval_id', 'chef_id'],
      order,
    });
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = statement.slice(startIndex, endIndex);
    const url = `/statements?search=${search}&limit=${limit}`;

    return {
      data: results,
      isAdmin: user.role != 1 ? false : true,
      ...paginate(statement.length, page, limit, results.length, url),
    };
  }

  async getProducts(user, { search, orderBy, sortedBy, limit, page }: any): Promise<any> {
    console.log(user)
    const searchOptions = search ? {
      where: {
        [Op.or]: [
          { item_name: { [Op.like]: `%${search}%` } }
        ],
      },
    } : {};
    const products = await Product.findAll({
      attributes: [
        [col('Product.id'), 'id'],
        [col("Product.item_name"), "item_name"],
        [col("Product.item_number"), "item_number"],
        [col("Product.item_brand"), "item_brand"],
        [col("Product.item_image"), "item_image"],
        [col('sifKategorija.naziv'), 'naziv_kategorije']
      ],
      include: [
        {
          model: ProductItem,
          attributes: [
            [col("id"), "product_item_id"],
            [col("package"), "package"],
            [literal(`COALESCE(price_${user.sifra},0)`),'price']
          ],
          where: {
            status: 0
          }
        },
        {
          model: SifKategorija,
          attributes: [
            [col('naziv'), 'naziv'] // Include 'naziv' in attributes
          ],
          order:['id'],
          required: true 
        },
      ],
      where: {
        // status: 0,
        public:0,
        ...searchOptions.where
      },
      order: [
        'item_name'
      ]
    })

    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = products.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(products.length, page, limit, results.length, url),
    };

  }

  async createOrder(user:any,data:any){
    const newOrder = await Orders.create({
      ukupna_cena: data.totalPrice,
      br_proizvoda: data.items.length,
      datum: new Date(),
      chef_id: user.chefId,
      location_id: user.locationId,
      status: 0,
      flag_approved: 1,
      pallet_cost: 0,
      tax: 0,
      order_price: 0
    })

    data.items.forEach(async (item:any) => {
      await OrderItem.create({
        kolicina: item.quantity,
        product_id: item.id,
        orders_id: newOrder.id,
        product_item_id: item.productItem.product_item_id,
        prodajna_kolicina: item.quantity,
        status: 0,
        new: 0,
        price: item.price
      })
    });
    // this.sendNotificationEmail();
    return true;
  }

  async sendNotificationEmail() {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Your SMTP server
      port: 587, // SMTP port
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'businessmoana118@gmail.com', // Your email
        pass: 'mBusiness118*', // Your email password
      },
    });
  
    // Email options
    const mailOptions = {
      from: '"Order Notification" <businessmoana118@gmail.com>', // Sender address
      to: 'businessmoana118@gmail.com', // Your email to receive notifications
      subject: 'New Order Created', // Subject line
      text: `A new order has been created.`, // Plain text body
    };
  
    // Send email
    await transporter.sendMail(mailOptions);
  }
}