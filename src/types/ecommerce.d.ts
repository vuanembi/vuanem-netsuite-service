/* eslint-disable camelcase */

import * as OrderPaymentMethod from './vuanem-netsuite-types/orderPaymentMethod';
import * as Location from './vuanem-netsuite-types/location';

export type Ecommerce = {
  orderPaymentMethod: OrderPaymentMethod.OrderPaymentMethod;
  location: Location.Location;
  employee: number;
  partner: number
};

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

export type StageSalesOrder = {
  customerInfo: CustomerInfo;
  ecommerce: Ecommerce;
  items: {
    itemid: string;
    quantity: number;
  }[];
};
