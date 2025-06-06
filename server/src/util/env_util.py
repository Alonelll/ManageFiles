
import os


def env(name:str) -> str:
    try:
        return os.environ[name]
    except KeyError:
        raise EnvironmentError(f"The environment Variabel '{name}' has not been configured. Did you forget to rebuild the container?")
