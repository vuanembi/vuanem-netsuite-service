import * as rl from '../libs/restlet';
import type { RestletOptions } from '../types/restlet';
import type { SalesOrderRecord } from '../types/vuanem-netsuite-types/salesOrder';

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

const createCustomerIfNotExist = async (data) => {
  const [errCustomer, customer] = await rl.get(Customer)({
    params: { phone: data.phone },
  });
  return !errCustomer
    ? [errCustomer, customer]
    : rl.post(Customer)({ body: data.body });
};

const mapSKUToItemID = async (data) => {
  const [errItem, item] = await rl.get(InventoryItem)({
    params: { itemid: data.itemid },
  });
  return !errItem ? item : null;
};

const createSalesOrder = async (data, floor) => {
  const [errCustomer, customer] = await createCustomerIfNotExist(data);
  if (errCustomer) {
    console.log('err');
  }
  const salesOrderRecord: SalesOrderRecord = {
    entity: customer.id,
    custbody_customer_phone: customer.phone,
    custbody_exepected_shipping_method: 1,
    custbody_expecteddeliverytime: 4,
    custbody_recipient: customer.name,
    custbody_recipient_phone: customer.phone,
    shippingaddress: {
      addressee: customer.name,
      country: 238,
    },
    custbody_order_payment_method: floor.orderPaymentMethod,
    trandate: data.trandate,
    salesrep: floor.salesRep,
    leadsource: 144506,
    custbody5: 1,
    subsidiary: 1,
    location: floor.location,
    item: await Promise.all(
      data.item.map(async (i) => await mapSKUToItemID(i))
    ),
  };
  const [errSalesOrder, salesOrder] = await rl.post(SalesOrder)({
    body: salesOrderRecord,
  });
  if (errSalesOrder) {
    console.log(errSalesOrder);
  }
  return salesOrder;
};
