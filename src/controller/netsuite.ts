import * as dayjs from 'dayjs';

import * as rl from './restlet';
import type { CustomerInfo, StageSalesOrder } from '../types/ecommerce';
import type { RestletOptions } from '../types/restlet';
import type {
  CustomerRecord,
  CustomerRes,
} from '../types/vuanem-netsuite-types/customer';
import type {
  SalesOrderRecord,
  SalesOrderRes,
} from '../types/vuanem-netsuite-types/salesOrder';
import type { InventoryItemSearch } from '../types/vuanem-netsuite-types/inventoryItem';

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

const createCustomerIfNotExist = async (
  data: CustomerInfo
): Promise<[unknown | null, CustomerRes | null]> => {
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

const mapSKUToItemID = async ({ itemid }: InventoryItemSearch) => {
  const [errItem, item] = await rl.get(InventoryItem)({
    params: { itemid },
  });
  return !errItem ? item : null;
};

const createSalesOrder = async ({
  customerInfo,
  ecommerce,
  origins,
  items,
}: StageSalesOrder): Promise<[unknown | null, SalesOrderRes | null]> => {
  const [errCustomer, customer] = await createCustomerIfNotExist(customerInfo);
  if (errCustomer || !customer) {
    return [errCustomer, null];
  }
  const salesOrderRecord: SalesOrderRecord = {
    shipdate: dayjs().format('YYYY-MM-DD'),
    trandate: dayjs().add(7, 'days').format('YYYY-MM-DD'),

    // NetSuite Customer
    entity: Number(customer.id),
    custbody_customer_phone: customer.values.phone,
    custbody_recipient_phone: customer.values.phone,

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
    item: await Promise.all(
      items.map(async (i) => {
        const { id } = await mapSKUToItemID(i);
        return {
          item: id,
          quantity: i.quantity,
        };
      })
    ),

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
