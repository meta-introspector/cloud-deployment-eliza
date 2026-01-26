# a7046c18:packages_core_python_.venv_bin_ruff:44101-44250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44101-44250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
The `type` keyword was introduced in Python 3.12 by [PEP 695] for defining
type aliases. The `type` keyword is easier to read and provides cleaner
support for generics.

## Known problems
[PEP 695] uses inferred variance for type parameters, instead of the
`covariant` and `contravariant` keywords used by `TypeVar` variables. As
such, rewriting a type alias using a PEP-695 `type` statement may change
the variance of the alias's type parameters.

Unlike type aliases that use simple assignments, definitions created using
[PEP 695] `type` statements cannot be used as drop-in replacements at
runtime for the value on the right-hand side of the statement. This means
that while for some simple old-style type aliases you can use them as the
second argument to an `isinstance()` call (for example), doing the same
with a [PEP 695] `type` statement will always raise `TypeError` at
runtime.

## Example
```python
from typing import Annotated, TypeAlias, TypeAliasType
from annotated_types import Gt

ListOfInt: TypeAlias = list[int]
PositiveInt = TypeAliasType("PositiveInt", Annotated[int, Gt(0)])
```

Use instead:
```python
from typing import Annotated
from annotated_types import Gt

type ListOfInt = list[int]
type PositiveInt = Annotated[int, Gt(0)]
```

## Fix safety

This fix is marked unsafe for `TypeAlias` assignments outside of stub files because of the
runtime behavior around `isinstance()` calls noted above. The fix is also unsafe for
`TypeAliasType` assignments if there are any comments in the replacement range that would be
deleted.

## See also

This rule only applies to `TypeAlias`es and `TypeAliasType`s. See
[`non-pep695-generic-class`][UP046] and [`non-pep695-generic-function`][UP047] for similar
transformations for generic classes and functions.

This rule replaces standalone type variables in aliases but doesn't remove the corresponding
type variables even if they are unused after the fix. See [`unused-private-type-var`][PYI018]
for a rule to clean up unused private type variables.

This rule will not rename private type variables to remove leading underscores, even though the
new type parameters are restricted in scope to their associated aliases. See
[`private-type-parameter`][UP049] for a rule to update these names.

## Options

- `target-version`

[PEP 695]: https://peps.python.org/pep-0695/
[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/
[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class/
[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function/
[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/
## What it does
Checks for uses of exceptions that alias `TimeoutError`.

## Why is this bad?
`TimeoutError` is the builtin error type used for exceptions when a system
function timed out at the system level.

In Python 3.10, `socket.timeout` was aliased to `TimeoutError`. In Python
3.11, `asyncio.TimeoutError` was aliased to `TimeoutError`.

These aliases remain in place for compatibility with older versions of
Python, but may be removed in future versions.

Prefer using `TimeoutError` directly, as it is more idiomatic and future-proof.

## Example
```python
import asyncio

raise asyncio.TimeoutError
```

Use instead:
```python
raise TimeoutError
```

## References
- [Python documentation: `TimeoutError`](https://docs.python.org/3/library/exceptions.html#TimeoutError)
## What it does
Checks for classes that inherit from both `str` and `enum.Enum`.

## Why is this bad?
Python 3.11 introduced `enum.StrEnum`, which is preferred over inheriting
from both `str` and `enum.Enum`.

## Example

```python
import enum


class Foo(str, enum.Enum): ...
```

Use instead:

```python
import enum


class Foo(enum.StrEnum): ...
```

## Fix safety

Python 3.11 introduced a [breaking change] for enums that inherit from both
`str` and `enum.Enum`. Consider the following enum:

```python
from enum import Enum


class Foo(str, Enum):
    BAR = "bar"
```

In Python 3.11, the formatted representation of `Foo.BAR` changed as
follows:

```python
# Python 3.10
f"{Foo.BAR}"  # > bar
# Python 3.11
f"{Foo.BAR}"  # > Foo.BAR
```

Migrating from `str` and `enum.Enum` to `enum.StrEnum` will restore the
previous behavior, such that:

```python
from enum import StrEnum


```