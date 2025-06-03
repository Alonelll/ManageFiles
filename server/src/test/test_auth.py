import pytest
import auth
import auth.password

def test_passwordCorrect():
    psw = "abc123"
    pswHash = auth.password.createHash(psw)
    assert auth.password.confirmHash(pswHash, psw)

def test_passwordIncorrect():
    psw = "abc123"
    pswHash = auth.password.createHash(psw)
    assert not auth.password.confirmHash(pswHash, "def456")
