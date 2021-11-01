import * as rl from './restlet';
import type { CustomerInfo, StageSalesOrder } from '../types/ecommerce';
import type { RestletOptions } from '../types/restlet';
import type { CustomerRecord } from '../types/vuanem-netsuite-types/customer';
import type { SalesOrderRecord } from '../types/vuanem-netsuite-types/salesOrder';
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


const createCustomerIfNotExist = async (data: CustomerInfo) => {
  const [errCustomer, customer] = await rl.get(Customer)({
    params: { phone: data.phone },
  });
  return !errCustomer
    ? [errCustomer, customer]
    : rl.post(Customer)({
        body: {
          leadsource: 144506,
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
  items,
}: StageSalesOrder) => {
  const [, customer] = await createCustomerIfNotExist(customerInfo);
  const salesOrderRecord: SalesOrderRecord = {
    entity: customer.id,
    custbody_customer_phone: customer.phone,
    shipdate: '2021-01-01',
    custbody_exepected_shipping_method: 1,
    custbody_expecteddeliverytime: 4,
    custbody_recipient: customer.name,
    custbody_recipient_phone: customer.phone,
    shippingaddress: {
      addressee: customer.name,
      country: 238,
    },
    custbody_order_payment_method: ecommerce.orderPaymentMethod,
    trandate: '2021-01-01',
    salesrep: ecommerce.employee,
    leadsource: 144506,
    custbody5: 1,
    partner: ecommerce.partner,
    subsidiary: 1,
    location: ecommerce.location,
    item: await Promise.all(items.map(async (i) => mapSKUToItemID(i))),
  };
  const [errSalesOrder, salesOrder] = await rl.post(SalesOrder)({
    body: salesOrderRecord,
  });
  return salesOrder;
};

export default createSalesOrder;
