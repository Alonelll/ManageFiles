import json
from pathlib import Path
from typing import Annotated

from fastapi.responses import PlainTextResponse
from .shared import dir_id_resolve, get_filepath_args, get_file
from fastapi import Cookie, HTTPException, Request
from api.router import apiRouter
from db.ConnectDb import ConnectDb
from errors.PathError import PathError
from pydantic import BaseModel

class CommentBody(BaseModel):
    content:str

@apiRouter.get("/comments/{path:path}")
async def comments_get(path:str):

    dirpath, filename, mountpath = get_filepath_args(path)

    # Get all comments and usernames from db
    conn = ConnectDb()
    dir_id = dir_id_resolve(conn, dirpath)
    file_id = get_file(conn, dir_id, filename, "id")
    comment_info = conn.query("SELECT Users.name, Comments.content FROM Comments INNER JOIN Users ON Comments.user_id=Users.id WHERE Comments.file_id=?", file_id)

    # turn db results into json format
    def _():
        for _comment_info in comment_info:
            yield {
                "user": _comment_info[0],
                "content": _comment_info[1]
            }

    return json.dumps(list(_()))

    
@apiRouter.post("/comments/{path:path}")
async def comments_post(request:Request, path:str, username:Annotated[str|None, Cookie()] = None):

    body = await request.json()
    content = body["content"]
    dirpath, filename, mountpath = get_filepath_args(path)
    
    conn = ConnectDb()
    dir_id = dir_id_resolve(conn ,dirpath)
    file_id = get_file(conn, dir_id, filename, "id")

    user_id = conn.query("SELECT id FROM Users WHERE Users.name=?", str(username))[0][0]
    conn.execute("INSERT INTO Comments (user_id, file_id, content) VALUES (?, ?, ?)", user_id, file_id, content)
    conn.commit()

    return PlainTextResponse("Successfully posted comment.")
