import axios from 'axios';
import * as dotenv from 'dotenv';

import type {
  Composer,
  TelegramSalesOrder,
  TelegramError,
} from '../types/telegram';

dotenv.config();

const composeMessage = (options: TelegramSalesOrder) => `__${options.name}__
Tạo đơn hàng thành công
[Sales Order](https://${process.env.ACCOUNT_ID}.app.netsuite.com/app/accounting/transactions/salesord.nl?id=${options.salesOrder})`;

const composeError = ({ name, message }: TelegramError) =>
  `Error at ${name}: ${message}`;

const sendMessage = (composer: Composer) => {
  const send = async (options: TelegramSalesOrder | TelegramError) => {
    try {
      const { data } = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: '-1001685563275',
          parse_mode: 'MarkdownV2',
          text: composer(options),
        }
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return send;
};

export const telSalesOrder = sendMessage(composeMessage as Composer);
export const telError = sendMessage(composeError as Composer);
