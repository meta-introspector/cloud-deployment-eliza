# a7046c18:packages_core_python_.venv_bin_ruff:46201-46350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46201-46350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
from typing import ClassVar


class A:
    variable_1: ClassVar[list[int]] = []
    variable_2: ClassVar[set[int]] = set()
    variable_3: ClassVar[dict[str, int]] = {}
```

Or:

```python
class A:
    variable_1: list[int] | None = None
    variable_2: set[int] | None = None
    variable_3: dict[str, int] | None = None
```

Or:

```python
from collections.abc import Sequence, Mapping, Set as AbstractSet
from types import MappingProxyType


class A:
    variable_1: Sequence[int] = ()
    variable_2: AbstractSet[int] = frozenset()
    variable_3: Mapping[str, int] = MappingProxyType({})
```

[ClassVar]: https://docs.python.org/3/library/typing.html#typing.ClassVar
## What it does
Checks for the use of implicit `Optional` in type annotations when the
default parameter value is `None`.

If [`lint.future-annotations`] is set to `true`, `from __future__ import
annotations` will be added if doing so would allow using the `|` operator on
a Python version before 3.10.

## Why is this bad?
Implicit `Optional` is prohibited by [PEP 484]. It is confusing and
inconsistent with the rest of the type system.

It's recommended to use `Optional[T]` instead. For Python 3.10 and later,
you can also use `T | None`.

## Example
```python
def foo(arg: int = None):
    pass
```

Use instead:
```python
from typing import Optional


def foo(arg: Optional[int] = None):
    pass
```

Or, for Python 3.10 and later:
```python
def foo(arg: int | None = None):
    pass
```

If you want to use the `|` operator in Python 3.9 and earlier, you can
use future imports:
```python
from __future__ import annotations


def foo(arg: int | None = None):
    pass
```

## Limitations

Type aliases are not supported and could result in false negatives.
For example, the following code will not be flagged:
```python
Text = str | bytes


def foo(arg: Text = None):
    pass
```

## Options
- `target-version`
- `lint.future-annotations`

## Fix safety

This fix is always marked as unsafe because it can change the behavior of code that relies on
type hints, and it assumes the default value is always appropriate—which might not be the case.

[PEP 484]: https://peps.python.org/pep-0484/#union-types
## What it does
Checks the following constructs, all of which can be replaced by
`next(iter(...))`:

- `list(...)[0]`
- `tuple(...)[0]`
- `list(i for i in ...)[0]`
- `[i for i in ...][0]`
- `list(...).pop(0)`

## Why is this bad?
Calling e.g. `list(...)` will create a new list of the entire collection,
which can be very expensive for large collections. If you only need the
first element of the collection, you can use `next(...)` or
`next(iter(...)` to lazily fetch the first element. The same is true for
the other constructs.

## Example
```python
head = list(x)[0]
head = [x * x for x in range(10)][0]
```

Use instead:
```python
head = next(iter(x))
head = next(x * x for x in range(10))
```

## Fix safety
This rule's fix is marked as unsafe, as migrating from (e.g.) `list(...)[0]`
to `next(iter(...))` can change the behavior of your program in two ways:

1. First, all above-mentioned constructs will eagerly evaluate the entire
   collection, while `next(iter(...))` will only evaluate the first
   element. As such, any side effects that occur during iteration will be
   delayed.
2. Second, accessing members of a collection via square bracket notation
   `[0]` or the `pop()` function will raise `IndexError` if the collection
   is empty, while `next(iter(...))` will raise `StopIteration`.

## References
- [Iterators and Iterables in Python: Run Efficient Iterations](https://realpython.com/python-iterators-iterables/#when-to-use-an-iterator-in-python)
## What it does
Checks for indexed access to lists, strings, tuples, bytes, and comprehensions
using a type other than an integer or slice.

## Why is this bad?
Only integers or slices can be used as indices to these types. Using
```