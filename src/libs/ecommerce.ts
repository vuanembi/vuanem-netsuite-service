import axios from 'axios';

import type { OrderRequest, OrderResponse } from '../types/shopee';
import type { SalesOrderRecord } from '../types/vuanem-netsuite-types/salesOrder'

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

const buildShopeeSalesOrder = async ({orders}: OrderResponse): SalesOrderRecord => {
    const order = orders[0];
    return {
        
    }
}
