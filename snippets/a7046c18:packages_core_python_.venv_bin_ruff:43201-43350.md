# a7046c18:packages_core_python_.venv_bin_ruff:43201-43350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43201-43350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[PEP 3120]: https://peps.python.org/pep-3120/
## What it does
Checks for unnecessary `__future__` imports.

## Why is this bad?
The `__future__` module is used to enable features that are not yet
available in the current Python version. If a feature is already
available in the minimum supported Python version, importing it
from `__future__` is unnecessary and should be removed to avoid
confusion.

## Example
```python
from __future__ import print_function

print("Hello, world!")
```

Use instead:
```python
print("Hello, world!")
```

## Fix safety
This fix is marked unsafe if applying it would delete a comment.

## Options
- `target-version`

## References
- [Python documentation: `__future__` — Future statement definitions](https://docs.python.org/3/library/__future__.html)
## What it does
Checks for unnecessary parentheses on `functools.lru_cache` decorators.

## Why is this bad?
Since Python 3.8, `functools.lru_cache` can be used as a decorator without
trailing parentheses, as long as no arguments are passed to it.

## Example

```python
import functools


@functools.lru_cache()
def foo(): ...
```

Use instead:

```python
import functools


@functools.lru_cache
def foo(): ...
```

## Options
- `target-version`

## References
- [Python documentation: `@functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache)
- [Let lru_cache be used as a decorator with no arguments](https://github.com/python/cpython/issues/80953)
## What it does
Checks for unnecessary calls to `encode` as UTF-8.

## Why is this bad?
UTF-8 is the default encoding in Python, so there is no need to call
`encode` when UTF-8 is the desired encoding. Instead, use a bytes literal.

## Example
```python
"foo".encode("utf-8")
```

Use instead:
```python
b"foo"
```

## References
- [Python documentation: `str.encode`](https://docs.python.org/3/library/stdtypes.html#str.encode)
## What it does
Checks for `TypedDict` declarations that use functional syntax.

## Why is this bad?
`TypedDict` types can be defined either through a functional syntax
(`Foo = TypedDict(...)`) or a class syntax (`class Foo(TypedDict): ...`).

The class syntax is more readable and generally preferred over the
functional syntax.

Nonetheless, there are some situations in which it is impossible to use
the class-based syntax. This rule will not apply to those cases. Namely,
it is impossible to use the class-based syntax if any `TypedDict` fields are:
- Not valid [python identifiers] (for example, `@x`)
- [Python keywords] such as `in`
- [Private names] such as `__id` that would undergo [name mangling] at runtime
  if the class-based syntax was used
- [Dunder names] such as `__int__` that can confuse type checkers if they're used
  with the class-based syntax.

## Example
```python
from typing import TypedDict

Foo = TypedDict("Foo", {"a": int, "b": str})
```

Use instead:
```python
from typing import TypedDict


class Foo(TypedDict):
    a: int
    b: str
```

## Fix safety
This rule's fix is marked as unsafe if there are any comments within the
range of the `TypedDict` definition, as these will be dropped by the
autofix.

## References
- [Python documentation: `typing.TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict)

[Private names]: https://docs.python.org/3/tutorial/classes.html#private-variables
[name mangling]: https://docs.python.org/3/reference/expressions.html#private-name-mangling
[python identifiers]: https://docs.python.org/3/reference/lexical_analysis.html#identifiers
[Python keywords]: https://docs.python.org/3/reference/lexical_analysis.html#keywords
[Dunder names]: https://docs.python.org/3/reference/lexical_analysis.html#reserved-classes-of-identifiers
## What it does
Checks for `NamedTuple` declarations that use functional syntax.

## Why is this bad?
`NamedTuple` subclasses can be defined either through a functional syntax
(`Foo = NamedTuple(...)`) or a class syntax (`class Foo(NamedTuple): ...`).

The class syntax is more readable and generally preferred over the
functional syntax, which exists primarily for backwards compatibility
with `collections.namedtuple`.

## Example
```python
from typing import NamedTuple

Foo = NamedTuple("Foo", [("a", int), ("b", str)])
```
```