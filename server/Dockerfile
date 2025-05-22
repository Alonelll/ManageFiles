FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv venv
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Kopiere den restlichen Code
COPY ../src ./src

# Starte den Server
# CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
