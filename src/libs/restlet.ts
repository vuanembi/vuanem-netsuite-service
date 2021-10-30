import * as dotenv from 'dotenv';
import axios from 'axios';
import type { Restlet, RestletMethod } from '../types/restlet';

dotenv.config();

const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

const BASE_URL = `https://${process.env.ACCOUNT_ID}.restlets.api.netsuite.com/app/site/hosting/restlet.nl`;

const oauth = OAuth({
  consumer: {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET,
  },
  realm: process.env.ACCOUNT_ID,
  signature_method: 'HMAC-SHA256',
  hash_function(baseString: string, key: any) {
    return crypto.createHmac('sha256', key).update(baseString).digest('base64');
  },
});

const axClient = axios.create();

const requestRestlet = (restlet: Restlet, method: RestletMethod) => {
  const request = async ({ params, body }: { params?: any; body?: any }) => {
    const requestParams = new URLSearchParams({
      script: restlet.script,
      deploy: restlet.deploy,
      ...params,
    });
    const requestURL = `${BASE_URL}?${requestParams.toString()}`;
    const headers = oauth.toHeader(
      oauth.authorize(
        {
          method,
          url: requestURL,
          data: body,
        },
        {
          key: process.env.ACCESS_TOKEN,
          secret: process.env.TOKEN_SECRET,
        }
      )
    );
    try {
      const { data } = await axClient.request({
        method,
        headers,
        url: requestURL,
        data: body,
      });
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  };
  return request;
};

export default requestRestlet;
