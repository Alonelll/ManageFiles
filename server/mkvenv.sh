
uv venv .venv

.venv/bin/python -m ensurepip --upgrade
.venv/bin/python -m pip install pip --upgrade
.venv/bin/python -m pip install .
