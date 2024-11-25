import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Chef } from 'src/modules/chef/chef.entity';
import { KorisnickiNalog } from 'src/modules/korisnicki-nalog/korisnicki-nalog.entity';
import { SifUloga } from 'src/modules/sif-uloga.entity/sif-uloga.entity';
import { ChefLocation } from 'src/modules/chef-location/chef-location.entity';
import { Location } from 'src/modules/location/location.entity';
import { Orders } from 'src/modules/orders/orders.entity';
import { OrderItem } from 'src/modules/order-item/order-item.entity';
import { Product } from 'src/modules/product/product.entity';
import { ProductItem } from 'src/modules/product-item/product-item.entity';
import { ProductPurchasing } from 'src/modules/product-purchasing/product-purchasing.entity';
import { ProductPurchasingItem } from 'src/modules/product-purchasing-item/product-purchasing-item.entity';
import { ProductReceiving } from 'src/modules/product-receiving/product-receiving.entity';
import { ProductReceivingItem } from 'src/modules/product-receiving-item/product-receiving-item.entity';
import { Sales } from 'src/modules/sales/sales.entity';
import { SalesDateInterval } from 'src/modules/sales-date-interval/sales-date-interval.entity';
import { SalesItem } from 'src/modules/sales-item/sales-item.entity';
import { SifKategorija } from 'src/modules/sif-ktegorija/sifK-ktegorija.entity';
import { SifPriceGroup } from 'src/modules/sif-price-group/sif-price-group.entity';
import { SifVendorTerms } from 'src/modules/sif-vendor-terms/sif-vendor-terms.entity';
import { Vendor } from 'src/modules/vendor/vendor.entity';
import { LocationDate } from 'src/modules/location-date/location-date.entity';
export const databaseProviders = [{
    provide: SEQUELIZE,
    useFactory: async () => {
        let config;
        switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
                config = databaseConfig.development;
                break;
            case TEST:
                config = databaseConfig.test;
                break;
            case PRODUCTION:
                config = databaseConfig.production;
                break;
            default:
                config = databaseConfig.development;
        }
        const sequelize = new Sequelize({
            ...config,
            logging: false
        });
        sequelize.addModels([Chef, KorisnickiNalog, ChefLocation, Location, LocationDate, Orders, OrderItem, Product, ProductItem, ProductPurchasing, ProductPurchasingItem, ProductReceiving, ProductReceivingItem, Sales, SalesDateInterval, SalesItem, SifKategorija, SifPriceGroup, SifUloga, SifVendorTerms, Vendor]);
        await sequelize.sync();
        return sequelize;
    },
}];