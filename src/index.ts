/* eslint-disable import/prefer-default-export */

import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';
import { defaultController, wrongMethodController } from './controller/common';
import shopeeHandle from './controller/shopee';

export const main: HttpFunction = (req, res) => {
  const { path, method, params, body } = req;
  console.log(JSON.stringify({ path, method, params, body }));

  if (method === 'GET') {
    defaultController(res);
  } else if (method === 'POST') {
    if (path === '/shopee') {
      shopeeHandle(body, res);
    } else {
      defaultController(res);
    }
  } else {
    wrongMethodController(res);
  }
};
