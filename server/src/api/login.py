from .router import apiRouter
from auth.password import confirmHash
from auth.session import getBearerToken
from db import ConnectDb
from fastapi import Request, HTTPException, Response
from util.b64_util import b64utf8Decode

@apiRouter.get('/login')
async def login(request:Request, response:Response):
# pseudo auth endpoints that just sets a username cookie bc I dont really give a shit

    authorization = request.headers.get('Authorization')
    print(authorization)
    conn = ConnectDb()
    conn.execute("INSERT INTO Users (name, secret) VALUES (?, 'TEST')", authorization)
    conn.commit()
    response.set_cookie(key="username", value=authorization)


async def _login(request:Request):

    authorization = request.headers.get('Authorization')
    xForwarded = request.headers.get('x-forwarded-for')

    ipv4 = xForwarded.split(',')[0].strip() if xForwarded else request.client.host

    if authorization is None:
        raise HTTPException(
            status_code = 403,
            detail = "Authorization header is missing."
        )
    
    auth_partial = authorization.split(' ')

    if len(auth_partial) != 2:
        raise HTTPException(
            status_code=400,
            detail="Authorization header has incorrect format."
        )
    
    [format, token] = auth_partial

    if format != "Basic":
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic auth required."
        )
    
    print(token)
    
    if token is None:
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic token has improper formatting."
        )
    
    username, password = None, None
    
    try:
        decoded = b64utf8Decode(authorization)
        [username, password] = decoded.split(':')
    except Exception as e:
        raise HTTPException(
            status_code = 403,
            detail = "HTTP Basic token has improper formatting."
        )
    
    conn = ConnectDb()
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
