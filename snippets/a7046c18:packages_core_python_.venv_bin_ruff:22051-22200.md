# a7046c18:packages_core_python_.venv_bin_ruff:22051-22200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22051-22200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Instead, prefer to use immutable data structures. Alternatively, take
`None` as a default, and initialize a new mutable object inside for each
call using the `.set()` method.

Types outside the standard library can be marked as immutable with the
[`lint.flake8-bugbear.extend-immutable-calls`] configuration option.

## Example
```python
from contextvars import ContextVar


cv: ContextVar[list] = ContextVar("cv", default=[])
```

Use instead:
```python
from contextvars import ContextVar


cv: ContextVar[list | None] = ContextVar("cv", default=None)

...

if cv.get() is None:
    cv.set([])
```

## Options
- `lint.flake8-bugbear.extend-immutable-calls`

## References
- [Python documentation: `contextvars` — Context Variables](https://docs.python.org/3/library/contextvars.html)
## What it does
Checks for `return {value}` statements in functions that also contain `yield`
or `yield from` statements.

## Why is this bad?
Using `return {value}` in a generator function was syntactically invalid in
Python 2. In Python 3 `return {value}` _can_ be used in a generator; however,
the combination of `yield` and `return` can lead to confusing behavior, as
the `return` statement will cause the generator to raise `StopIteration`
with the value provided, rather than returning the value to the caller.

For example, given:
```python
from collections.abc import Iterable
from pathlib import Path


def get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:
    dir_path = Path(".")
    if file_types is None:
        return dir_path.glob("*")

    for file_type in file_types:
        yield from dir_path.glob(f"*.{file_type}")
```

Readers might assume that `get_file_paths()` would return an iterable of
`Path` objects in the directory; in reality, though, `list(get_file_paths())`
evaluates to `[]`, since the `return` statement causes the generator to raise
`StopIteration` with the value `dir_path.glob("*")`:

```shell
>>> list(get_file_paths(file_types=["cfg", "toml"]))
[PosixPath('setup.cfg'), PosixPath('pyproject.toml')]
>>> list(get_file_paths())
[]
```

For intentional uses of `return` in a generator, consider suppressing this
diagnostic.

## Example
```python
from collections.abc import Iterable
from pathlib import Path


def get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:
    dir_path = Path(".")
    if file_types is None:
        return dir_path.glob("*")

    for file_type in file_types:
        yield from dir_path.glob(f"*.{file_type}")
```

Use instead:

```python
from collections.abc import Iterable
from pathlib import Path


def get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:
    dir_path = Path(".")
    if file_types is None:
        yield from dir_path.glob("*")
    else:
        for file_type in file_types:
            yield from dir_path.glob(f"*.{file_type}")
```
## What it does
Checks for classes that only have a public `__init__` method,
without base classes and decorators.

## Why is this bad?
Classes with just an `__init__` are possibly better off
being a dataclass or a namedtuple, which have less boilerplate.

## Example
```python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

Use instead:
```python
from dataclasses import dataclass


@dataclass
class Point:
    x: float
    y: float
```
## What it does
Checks for `raise` statements in exception handlers that lack a `from`
clause.

## Why is this bad?
In Python, `raise` can be used with or without an exception from which the
current exception is derived. This is known as exception chaining. When
printing the stack trace, chained exceptions are displayed in such a way
so as make it easier to trace the exception back to its root cause.

When raising an exception from within an `except` clause, always include a
`from` clause to facilitate exception chaining. If the exception is not
chained, it will be difficult to trace the exception back to its root cause.

## Example
```python
try:
    ...
except FileNotFoundError:
    if ...:
```