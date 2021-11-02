/* eslint-disable no-unused-vars */

export type SuccessOptions = {
  name: string;
  salesOrder: number;
};

export type ErrorOptions = {
  name: string;
  message: string;
};

export type Composer = (options: SuccessOptions | ErrorOptions) => string;
