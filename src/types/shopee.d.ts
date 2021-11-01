/* eslint-disable camelcase */

export type PushData = {
  data: {
    ordersn: string;
    status: string;
    update_time: number;
  };
  shop_id: number;
  code: number;
  timestamp: number;
};

export type OrderRequest = {
  ordersn_list: string[];
  partner_id: number;
  shopid: number;
  timestamp: number;
};

export type OrderItem = {
  variation_id: number;
  variation_name: string;
  variation_sku: string;
  variation_quantity_purchased: number;
  variation_original_price: string;
  variation_discounted_price: string;
  is_wholesale?: boolean;
  is_add_on_deal?: boolean;
  is_main_item?: boolean;
  add_on_deal_id?: number;
  order_item_id?: number;
  group_id?: number;
  is_set_item?: boolean;
  promotion_type?: string;
  promotion_id?: number;
};

export type Order = {
  ordersn: string;
  country: string;
  currency: string;
  days_to_ship: number;
  recipient_address: {
    name: string;
    phone: string;
    full_address: string;
  };
  order_status: string;
  message_to_seller: string;
  note: string;
  create_time: number;
  update_time: number;
  items: OrderItem[];
  pay_time?: number | null;
  buyer_cancel_reason?: string | null;
  cancel_by?: string | null;
  cancel_reason?: string | null;
  order_flag?: string | null;
  reverse_shipping_fee?: string | null;
};

export type OrderResponse = {
  request_id: string;
  orders: Order[];
};
