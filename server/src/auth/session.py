from base64 import b64decode
import os

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from util.b64_util import b64strEncode

AES_KEY_ENVIRON_URI = "DEMETER_AES_KEY"

def getCipher() -> Cipher:
    return Cipher(algorithms.AES(getAesKey()), modes.ECB, default_backend)

def getAesKey() -> bytes:
    if AES_KEY_ENVIRON_URI in os.environ:
        key = b64strEncode(os.urandom(32))
        os.environ[AES_KEY_ENVIRON_URI] = key
        return key
    return os.environ[AES_KEY_ENVIRON_URI].encode()

def getBearerToken(username:str, password:str, ipv4:str):

    tToken = f"{username}:{password}:{ipv4}"

    padder = padding.PKCS7(128).padder()
    padTToken = padder.update(tToken.encode()) + padder.finalize()

    cipher = getCipher()
    encryptor = cipher.encryptor()
    cToken = encryptor.update(padTToken) + encryptor.finalize()

    return b64strEncode(cToken)

def confirmBearerToken(username:str, password:str, ipv4:str, token:str) -> bool:

    cToken = b64decode(token)

    cipher = getCipher()
    decryptor = cipher.decryptor()
    padTToken = decryptor.update(cToken) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    tToken = (unpadder.update(padTToken) + unpadder.finalize()).decode()

    return f"{username}:{password}:{ipv4}" == tToken
