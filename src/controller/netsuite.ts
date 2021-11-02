import * as dayjs from 'dayjs';

import * as rl from './restlet';
import type { PromiseSideEffect } from '../types/common';
import type * as ecommerce from '../types/ecommerce'
import type { RestletQuery, RestletOptions } from '../types/restlet';
import type {
  CustomerRecord,
  CustomerRes,
} from '../types/vuanem-netsuite-types/customer';
import type {
  SalesOrderItem,
  SalesOrderRecord,
  SalesOrderRes,
} from '../types/vuanem-netsuite-types/salesOrder';
import type {
  InventoryItemSearch,
  InventoryItemRes,
} from '../types/vuanem-netsuite-types/inventoryItem';
import { RestletRes } from '../types/vuanem-netsuite-types/record';

const SalesOrder: RestletOptions = {
  script: 997,
  deploy: 1,
};
const Customer: RestletOptions = {
  script: 1099,
  deploy: 1,
};
const InventoryItem: RestletOptions = {
  script: 1101,
  deploy: 1,
};

const createCustomerIfNotExist: PromiseSideEffect<ecommerce.Customer, CustomerRes> =
  async (data) => {
    const [errCustomer, customer] = await rl.get(Customer)({
      params: { phone: data.phone },
    });
    return !errCustomer
      ? [errCustomer, customer]
      : rl.post(Customer)({
          body: {
            phone: data.phone,
            custentity_employee_record_reference: 1444,
            firstname: data.name,
          } as CustomerRecord,
        });
  };

const mapSKUToItemID: PromiseSideEffect<InventoryItemSearch, InventoryItemRes> =
  async ({ itemid }) => {
    const [errItem, item] = await rl.get(InventoryItem)({
      params: { itemid },
    });
    return [errItem, item];
  };

const mapSKUs = async (items: ecommerce.Item[]) =>
  Promise.all(
    items.map(async (i: ecommerce.Item) => {
      const [errItem, item] = await mapSKUToItemID(i);
      return errItem && item !== null
        ? {
            item: Number(item.id),
            quantity: i.quantity,
          }
        : null;
    })
  );

const createSalesOrder: PromiseSideEffect<ecommerce.SalesOrder, SalesOrderRes> =
  async ({ customerInfo, ecommerce, origins, items }) => {
    const [[errCustomer, customer], itemRaw] = await Promise.all([
      createCustomerIfNotExist(customerInfo),
      mapSKUs(items),
    ]);
    const item = itemRaw.filter((i): i is SalesOrderItem => i !== null);
    if (errCustomer || !customer) {
      return [errCustomer, null];
    }
    const salesOrderRecord: SalesOrderRecord = {
      shipdate: dayjs().format('YYYY-MM-DD'),
      trandate: dayjs().add(7, 'days').format('YYYY-MM-DD'),

      // NetSuite Customer
      entity: Number(customer.id),
      custbody_customer_phone: customer.fields.phone,
      custbody_recipient_phone: customer.fields.phone,

      // Ecommerce Customer
      custbody_recipient: customerInfo.name,
      shippingaddress: {
        addressee: customerInfo.address,
        country: 238,
      },

      // Ecommerce
      custbody_order_payment_method: ecommerce.orderPaymentMethod,
      salesrep: ecommerce.employee,
      partner: ecommerce.partner,
      location: ecommerce.location,
      memo: `${ecommerce.name}-${origins.orderId} :: TEST TEST TEST TEST`,

      // NetSuite Items
      item,

      // Defaults
      leadsource: 144506,
      custbody_exepected_shipping_method: 1,
      custbody_expecteddeliverytime: 4,
      custbody5: 1,
      subsidiary: 1,
    };
    const [errSalesOrder, salesOrder] = await rl.post(SalesOrder)({
      body: salesOrderRecord,
    });
    return [errSalesOrder, salesOrder];
  };

export default createSalesOrder;
