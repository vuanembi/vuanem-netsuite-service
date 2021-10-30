/* eslint-disable camelcase */

export type PushData = {
  code: number;
  shop_id: number;
  data: {
    ordersn: string;
    status: string;
    update_time: number;
    timestamp: number;
  };
};

export type OrderRequest = {
  ordersn_list: Array<string>;
  partner_id: number;
  shopid: number;
  timestamp: number;
};

export type OrderItem = {
  item_id: number;
  item_name: string;
  item_sku: string;
  variation_id: number;
  variation_name: string;
  variation_sku: string;
  variation_quantity_purchased: number;
  variation_original_price: string;
  variation_discounted_price: string;
  is_wholesale: boolean;
  is_add_on_deal: boolean;
  is_main_item: boolean;
  add_on_deal_id: number;
  order_item_id: number;
  group_id: number;
  is_set_item: boolean;
  promotion_type: string;
  promotion_id: number;
};

export type Order = {
  ordersn: string;
  country: string;
  currency: string;
  cod: boolean;
  tracking_no: string;
  days_to_ship: number;
  recipient_address: {
    name: string;
    phone: string;
    town: string;
    district: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    full_address: string;
  };
  actual_shipping_cost: string;
  estimated_shipping_fee: string;
  escrow_tax: string;
  total_amount: string;
  escrow_amount: string;
  order_status: string;
  shipping_carrier: string;
  checkout_shipping_carrier: string;
  payment_method: string;
  goods_to_declare: boolean;
  message_to_seller: string;
  note: string;
  note_update_time: boolean;
  create_time: number;
  update_time: number;
  items: Array<orderItem>;
  pay_time: number;
  buyer_cancel_reason: string;
  cancel_by: string;
  cancel_reason: string;
  order_flag: string;
  reverse_shipping_fee: string;
};

export type OrderResponse = {
  request_id: string;
  orders: Array<Order>;
};
