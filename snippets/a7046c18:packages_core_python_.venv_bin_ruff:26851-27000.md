# a7046c18:packages_core_python_.venv_bin_ruff:26851-27000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26851-27000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```
## What it does
Checks for functions in stub (`.pyi`) files that contain multiple
statements.

## Why is this bad?
Stub files are never executed, and are only intended to define type hints.
As such, functions in stub files should not contain functional code, and
should instead contain only a single statement (e.g., `...`).

## Example

```pyi
def function():
    x = 1
    y = 2
    return x + y
```

Use instead:

```pyi
def function(): ...
```
## What it does
Checks for the presence of unused private `typing.TypedDict` definitions.

## Why is this bad?
A private `typing.TypedDict` that is defined but not used is likely a
mistake. It should either be used, made public, or removed to avoid
confusion.

## Example

```pyi
import typing

class _UnusedPrivateTypedDict(typing.TypedDict):
    foo: list[int]
```

Use instead:

```pyi
import typing

class _UsedPrivateTypedDict(typing.TypedDict):
    foo: set[str]

def func(arg: _UsedPrivateTypedDict) -> _UsedPrivateTypedDict: ...
```
## What it does
Checks for uses of `typing.NoReturn` (and `typing_extensions.NoReturn`) for
parameter annotations.

## Why is this bad?
Prefer `Never` over `NoReturn` for parameter annotations. `Never` has a
clearer name in these contexts, since it makes little sense to talk about a
parameter annotation "not returning".

This is a purely stylistic lint: the two types have identical semantics for
type checkers. Both represent Python's "[bottom type]" (a type that has no
members).

## Example
```pyi
from typing import NoReturn

def foo(x: NoReturn): ...
```

Use instead:
```pyi
from typing import Never

def foo(x: Never): ...
```

## References
- [Python documentation: `typing.Never`](https://docs.python.org/3/library/typing.html#typing.Never)
- [Python documentation: `typing.NoReturn`](https://docs.python.org/3/library/typing.html#typing.NoReturn)

[bottom type]: https://en.wikipedia.org/wiki/Bottom_type
## What it does
Checks for redundant unions between a `Literal` and a builtin supertype of
that `Literal`.

## Why is this bad?
Using a `Literal` type in a union with its builtin supertype is redundant,
as the supertype will be strictly more general than the `Literal` type.
For example, `Literal["A"] | str` is equivalent to `str`, and
`Literal[1] | int` is equivalent to `int`, as `str` and `int` are the
supertypes of `"A"` and `1` respectively.

## Example
```pyi
from typing import Literal

x: Literal["A", b"B"] | str
```

Use instead:
```pyi
from typing import Literal

x: Literal[b"B"] | str
```
## What it does
Checks for unannotated assignments in stub (`.pyi`) files.

## Why is this bad?
Stub files exist to provide type hints, and are never executed. As such,
all assignments in stub files should be annotated with a type.
## What it does
Checks for the use of string and bytes literals longer than 50 characters
in stub (`.pyi`) files.

## Why is this bad?
If a function or variable has a default value where the string or bytes
representation is greater than 50 characters long, it is likely to be an
implementation detail or a constant that varies depending on the system
you're running on.

Although IDEs may find them useful, default values are ignored by type
checkers, the primary consumers of stub files. Replace very long constants
with ellipses (`...`) to simplify the stub.

## Example

```pyi
def foo(arg: str = "51 character stringgggggggggggggggggggggggggggggggg") -> None: ...
```

Use instead:

```pyi
def foo(arg: str = ...) -> None: ...
```
## What it does
Checks for numeric literals with a string representation longer than ten
characters.

## Why is this bad?
If a function has a default value where the literal representation is
greater than 10 characters, the value is likely to be an implementation
detail or a constant that varies depending on the system you're running on.

Default values like these should generally be omitted from stubs. Use
ellipses (`...`) instead.

```