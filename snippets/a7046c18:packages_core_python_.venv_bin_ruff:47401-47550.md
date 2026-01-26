# a7046c18:packages_core_python_.venv_bin_ruff:47401-47550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47401-47550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
@dataclass
class C:
    a: ClassVar[int] = 1
```

## Options
- [`lint.dummy-variable-rgx`]
## What it does
Checks for `int` conversions of values that are already integers.

## Why is this bad?
Such a conversion is unnecessary.

## Known problems
This rule may produce false positives for `round`, `math.ceil`, `math.floor`,
and `math.trunc` calls when values override the `__round__`, `__ceil__`, `__floor__`,
or `__trunc__` operators such that they don't return an integer.

## Example

```python
int(len([]))
int(round(foo, None))
```

Use instead:

```python
len([])
round(foo)
```

## Fix safety
The fix for `round`, `math.ceil`, `math.floor`, and `math.truncate` is unsafe
because removing the `int` conversion can change the semantics for values
overriding the `__round__`, `__ceil__`, `__floor__`, or `__trunc__` dunder methods
such that they don't return an integer.
## What it does
Checks for `else` clauses that only contains `pass` and `...` statements.

## Why is this bad?
Such an else clause does nothing and can be removed.

## Example
```python
if foo:
    bar()
else:
    pass
```

Use instead:
```python
if foo:
    bar()
```
## What it does
Checks for calls of the form `map(int, __version__.split("."))`.

## Why is this bad?
`__version__` does not always contain integral-like elements.

```python
import matplotlib  # `__version__ == "3.9.1.post-1"` in our environment

# ValueError: invalid literal for int() with base 10: 'post1'
tuple(map(int, matplotlib.__version__.split(".")))
```

See also [*Version specifiers* | Packaging spec][version-specifier].

## Example
```python
tuple(map(int, matplotlib.__version__.split(".")))
```

Use instead:
```python
import packaging.version as version

version.parse(matplotlib.__version__)
```

[version-specifier]: https://packaging.python.org/en/latest/specifications/version-specifiers/#version-specifiers
## What it does
Checks for enum classes which are also decorated with `@dataclass`.

## Why is this bad?
Decorating an enum with `@dataclass()` does not cause any errors at runtime,
but may cause erroneous results:

```python
@dataclass
class E(Enum):
    A = 1
    B = 2

print(E.A == E.B)  # True
```

## Example

```python
from dataclasses import dataclass
from enum import Enum


@dataclass
class E(Enum): ...
```

Use instead:

```python
from enum import Enum


class E(Enum): ...
```

## References
- [Python documentation: Enum HOWTO &sect; Dataclass support](https://docs.python.org/3/howto/enum.html#dataclass-support)
## What it does
Checks for `if key in dictionary: del dictionary[key]`.

## Why is this bad?
To remove a key-value pair from a dictionary, it's more concise to use `.pop(..., None)`.

## Example

```python
if key in dictionary:
    del dictionary[key]
```

Use instead:

```python
dictionary.pop(key, None)
```

## Fix safety
This rule's fix is marked as safe, unless the if statement contains comments.
## What it does
Checks for "dummy variables" (variables that are named as if to indicate they are unused)
that are in fact used.

By default, "dummy variables" are any variables with names that start with leading
underscores. However, this is customisable using the [`lint.dummy-variable-rgx`] setting).

```