/* eslint-disable camelcase */

import type { ShopeePush } from '../types/ecommerce';
import { getShopeeOrder } from '../libs/ecommerce';

const shopeeHandler = async ({ code, shop_id, data }: ShopeePush) => {
  if (code !== 3) {
    return null;
  }
  const orderDetail = await getShopeeOrder({
    shopid: shop_id,
    partner_id: 123,
    ordersn_list: [data.ordersn],
    timestamp: data.timestamp,
  });
};

const buildShopeeSalesOrder = 
