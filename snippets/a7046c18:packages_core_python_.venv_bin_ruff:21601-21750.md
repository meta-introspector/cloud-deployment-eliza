# a7046c18:packages_core_python_.venv_bin_ruff:21601-21750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21601-21750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

for items in items:
    print(items)
```

Use instead:
```python
items = [1, 2, 3]

for item in items:
    print(item)
```

## References
- [Python documentation: The `for` statement](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement)
## What it does
Checks for docstrings that are written via f-strings.

## Why is this bad?
Python will interpret the f-string as a joined string, rather than as a
docstring. As such, the "docstring" will not be accessible via the
`__doc__` attribute, nor will it be picked up by any automated
documentation tooling.

## Example
```python
def foo():
    f"""Not a docstring."""
```

Use instead:
```python
def foo():
    """A docstring."""
```

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [Python documentation: Formatted string literals](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
## What it does
Checks for `contextlib.suppress` without arguments.

## Why is this bad?
`contextlib.suppress` is a context manager that suppresses exceptions. It takes,
as arguments, the exceptions to suppress within the enclosed block. If no
exceptions are specified, then the context manager won't suppress any
exceptions, and is thus redundant.

Consider adding exceptions to the `contextlib.suppress` call, or removing the
context manager entirely.

## Example
```python
import contextlib

with contextlib.suppress():
    foo()
```

Use instead:
```python
import contextlib

with contextlib.suppress(Exception):
    foo()
```

## References
- [Python documentation: `contextlib.suppress`](https://docs.python.org/3/library/contextlib.html#contextlib.suppress)
## What it does
Checks for function definitions that use a loop variable.

## Why is this bad?
The loop variable is not bound in the function definition, so it will always
have the value it had in the last iteration when the function is called.

Instead, consider using a default argument to bind the loop variable at
function definition time. Or, use `functools.partial`.

## Example
```python
adders = [lambda x: x + i for i in range(3)]
values = [adder(1) for adder in adders]  # [3, 3, 3]
```

Use instead:
```python
adders = [lambda x, i=i: x + i for i in range(3)]
values = [adder(1) for adder in adders]  # [1, 2, 3]
```

Or:
```python
from functools import partial

adders = [partial(lambda x, i: x + i, i=i) for i in range(3)]
values = [adder(1) for adder in adders]  # [1, 2, 3]
```

## References
- [The Hitchhiker's Guide to Python: Late Binding Closures](https://docs.python-guide.org/writing/gotchas/#late-binding-closures)
- [Python documentation: `functools.partial`](https://docs.python.org/3/library/functools.html#functools.partial)
## What it does
Checks for abstract classes without abstract methods or properties.
Annotated but unassigned class variables are regarded as abstract.

## Why is this bad?
Abstract base classes are used to define interfaces. If an abstract base
class has no abstract methods or properties, you may have forgotten
to add an abstract method or property to the class,
or omitted an `@abstractmethod` decorator.

If the class is _not_ meant to be used as an interface, consider removing
the `ABC` base class from the class definition.

## Example
```python
from abc import ABC
from typing import ClassVar


class Foo(ABC):
    class_var: ClassVar[str] = "assigned"

    def method(self):
        bar()
```

Use instead:
```python
from abc import ABC, abstractmethod
from typing import ClassVar


class Foo(ABC):
    class_var: ClassVar[str]  # unassigned

    @abstractmethod
    def method(self):
        bar()
```

## References
- [Python documentation: `abc`](https://docs.python.org/3/library/abc.html)
- [Python documentation: `typing.ClassVar`](https://docs.python.org/3/library/typing.html#typing.ClassVar)
## What it does
Checks for `try-except` blocks with duplicate exception handlers.

## Why is this bad?
Duplicate exception handlers are redundant, as the first handler will catch
```