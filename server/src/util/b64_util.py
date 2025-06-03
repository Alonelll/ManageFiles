import base64

def b64strEncode(inp:bytes) -> str:
    return base64.b64encode(inp).decode()

