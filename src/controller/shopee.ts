/* eslint-disable camelcase */

import axios from 'axios';

import type { PushData, OrderRequest, OrderResponse } from '../types/shopee';
import type { StageSalesOrder } from '../types/ecommerce';

const getShopeeOrder = async (
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

const buildShopeeSalesOrder = ({ orders }: OrderResponse): StageSalesOrder => {
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

const shopeeHandler = async ({
  code,
  shop_id,
  data,
}: PushData): Promise<StageSalesOrder | null> => {
  if (code !== 3) {
    return null;
  }
  const [errOrderDetail, orderDetail] = await getShopeeOrder({
    shopid: shop_id,
    partner_id: 123,
    ordersn_list: [data.ordersn],
    timestamp: data.timestamp,
  });
  if (errOrderDetail || !orderDetail) {
    return null;
  }
  return buildShopeeSalesOrder(orderDetail);
};

export default shopeeHandler
