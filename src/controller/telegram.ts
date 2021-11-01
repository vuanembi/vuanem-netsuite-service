import axios from 'axios';
import * as dotenv from 'dotenv';

import type { TelegramMessage } from '../types/telegram';

dotenv.config();

const composeMessage = (options: TelegramMessage) => `__${options.name}__
Tạo đơn hàng thành công
[Sales Order](https://${process.env.ACCOUNT_ID}.app.netsuite.com/app/accounting/transactions/salesord.nl?id=${options.salesOrder})`;

const sendMessage = async (body: string) => {
  try {
    const { data } = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: '-1001685563275',
        parse_mode: 'MarkdownV2',
        text: body,
      }
    );
    return [null, data];
  } catch (err) {
    return [err, null];
  }
};

const postTelegram = async (options: TelegramMessage) =>
  sendMessage(composeMessage(options));

export default postTelegram;
