
from fastapi import Header, Request, Response, HTTPException
from fastapi.responses import JSONResponse

from auth.session import getBearerToken
from db.ConnectDbRoot import ConnectDbRoot
from util.b64_util import b64utf8Decode
from auth.password import confirmHash
from . import apiRouter

@apiRouter.get('/login')
async def login(request:Request):

    authorization = request.headers.get('Authorization')
    xForwarded = request.headers.get('x-forwarded-for')

    ipv4 = xForwarded.split(',')[0].strip() if xForwarded else request.client.host

    if authorization is None:
        raise HTTPException(
            status_code = 403,
            detail = "Authorization header is missing."
        )
    
    [format, token] = authorization.split(' ')

    if format != "Basic":
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic auth required."
        )
    
    if token is None:
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic token has improper formatting."
        )
    
    username, password = None, None
    
    try:
        decoded = b64utf8Decode(authorization)
        [username, password] = decoded.split(':')
    except:
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic token has improper formatting."
        )
    
    conn = ConnectDbRoot()
    user = conn.select("users", ["name", "secret"], {"name": username})[0]
    del conn

    if not confirmHash(user['secret'], password):
        raise HTTPException(
            status_code = 401,
            detail = "Invalid credentials"
        )
    
    return {
        "access_token": getBearerToken(username, password, ipv4),
        "token_type": "bearer"
    }
