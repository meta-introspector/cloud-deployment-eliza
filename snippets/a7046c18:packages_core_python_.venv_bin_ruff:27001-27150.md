# a7046c18:packages_core_python_.venv_bin_ruff:27001-27150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27001-27150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Example

```pyi
def foo(arg: int = 693568516352839939918568862861217771399698285293568) -> None: ...
```

Use instead:

```pyi
def foo(arg: int = ...) -> None: ...
```
## What it does
Checks for the presence of multiple `type`s in a union.

## Why is this bad?
`type[T | S]` has identical semantics to `type[T] | type[S]` in a type
annotation, but is cleaner and more concise.

## Example
```pyi
field: type[int] | type[float] | str
```

Use instead:
```pyi
field: type[int | float] | str
```

## Fix safety
This rule's fix is marked as safe, unless the type annotation contains comments.

Note that while the fix may flatten nested unions into a single top-level union,
the semantics of the annotation will remain unchanged.
## What it does
Checks that `append`, `extend` and `remove` methods are not called on
`__all__`.

## Why is this bad?
Different type checkers have varying levels of support for calling these
methods on `__all__`. Instead, use the `+=` operator to add items to
`__all__`, which is known to be supported by all major type checkers.

## Example
```pyi
import sys

__all__ = ["A", "B"]

if sys.version_info >= (3, 10):
    __all__.append("C")

if sys.version_info >= (3, 11):
    __all__.remove("B")
```

Use instead:
```pyi
import sys

__all__ = ["A"]

if sys.version_info < (3, 11):
    __all__ += ["B"]

if sys.version_info >= (3, 10):
    __all__ += ["C"]
```
## What it does
Checks for uses of `typing.ByteString` or `collections.abc.ByteString`.

## Why is this bad?
`ByteString` has been deprecated since Python 3.9 and will be removed in
Python 3.17. The Python documentation recommends using either
`collections.abc.Buffer` (or the `typing_extensions` backport
on Python <3.12) or a union like `bytes | bytearray | memoryview` instead.

## Example
```python
from typing import ByteString
```

Use instead:
```python
from collections.abc import Buffer
```

## References
- [Python documentation: The `ByteString` type](https://docs.python.org/3/library/typing.html#typing.ByteString)
## What it does
Checks for simple `__iter__` methods that return `Generator`, and for
simple `__aiter__` methods that return `AsyncGenerator`.

## Why is this bad?
Using `(Async)Iterator` for these methods is simpler and more elegant. More
importantly, it also reflects the fact that the precise kind of iterator
returned from an `__iter__` method is usually an implementation detail that
could change at any time. Type annotations help define a contract for a
function; implementation details should not leak into that contract.

For example:
```python
from collections.abc import AsyncGenerator, Generator
from typing import Any


class CustomIterator:
    def __iter__(self) -> Generator:
        yield from range(42)


class CustomIterator2:
    def __iter__(self) -> Generator[str, Any, None]:
        yield from "abcdefg"
```

Use instead:
```python
from collections.abc import Iterator


class CustomIterator:
    def __iter__(self) -> Iterator:
        yield from range(42)


class CustomIterator2:
    def __iter__(self) -> Iterator[str]:
        yield from "abdefg"
```

## Fix safety
This rule tries hard to avoid false-positive errors, and the rule's fix
should always be safe for `.pyi` stub files. However, there is a slightly
higher chance that a false positive might be emitted by this rule when
applied to runtime Python (`.py` files). As such, the fix is marked as
unsafe for any `__iter__` or `__aiter__` method in a `.py` file that has
more than two statements (including docstrings) in its body.
## What it does
Checks for classes inheriting from `typing.Generic[]` where `Generic[]` is
not the last base class in the bases tuple.

## Why is this bad?
If `Generic[]` is not the final class in the bases tuple, unexpected
behaviour can occur at runtime (See [this CPython issue][1] for an example).

The rule is also applied to stub files, where it won't cause issues at
runtime. This is because type checkers may not be able to infer an
accurate [MRO] for the class, which could lead to unexpected or
inaccurate results when they analyze your code.

```