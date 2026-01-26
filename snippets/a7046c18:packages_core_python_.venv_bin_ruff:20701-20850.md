# a7046c18:packages_core_python_.venv_bin_ruff:20701-20850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20701-20850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Exceptions that are logged via `logging.exception()` or are logged via
`logging.error()` or `logging.critical()` with `exc_info` enabled will
_not_ be flagged, as this is a common pattern for propagating exception
traces:
```python
try:
    foo()
except BaseException:
    logging.exception("Something went wrong")
```

## Options

- `lint.logger-objects`

## References
- [Python documentation: The `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)
- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)
- [PEP 8: Programming Recommendations on bare `except`](https://peps.python.org/pep-0008/#programming-recommendations)
## What it does
Checks for the use of boolean positional arguments in function definitions,
as determined by the presence of a type hint containing `bool` as an
evident subtype - e.g. `bool`, `bool | int`, `typing.Optional[bool]`, etc.

## Why is this bad?
Calling a function with boolean positional arguments is confusing as the
meaning of the boolean value is not clear to the caller and to future
readers of the code.

The use of a boolean will also limit the function to only two possible
behaviors, which makes the function difficult to extend in the future.

Instead, consider refactoring into separate implementations for the
`True` and `False` cases, using an `Enum`, or making the argument a
keyword-only argument, to force callers to be explicit when providing
the argument.

Dunder methods that define operators are exempt from this rule, as are
setters and [`@override`][override] definitions.

## Example

```python
from math import ceil, floor


def round_number(number: float, up: bool) -> int:
    return ceil(number) if up else floor(number)


round_number(1.5, True)  # What does `True` mean?
round_number(1.5, False)  # What does `False` mean?
```

Instead, refactor into separate implementations:

```python
from math import ceil, floor


def round_up(number: float) -> int:
    return ceil(number)


def round_down(number: float) -> int:
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


def round_number(value: float, method: RoundingMethod) -> float: ...
```

Or, make the argument a keyword-only argument:

```python
from math import ceil, floor


def round_number(number: float, *, up: bool) -> int:
    return ceil(number) if up else floor(number)


round_number(1.5, up=True)
round_number(1.5, up=False)
```

## References
- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)
- [_How to Avoid “The Boolean Trap”_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for the use of boolean positional arguments in function definitions,
as determined by the presence of a boolean default value.

## Why is this bad?
Calling a function with boolean positional arguments is confusing as the
meaning of the boolean value is not clear to the caller and to future
readers of the code.

The use of a boolean will also limit the function to only two possible
behaviors, which makes the function difficult to extend in the future.

Instead, consider refactoring into separate implementations for the
`True` and `False` cases, using an `Enum`, or making the argument a
keyword-only argument, to force callers to be explicit when providing
the argument.

This rule exempts methods decorated with [`@typing.override`][override],
since changing the signature of a subclass method that overrides a
superclass method may cause type checkers to complain about a violation of
the Liskov Substitution Principle.

## Example
```python
from math import ceil, floor


def round_number(number, up=True):
    return ceil(number) if up else floor(number)


round_number(1.5, True)  # What does `True` mean?
round_number(1.5, False)  # What does `False` mean?
```

Instead, refactor into separate implementations:
```python
from math import ceil, floor


def round_up(number):
    return ceil(number)

```