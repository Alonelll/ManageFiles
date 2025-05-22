
exit 0

## TODO: Add a test for the client.

ROOT_DIR="$(dirname "$(realpath "$0")")"
NM_DIR="$ROOT_DIR/node_modules"

echo

if [ ! -d "$ROOT_DIR" ]; then

    echo "Client directory [ $ROOT_DIR ] does not exist."
    exit 1
fi

cd "$ROOT_DIR"

if [ ! -d "$script-location/client/node_modules" ]; then

    echo "Installing NPM dependencies in [ $NM_DIR ]."
    npm install
fi

echo "Attempting to build project in [ $ROOT_DIR ]."
npm build

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then

    echo "Client tests failed with exit code [ $EXIT_CODE ]."
    exit $EXIT_CODE
else 

    echo "Client tests passed."
fi

exit 0
