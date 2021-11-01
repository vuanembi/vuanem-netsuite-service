/* eslint-disable camelcase */

import type OrderPaymentMethod from './vuanem-netsuite-types/orderPaymentMethod'

type Ecommerce = {
    orderPaymentMethod: OrderPaymentMethod,
    location: number;
    employee: number
}

type Customer = {
    name: string,
    phone: string,
    town: string,
    district: string,
    city: string,
    full_address: string

}
export type StageSalesOrder = {
    customer: Customer,
    ecommerce: Ecommerce
}
