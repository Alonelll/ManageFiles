FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY server/pyproject.toml server/uv.lock ./

RUN uv venv .venv

RUN .venv/bin/python -m ensurepip --upgrade
RUN .venv/bin/python -m pip install pip --upgrade
RUN .venv/bin/python -m pip install .

# Kopiere den restlichen Code
COPY server/src ./src
COPY client/public ./public

RUN export PYTHONPATH="/app/src"

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
