
ROOT_DIR="$(dirname "$(realpath "$0")")"
VENV_DIR="$ROOT_DIR/.venv"
SRC_DIR="$ROOT_DIR/src"
TEST_DIR="$ROOT_DIR/src/test"
PYBIN="$VENV_DIR/bin/python"

export PYTHONPATH="$SRC_DIR"

cd $ROOT_DIR

curl -sSf https://astral.sh/uv/install.sh | sh # uv

echo

if [ ! -d "$ROOT_DIR" ]; then
    echo "Server directory [ $ROOT_DIR ] does not exist. Exiting..."
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating Python virtual environment in [ $VENV_DIR ]."
    ./mkvenv.sh
fi

echo "Running Python tests in [ $ROOT_DIR/src/test/ ]."

"$PYBIN" -m pytest "$TEST_DIR"

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "Server tests failed with exit code [ $EXIT_CODE ]."
    exit $EXIT_CODE
fi

echo "All tests passed. Exiting..."
exit 0
