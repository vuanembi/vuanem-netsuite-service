import requestRestlet from '../libs/restlet';
import type { RestletOptions } from '../types/restlet';

const Restlet = (options: RestletOptions) => ({
  get: requestRestlet(options, 'GET'),
  post: requestRestlet(options, 'POST'),
  delete: requestRestlet(options, 'DELETE'),
});

const SalesOrder = Restlet({
  script: 997,
  deploy: 1,
});

const customerRestlet: Restlet = {
  script: 1099,
  deploy: 1,
};

// const inventoryItemRestlet: Restlet = {
//   script: 1101,
//   deploy: 1,
// };

const createCustomerIfNotExist = async (data) => {
  let [errCustomer, customer] = await requestRestlet(
    customerRestlet,
    'GET'
  )({ params: { phone: data.phone } });
  if (errCustomer) {
    const [, createdCustomer] = await requestRestlet(
      customerRestlet,
      'POST'
    )({ body: data.body });
    customer = createdCustomer;
  }
  return customer;
};

const createSalesOrder = async (data) => {
  const customer = await createCustomerIfNotExist(data);
};
