/* eslint-disable no-unused-vars */

export type TelegramSalesOrder = {
  name: string;
  salesOrder: number;
};

export type TelegramError = {
  name: string;
  message: string;
};

export type Composer = (options: TelegramSalesOrder | TelegramError) => string;
