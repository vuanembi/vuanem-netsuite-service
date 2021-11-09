/* eslint-disable camelcase */

import axios from 'axios';
const crypto = require('crypto');

import createSalesOrder from './netsuite';
import { defaultController } from './common';
import { telSalesOrder, telError } from './telegram';

import type { PromiseSideEffect } from '../types/common';
import type * as ecommerce from '../types/ecommerce';
import type { PushData, OrderRequest, OrderResponse } from '../types/shopee';
import type { SalesOrderRes } from '../types/vuanem-netsuite-types/salesOrder';

const axClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'prod'
      ? 'https://api.lazada.vn/rest'
      : 'https://api.lazada.vn/rest',
});
axClient.interceptors.request.use((req) => {
  const hmac = crypto.createHmac(
    'sha256',
    process.env.SHOPEE_API_KEY ||
      '56fb6e4fde4be760000e1b0d0f04ed741c5433947abd261f5e80b92aef100452'
  );
  hmac.update(`${req.baseURL}${req.url}|${JSON.stringify(req.data)}`);
  req.headers = {
    ...req.headers,
    Authorization: hmac.digest('hex'),
  };
  return req;
});
axClient.interceptors.response.use((res) => {
  if (res.data.errors.length === 0) {
    return res;
  }
  throw new Error();
});

const lazadaEcommerce: ecommerce.Ecommerce = {
  name: 'Lazada',
  orderPaymentMethod: 44,
  location: 789,
  employee: 915575,
  partner: 915574,
};

const getOrderDetail: PromiseSideEffect<OrderRequest, OrderResponse> = async (
  req
) => {
  try {
    const { data } = await axClient.post('/order/get', { ...req });
    return [null, data];
  } catch (err) {
    return [err, null];
  }
};

const getOrderItems: PromiseSideEffect<OrderRequest, OrderResponse> = async (
  req
) => {
  try {
    const { data } = await axClient.post('/order/items/get', { ...req });
    return [null, data];
  } catch (err) {
    return [err, null];
  }
};

export const buildStageSalesOrder = ({
  orders,
}: OrderResponse): ecommerce.SalesOrder => {
  const order = orders[0];
  return {
    customerInfo: {
      name: order.recipient_address.name,
      phone: order.recipient_address.phone,
      address: order.recipient_address.full_address,
    },
    ecommerce: lazadaEcommerce,
    origins: {
      orderId: order.ordersn,
    },
    items: order.items.map(
      ({ variation_sku, variation_quantity_purchased }) => ({
        itemid: variation_sku,
        quantity: variation_quantity_purchased,
      })
    ),
  };
};

const create: PromiseSideEffect<PushData, SalesOrderRes> = async ({
  shop_id,
  data,
  timestamp,
}) => {
  const [errOrderDetail, orderDetail] = await getOrderDetail({
    shopid: shop_id,
    partner_id: Number(process.env.SHOPEE_PARTNER_ID) || 1004299,
    ordersn_list: [data.ordersn],
    timestamp,
  });
  if (errOrderDetail || !orderDetail) {
    console.log(errOrderDetail);
    return [errOrderDetail, orderDetail as null];
  }
  const [errTask, task] = await createSalesOrder(
    buildStageSalesOrder(orderDetail)
  );
  return [errTask, task];
};

const shopeeController: ecommerce.Handler = async (data, res) => {
  const {
    code,
    data: { status },
  } = data;
  if (code !== 3) {
    defaultController(res);
  } else {
    if (status === 'UNPAID') {
      const [errTask, task] = await create(data);
      if (errTask || !task) {
        console.log(errTask);
        telError({
          name: lazadaEcommerce.name,
          message: (errTask as Error).message,
        });
        res.status(500).send({ data: 'not ok' });
      } else {
        const results = {
          name: lazadaEcommerce.name,
          salesOrder: Number(task.id),
        };
        telSalesOrder(results);
      }
    } else {
      defaultController(res);
    }
  }
};

export default shopeeController;
