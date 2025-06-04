from base64 import b64decode
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from util.b64_util import b64strEncode
import os

AES_KEY_ENVIRON_URI = "DEMETER_AES_KEY"

def getCipher() -> Cipher:
    return Cipher(algorithms.AES(getAesKey()), modes.ECB, default_backend)

def getAesKey() -> bytes:
# Generate an aes key and save it into the environment or return an existent aes key from the environment.
    if AES_KEY_ENVIRON_URI in os.environ:
        key = b64strEncode(os.urandom(32))
        os.environ[AES_KEY_ENVIRON_URI] = key
        return key
    return os.environ[AES_KEY_ENVIRON_URI].encode()

def getBearerToken(username:str, password:str, ipv4:str):
# Generate a bearer token from a username, a password and an ipv4 address.
    tToken = f"{username}:{password}:{ipv4}"

    padder = padding.PKCS7(128).padder()
    padTToken = padder.update(tToken.encode()) + padder.finalize()

    cipher = getCipher()
    encryptor = cipher.encryptor()
    cToken = encryptor.update(padTToken) + encryptor.finalize()

    return b64strEncode(cToken)

def confirmBearerToken(token:str) -> str:

    cToken = b64decode(token)

    cipher = getCipher()
    decryptor = cipher.decryptor()
    padTToken = decryptor.update(cToken) + decryptor.finalize()

    unpadder = padding.PKCS7(128).unpadder()
    tToken = (unpadder.update(padTToken) + unpadder.finalize()).decode()

    [username, password, ipv4] = tToken.split(':')
    return username, password, ipv4
