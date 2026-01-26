# a7046c18:packages_core_python_.venv_bin_ruff:25351-25500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25351-25500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
def func():
    """Placeholder docstring."""
    pass
```

Use instead:
```python
def func():
    """Placeholder docstring."""
```

Or, given:
```python
def func():
    """Placeholder docstring."""
    ...
```

Use instead:
```python
def func():
    """Placeholder docstring."""
```

## Fix safety
This rule's fix is marked as unsafe in the rare case that the `pass` or ellipsis
is followed by a string literal, since removal of the placeholder would convert the
subsequent string literal into a docstring.

## References
- [Python documentation: The `pass` statement](https://docs.python.org/3/reference/simple_stmts.html#the-pass-statement)
## What it does
Checks for duplicate field definitions in classes.

## Why is this bad?
Defining a field multiple times in a class body is redundant and likely a
mistake.

## Example
```python
class Person:
    name = Tom
    ...
    name = Ben
```

Use instead:
```python
class Person:
    name = Tom
    ...
```

## Fix safety
This fix is always marked as unsafe since we cannot know
for certain which assignment was intended.
## What it does
Checks for enums that contain duplicate values.

## Why is this bad?
Enum values should be unique. Non-unique values are redundant and likely a
mistake.

## Example
```python
from enum import Enum


class Foo(Enum):
    A = 1
    B = 2
    C = 1
```

Use instead:
```python
from enum import Enum


class Foo(Enum):
    A = 1
    B = 2
    C = 3
```

## References
- [Python documentation: `enum.Enum`](https://docs.python.org/3/library/enum.html#enum.Enum)
## What it does
Checks for unnecessary dictionary unpacking operators (`**`).

## Why is this bad?
Unpacking a dictionary into another dictionary is redundant. The unpacking
operator can be removed, making the code more readable.

## Example
```python
foo = {"A": 1, "B": 2}
bar = {**foo, **{"C": 3}}
```

Use instead:
```python
foo = {"A": 1, "B": 2}
bar = {**foo, "C": 3}
```

## References
- [Python documentation: Dictionary displays](https://docs.python.org/3/reference/expressions.html#dictionary-displays)
## What it does
Checks for unnecessary `dict` kwargs.

## Why is this bad?
If the `dict` keys are valid identifiers, they can be passed as keyword
arguments directly, without constructing unnecessary dictionary.
This also makes code more type-safe as type checkers often cannot
precisely verify dynamic keyword arguments.

## Example

```python
def foo(bar):
    return bar + 1


print(foo(**{"bar": 2}))  # prints 3

# No typing errors, but results in an exception at runtime.
print(foo(**{"bar": 2, "baz": 3}))
```

Use instead:

```python
def foo(bar):
    return bar + 1


print(foo(bar=2))  # prints 3

# Typing error detected: No parameter named "baz".
print(foo(bar=2, baz=3))
```

## Fix safety

This rule's fix is marked as unsafe for dictionaries with comments interleaved between
the items, as comments may be removed.
```