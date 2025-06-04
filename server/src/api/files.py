from fastapi import Path, Request
from .router import apiRouter

@apiRouter.get('/files/{filepath:path}')
async def fileGet(request:Request, filepath:str = Path(...)):
    return {"path": filepath}
