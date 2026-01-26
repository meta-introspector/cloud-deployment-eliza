# a7046c18:packages_core_python_.venv_bin_ruff:27151-27300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27151-27300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
For example:
```python
from collections.abc import Container, Iterable, Sized
from typing import Generic, TypeVar


T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


class LinkedList(Generic[T], Sized):
    def push(self, item: T) -> None:
        self._items.append(item)


class MyMapping(
    Generic[K, V],
    Iterable[tuple[K, V]],
    Container[tuple[K, V]],
):
    ...
```

Use instead:
```python
from collections.abc import Container, Iterable, Sized
from typing import Generic, TypeVar


T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


class LinkedList(Sized, Generic[T]):
    def push(self, item: T) -> None:
        self._items.append(item)


class MyMapping(
    Iterable[tuple[K, V]],
    Container[tuple[K, V]],
    Generic[K, V],
):
    ...
```

## Fix safety

This rule's fix is always unsafe because reordering base classes can change
the behavior of the code by modifying the class's MRO. The fix will also
delete trailing comments after the `Generic` base class in multi-line base
class lists, if any are present.

## Fix availability

This rule's fix is only available when there are no `*args` present in the base class list.

## References
- [`typing.Generic` documentation](https://docs.python.org/3/library/typing.html#typing.Generic)

[1]: https://github.com/python/cpython/issues/106102
[MRO]: https://docs.python.org/3/glossary.html#term-method-resolution-order
## What it does
Checks for redundant `Literal[None]` annotations.

## Why is this bad?
While `Literal[None]` is a valid type annotation, it is semantically equivalent to `None`.
Prefer `None` over `Literal[None]` for both consistency and readability.

## Example
```python
from typing import Literal

Literal[None]
Literal[1, 2, 3, "foo", 5, None]
```

Use instead:
```python
from typing import Literal

None
Literal[1, 2, 3, "foo", 5] | None
```

## Fix safety and availability
This rule's fix is marked as safe unless the literal contains comments.

There is currently no fix available when applying the fix would lead to
a `TypeError` from an expression of the form `None | None` or when we
are unable to import the symbol `typing.Optional` and the Python version
is 3.9 or below.

## References
- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.python.org/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)
## What it does
Checks for duplicate members in a `typing.Literal[]` slice.

## Why is this bad?
Duplicate literal members are redundant and should be removed.

## Example
```python
from typing import Literal

foo: Literal["a", "b", "a"]
```

Use instead:
```python
from typing import Literal

foo: Literal["a", "b"]
```

## Fix safety
This rule's fix is marked as safe, unless the type annotation contains comments.

Note that while the fix may flatten nested literals into a single top-level literal,
the semantics of the annotation will remain unchanged.

## References
- [Python documentation: `typing.Literal`](https://docs.python.org/3/library/typing.html#typing.Literal)
## What it does
Checks for the presence of [PEP 484]-style positional-only parameters.

## Why is this bad?
Historically, [PEP 484] recommended prefixing parameter names with double
underscores (`__`) to indicate to a type checker that they were
positional-only. However, [PEP 570] (introduced in Python 3.8) introduced
dedicated syntax for positional-only arguments. If a forward slash (`/`) is
present in a function signature on Python 3.8+, all parameters prior to the
slash are interpreted as positional-only.

The new syntax should be preferred as it is more widely used, more concise
and more readable. It is also respected by Python at runtime, whereas the
old-style syntax was only understood by type checkers.

## Example

```pyi
def foo(__x: int) -> None: ...
```

Use instead:

```pyi
def foo(x: int, /) -> None: ...
```