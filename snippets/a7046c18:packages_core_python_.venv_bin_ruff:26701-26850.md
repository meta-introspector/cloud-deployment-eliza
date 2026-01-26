# a7046c18:packages_core_python_.venv_bin_ruff:26701-26850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26701-26850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for private type alias definitions suffixed with 'T'.

## Why is this bad?
It's conventional to use the 'T' suffix for type variables; the use of
such a suffix implies that the object is a `TypeVar`.

Adding the 'T' suffix to a non-`TypeVar`, it can be misleading and should
be avoided.

## Example
```pyi
from typing import TypeAlias

_MyTypeT: TypeAlias = int
```

Use instead:
```pyi
from typing import TypeAlias

_MyType: TypeAlias = int
```

## References
- [PEP 484: Type Aliases](https://peps.python.org/pep-0484/#type-aliases)
## What it does
Checks for the presence of the `from __future__ import annotations` import
statement in stub files.

## Why is this bad?
Stub files natively support forward references in all contexts, as stubs are
never executed at runtime. (They should be thought of as "data files" for
type checkers.) As such, the `from __future__ import annotations` import
statement has no effect and should be omitted.

## References
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#language-features)
## What it does
Checks for `__iter__` methods in stubs that return `Iterable[T]` instead
of an `Iterator[T]`.

## Why is this bad?
`__iter__` methods should always should return an `Iterator` of some kind,
not an `Iterable`.

In Python, an `Iterable` is an object that has an `__iter__` method; an
`Iterator` is an object that has `__iter__` and `__next__` methods. All
`__iter__` methods are expected to return `Iterator`s. Type checkers may
not always recognize an object as being iterable if its `__iter__` method
does not return an `Iterator`.

Every `Iterator` is an `Iterable`, but not every `Iterable` is an `Iterator`.
For example, `list` is an `Iterable`, but not an `Iterator`; you can obtain
an iterator over a list's elements by passing the list to `iter()`:

```pycon
>>> import collections.abc
>>> x = [42]
>>> isinstance(x, collections.abc.Iterable)
True
>>> isinstance(x, collections.abc.Iterator)
False
>>> next(x)
Traceback (most recent call last):
 File "<stdin>", line 1, in <module>
TypeError: 'list' object is not an iterator
>>> y = iter(x)
>>> isinstance(y, collections.abc.Iterable)
True
>>> isinstance(y, collections.abc.Iterator)
True
>>> next(y)
42
```

Using `Iterable` rather than `Iterator` as a return type for an `__iter__`
methods would imply that you would not necessarily be able to call `next()`
on the returned object, violating the expectations of the interface.

## Example

```python
import collections.abc


class Klass:
    def __iter__(self) -> collections.abc.Iterable[str]: ...
```

Use instead:

```python
import collections.abc


class Klass:
    def __iter__(self) -> collections.abc.Iterator[str]: ...
```
## What it does
Checks for the presence of unused private `typing.Protocol` definitions.

## Why is this bad?
A private `typing.Protocol` that is defined but not used is likely a
mistake. It should either be used, made public, or removed to avoid
confusion.

## Example

```pyi
import typing

class _PrivateProtocol(typing.Protocol):
    foo: int
```

Use instead:

```pyi
import typing

class _PrivateProtocol(typing.Protocol):
    foo: int

def func(arg: _PrivateProtocol) -> None: ...
```
## What it does
Checks for the presence of unused private type aliases.

## Why is this bad?
A private type alias that is defined but not used is likely a
mistake. It should either be used, made public, or removed to avoid
confusion.

## Example

```pyi
import typing

_UnusedTypeAlias: typing.TypeAlias = int
```

Use instead:

```pyi
import typing

_UsedTypeAlias: typing.TypeAlias = int

def func(arg: _UsedTypeAlias) -> _UsedTypeAlias: ...
```