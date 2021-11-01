/* eslint-disable import/prefer-default-export */

import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import shopeeHandle from './controller/shopee';

// import createSalesOrder from './controller/netsuite';
// import postTelegram from './controller/telegram';
// import { build } from './controller/shopee';
// import { OrderResponse } from './types/shopee';

// const mock: OrderResponse = {
//   request_id: 'hjhj',
//   orders: [
//     {
//       ordersn: 'shope123',
//       country: 'VN',
//       currency: 'VND',
//       days_to_ship: 3,
//       recipient_address: {
//         name: 'HM',
//         phone: '0773314403',
//         full_address: '50A Ngo Ngo Si Lien',
//       },
//       order_status: 'UNPAID',
//       message_to_seller: 'DON TEST DON TEST',
//       note: 'DON TEST DON TEST',
//       create_time: 1635738342,
//       update_time: 1635738342,
//       items: [
//         {
//           variation_id: 123,
//           variation_name: '120x200x5',
//           variation_sku: '1103002001004',
//           variation_discounted_price: '6940.00',
//           variation_original_price: '9200.00',
//           variation_quantity_purchased: 1,
//         },
//       ],
//     },
//   ],
// };

// const x = build(mock);
// const y = createSalesOrder(x).then(([, b]) => {
//   if (b) {
//     postTelegram({
//       name: 'Shopee',
//       salesOrder: b,
//     });
//   }
// });

export const main: HttpFunction = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).send({ status: 'ok' });
  } else if (req.method === 'POST') {
    if (req.path === 'shopee') {
      shopeeHandle(req.body, res);
    }
  }
};
