
ROOT_DIR="$(dirname "$(realpath "$0")")"
VENV_DIR="$ROOT_DIR/.venv"
TEST_DIR="$ROOT_DIR/src/test"
REQUIREMENTS_FILE="$ROOT_DIR/requirements.txt"

echo

if [ ! -d "$ROOT_DIR" ]; then
    echo "Server directory [ $ROOT_DIR ] does not exist. Exiting..."
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then

    echo "Creating Python virtual environment in [ $VENV_DIR ]."
    python3 -m venv "$VENV_DIR"

    echo "Installing Python dependencies from [ $REQUIREMENTS_FILE ]."
    echo
    cat "$REQUIREMENTS_FILE"
    echo
    "$VENV_DIR/bin/pip3" install -r "$REQUIREMENTS_FILE"
fi

echo "Running Python tests in [ $ROOT_DIR/src/test/ ]."
"$VENV_DIR/bin/python3" -m pytest "$TEST_DIR"

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then

    echo "Server tests failed with exit code [ $EXIT_CODE ]."
    exit $EXIT_CODE
fi

echo "All tests passed. Exiting..."
exit 0
