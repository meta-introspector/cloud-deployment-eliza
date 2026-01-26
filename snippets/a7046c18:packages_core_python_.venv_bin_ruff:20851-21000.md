# a7046c18:packages_core_python_.venv_bin_ruff:20851-21000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20851-21000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

def round_down(number):
    return floor(number)


round_up(1.5)
round_down(1.5)
```

Or, refactor to use an `Enum`:
```python
from enum import Enum


class RoundingMethod(Enum):
    UP = 1
    DOWN = 2


def round_number(value, method):
    return ceil(number) if method is RoundingMethod.UP else floor(number)


round_number(1.5, RoundingMethod.UP)
round_number(1.5, RoundingMethod.DOWN)
```

Or, make the argument a keyword-only argument:
```python
from math import ceil, floor


def round_number(number, *, up=True):
    return ceil(number) if up else floor(number)


round_number(1.5, up=True)
round_number(1.5, up=False)
```

## References
- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)
- [_How to Avoid “The Boolean Trap”_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for boolean positional arguments in function calls.

Some functions are whitelisted by default. To extend the list of allowed calls
configure the [`lint.flake8-boolean-trap.extend-allowed-calls`] option.

## Why is this bad?
Calling a function with boolean positional arguments is confusing as the
meaning of the boolean value is not clear to the caller, and to future
readers of the code.

## Example

```python
def func(flag: bool) -> None: ...


func(True)
```

Use instead:

```python
def func(flag: bool) -> None: ...


func(flag=True)
```

## Options
- `lint.flake8-boolean-trap.extend-allowed-calls`

## References
- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)
- [_How to Avoid “The Boolean Trap”_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)
## What it does
Checks for the attempted use of the unary prefix increment (`++`) or
decrement operator (`--`).

## Why is this bad?
Python does not support the unary prefix increment or decrement operator.
Writing `++n` is equivalent to `+(+(n))` and writing `--n` is equivalent to
`-(-(n))`. In both cases, it is equivalent to `n`.

## Example
```python
++x
--y
```

Use instead:
```python
x += 1
y -= 1
```

## References
- [Python documentation: Unary arithmetic and bitwise operations](https://docs.python.org/3/reference/expressions.html#unary-arithmetic-and-bitwise-operations)
- [Python documentation: Augmented assignment statements](https://docs.python.org/3/reference/simple_stmts.html#augmented-assignment-statements)
## What it does
Checks for assignments to `os.environ`.

## Why is this bad?
In Python, `os.environ` is a mapping that represents the environment of the
current process.

However, reassigning to `os.environ` does not clear the environment. Instead,
it merely updates the `os.environ` for the current process. This can lead to
unexpected behavior, especially when running the program in a subprocess.

Instead, use `os.environ.clear()` to clear the environment, or use the
`env` argument of `subprocess.Popen` to pass a custom environment to
a subprocess.

## Example
```python
import os

os.environ = {"foo": "bar"}
```

Use instead:
```python
import os

os.environ.clear()
os.environ["foo"] = "bar"
```

## References
- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)
- [Python documentation: `subprocess.Popen`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)
## What it does
Checks for uses of `hasattr` to test if an object is callable (e.g.,
`hasattr(obj, "__call__")`).

## Why is this bad?
Using `hasattr` is an unreliable mechanism for testing if an object is
callable. If `obj` implements a custom `__getattr__`, or if its `__call__`
is itself not callable, you may get misleading results.

Instead, use `callable(obj)` to test if `obj` is callable.

## Example
```python
```