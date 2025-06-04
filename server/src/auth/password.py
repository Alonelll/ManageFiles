import os
from typing import Final
import hashlib
import base64

HASH_NAME = "sha512"
SALT_BYTES = 16
ITERATIONS = 100_000
DKLEN = 64

def createHash(password:str) -> str:
# Hash a password using pbkdf2 hmac sha512

    saltBytes = os.urandom(SALT_BYTES)

    hashBytes = hashlib.pbkdf2_hmac(
        hash_name = HASH_NAME,
        password = password.encode(),
        salt = saltBytes,
        iterations = ITERATIONS,
        dklen = DKLEN
    )

    salt64 = base64.b64encode(saltBytes).decode()
    hash64 = base64.b64encode(hashBytes).decode()

    return f"{salt64} {hash64}"

def confirmHash(hash:str, password:str) -> bool:
# Confirm a password against a hash

    [salt64, hash64] = hash.split(' ')

    saltBytes = base64.b64decode(salt64)
    hashBytes = base64.b64decode(hash64)

    compareHash = hashlib.pbkdf2_hmac(
        hash_name = HASH_NAME,
        password = password,
        salt = saltBytes,
        iterations = ITERATIONS,
        dklen = DKLEN
    )

    return hashBytes == compareHash


