/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { Response } from 'express';
import * as OrderPaymentMethod from './vuanem-netsuite-types/orderPaymentMethod';
import * as Location from './vuanem-netsuite-types/location';
import * as Shopee from './shopee';

export type Ecommerce = {
  name: string;
  orderPaymentMethod: OrderPaymentMethod.OrderPaymentMethod;
  location: Location.Location;
  employee: number;
  partner: number;
};

export type Customer = {
  name: string;
  phone: string;
  address: string;
};

export type SalesOrder = {
  customerInfo: Customer;
  ecommerce: Ecommerce;
  origins: {
    orderId: string;
  };
  items: Item[];
};

export type Item = {
  itemid: string;
  quantity: number;
};

export type Handler = (data: Shopee.PushData, res: Response) => void;
