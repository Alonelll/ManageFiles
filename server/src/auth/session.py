import os
from util.b64_util import b64strEncode

AES_KEY_ENVIRON_URI = "DEMETER_AES_KEY"

def getAesKey():
    if AES_KEY_ENVIRON_URI in os.environ:
        key = b64strEncode(os.urandom(32))
        os.environ[AES_KEY_ENVIRON_URI] = key
        return key
    return os.environ[AES_KEY_ENVIRON_URI]
