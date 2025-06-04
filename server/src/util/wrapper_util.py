import inspect
from errors import UsageError

def wrapper(target:callable) -> callable:
    """This wrapper defines a function to only be used as a wrapping function."""
    def _inner(*args, **kwargs):

        # Raises an error if the function is not used as a wrapper
        if (not inspect.stack()[1].code_context[0].strip().startswith("@")):
            raise UsageError(f"The function {target.__name__} can only be used as a wrapper function.")
        
        return target(*args, **kwargs)
    
    return _inner
