import asyncio

import aiohttp

from services.restlet import request_restlet, customer_restlet

async def main():
    async with aiohttp.ClientSession() as session:
        r = await request_restlet(
            session,
            customer_restlet,
            method="GET",
            params={
                "phone": "0773314403",
            },
        )
        r


asyncio.run(main())
