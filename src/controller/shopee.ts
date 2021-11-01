/* eslint-disable camelcase */

import axios from 'axios';

import createSalesOrder from './netsuite';

import type { PushData, OrderRequest, OrderResponse } from '../types/shopee';
import type { StageSalesOrder } from '../types/ecommerce';

const get = async (
  req: OrderRequest
): Promise<[unknown | null, OrderResponse | null]> => {
  try {
    const { data } = await axios.get(
      'https://partner.shopeemobile.com/api/v1/orders/detail',
      { params: req }
    );
    return [null, data];
  } catch (err) {
    return [err, null];
  }
};

const build = ({ orders }: OrderResponse): StageSalesOrder => {
  const order = orders[0];
  return {
    customerInfo: {
      name: order.recipient_address.name,
      phone: order.recipient_address.phone,
      address: order.recipient_address.full_address,
    },
    ecommerce: {
      orderPaymentMethod: 41,
      location: 787,
      employee: 11,
      partner: 11,
    },
    items: order.items.map(
      ({ variation_sku, variation_quantity_purchased }) => ({
        itemid: variation_sku,
        quantity: variation_quantity_purchased,
      })
    ),
  };
};

const create = async ({
  shop_id,
  data,
}: PushData): Promise<StageSalesOrder | null> => {
  const [errOrderDetail, orderDetail] = await get({
    shopid: shop_id,
    partner_id: 123,
    ordersn_list: [data.ordersn],
    timestamp: data.timestamp,
  });
  if (errOrderDetail || !orderDetail) {
    return null;
  }
  return createSalesOrder(build(orderDetail));
};

const handler = async (data: PushData) => {
  const {code, data: { status }} = data
  if (code !== 3) {
    return null;
  }
  if (status === 'UNPAID') {
    create(data)
  }
};

export default handler;
