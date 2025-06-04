FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

ENV DEBIAN_FRONTEND noninteractive
ENV PYTHONPATH /app/src
ENV PUBLICPATH /app/public
ENV INDEXPATH /app/public/index.html
ENV FILEMOUNT = /mnt

RUN apt-get update
RUN apt-get install -y libmariadb-dev gcc python3-dev 
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./server/pyproject.toml ./server/uv.lock ./

RUN uv venv .venv

RUN .venv/bin/python -m ensurepip --upgrade
RUN .venv/bin/python -m pip install pip --upgrade
RUN .venv/bin/python -m pip install .

COPY ./server/src /app/src
COPY ./client/public /app/public

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
