from typing import Callable
from services.restlet import request_restlet

customer_restlet = {
    "script": 1099,
    "deploy": 1,
}

sales_order_reslet = {
    "script": 997,
    "deploy": 1,
}

get_customer: Callable = request_restlet(customer_restlet, "GET")
post_customer: Callable = request_restlet(customer_restlet, "POST")

get_sales_order = request_restlet(sales_order_reslet, "GET")
post_sales_order = request_restlet(sales_order_reslet, "POST")


def create_sales_order(data):
    customer_err, customer = get_customer(
        params={
            "phone": data["customerPhone"],
        }
    )
    if customer_err:
        customer = post_customer(
            body=
        )
