import Shopify from '@shopify/shopify-api';
import logger from '../utils';

export class Customer {
  firstName;

  lastName;

  ordersCount;

  constructor(firstName, lastName, ordersCount) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.ordersCount = ordersCount;
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export default class CustomerService {
  static async getTop10CustomersByOrders(shop, accessToken) {
    logger.info(`${shop} is trying to access top 10 customers by orders`);

    try {
      const client = new Shopify.Clients.Rest(shop, accessToken);
      const customerQryRes = await client.get({
        path: 'customers/search',
        query: {
          order: 'orders_count DESC',
          limit: 10,
        },
      });

      logger.info('Querying complete');

      const mappedCustomers = customerQryRes.body.customers
        .filter((c) => c.orders_count > 0)
        .map((c) => new Customer(c.first_name, c.last_name, c.orders_count));

      logger.info(`Mapping complete, ${mappedCustomers.length} customers found`);

      return mappedCustomers;
    } catch (ex) {
      // this should be specific, maybe even higher up the chain
      // but I want to keep the index page clean
      logger.warn(`Failed fulfilling request: ${ex}`);
    }

    return null;
  }
}
