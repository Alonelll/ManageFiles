
import dis
import shutil

class Format:
    class Color:
        PURPLE = '\033[95m'
        CYAN = '\033[96m'
        DARKCYAN = '\033[36m'
        BLUE = '\033[94m'
        GREEN = '\033[92m'
        YELLOW = '\033[93m'
        RED = '\033[91m'

    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def shellSeparator(sign:str = '-') -> str:
# Creates a separator the width of the terminal.
    return str(sign) * shutil.get_terminal_size.columns

def getProjectedStackTrace(fn:callable):
# Get the expected stack trace of a function
    trace = []
    bytecode = dis.Bytecode(fn)
    instructions = list(reversed([instr for instr in bytecode]))

    for (ix, instr) in enumerate(instructions):

        if instr.opname == "CALL_FUNCTION":
            loadCallInstruction = trace[ix + instr.arg + 1]
            trace.append(loadCallInstruction.argval)

    return [f"{ix}. {callName}" for (ix, callName) in enumerate(reversed(trace), 1)]

    