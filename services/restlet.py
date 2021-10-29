import os
from typing import Coroutine, Callable, Tuple, Awaitable
from urllib.parse import urlencode

import aiohttp
import oauthlib.oauth1

OAUTH_CLIENT = oauthlib.oauth1.Client(
    client_key=os.getenv("CONSUMER_KEY"),
    client_secret=os.getenv("CONSUMER_SECRET"),
    resource_owner_key=os.getenv("ACCESS_TOKEN"),
    resource_owner_secret=os.getenv("TOKEN_SECRET"),
    realm=os.getenv("ACCOUNT_ID"),
    signature_method=oauthlib.oauth1.SIGNATURE_HMAC_SHA256,
)

BASE_URL = f"https://{os.getenv('ACCOUNT_ID')}.restlets.api.netsuite.com/app/site/hosting/restlet.nl"


def request_restlet(restlet: dict, method: str) -> Callable:
    async def request(
        session: aiohttp.ClientSession,
        params: dict,
        body: dict,
    ) -> tuple[Exception | None, dict | None]:
        url, headers, body = OAUTH_CLIENT.sign(
            uri=f"{BASE_URL}?{urlencode({**restlet, **params})}",
            http_method=method,
            body=body,
            headers={
                "Content-type": "application/json",
            },
        )
        try:
            async with session.request(
                method,
                url,
                headers=headers,
            ) as r:
                res = await r.json()
            return None, res
        except Exception as e:
            print(e)
            return e, None

    return request
