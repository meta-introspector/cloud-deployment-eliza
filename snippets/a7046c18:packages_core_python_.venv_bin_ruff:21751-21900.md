# a7046c18:packages_core_python_.venv_bin_ruff:21751-21900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21751-21900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
the exception, making the second handler unreachable.

## Example
```python
try:
    ...
except ValueError:
    ...
except ValueError:
    ...
```

Use instead:
```python
try:
    ...
except ValueError:
    ...
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
## What it does
Checks for function calls that use star-argument unpacking after providing a
keyword argument

## Why is this bad?
In Python, you can use star-argument unpacking to pass a list or tuple of
arguments to a function.

Providing a star-argument after a keyword argument can lead to confusing
behavior, and is only supported for backwards compatibility.

## Example
```python
def foo(x, y, z):
    return x, y, z


foo(1, 2, 3)  # (1, 2, 3)
foo(1, *[2, 3])  # (1, 2, 3)
# foo(x=1, *[2, 3])  # TypeError
# foo(y=2, *[1, 3])  # TypeError
foo(z=3, *[1, 2])  # (1, 2, 3)  # No error, but confusing!
```

Use instead:
```python
def foo(x, y, z):
    return x, y, z


foo(1, 2, 3)  # (1, 2, 3)
foo(x=1, y=2, z=3)  # (1, 2, 3)
foo(*[1, 2, 3])  # (1, 2, 3)
foo(*[1, 2], 3)  # (1, 2, 3)
```

## References
- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)
- [Disallow iterable argument unpacking after a keyword argument?](https://github.com/python/cpython/issues/82741)
## What it does
Checks for empty methods in abstract base classes without an abstract
decorator.

## Why is this bad?
Empty methods in abstract base classes without an abstract decorator may be
be indicative of a mistake. If the method is meant to be abstract, add an
`@abstractmethod` decorator to the method.

## Example

```python
from abc import ABC


class Foo(ABC):
    def method(self): ...
```

Use instead:

```python
from abc import ABC, abstractmethod


class Foo(ABC):
    @abstractmethod
    def method(self): ...
```

## References
- [Python documentation: `abc`](https://docs.python.org/3/library/abc.html)
## What it does
Checks for `warnings.warn` calls without an explicit `stacklevel` keyword
argument.

## Why is this bad?
The `warnings.warn` method uses a `stacklevel` of 1 by default, which
will output a stack frame of the line on which the "warn" method
is called. Setting it to a higher number will output a stack frame
from higher up the stack.

It's recommended to use a `stacklevel` of 2 or higher, to give the caller
more context about the warning.

## Example
```python
import warnings

warnings.warn("This is a warning")
```

Use instead:
```python
import warnings

warnings.warn("This is a warning", stacklevel=2)
```

## Fix safety
This rule's fix is marked as unsafe because it changes
the behavior of the code. Moreover, the fix will assign
a stacklevel of 2, while the user may wish to assign a
higher stacklevel to address the diagnostic.

## References
- [Python documentation: `warnings.warn`](https://docs.python.org/3/library/warnings.html#warnings.warn)
## What it does
Checks for exception handlers that catch an empty tuple.

## Why is this bad?
An exception handler that catches an empty tuple will not catch anything,
and is indicative of a mistake. Instead, add exceptions to the `except`
clause.

## Example
```python
try:
    1 / 0
except ():
    ...
```

Use instead:
```python
try:
    1 / 0
except ZeroDivisionError:
    ...
```