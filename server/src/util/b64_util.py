import base64

def b64strEncode(inp:bytes) -> str:
    return base64.b64encode(inp).decode()

def b64utf8Decode(inp:str) -> str:
    return base64.b64decode(inp).decode('utf-8')
