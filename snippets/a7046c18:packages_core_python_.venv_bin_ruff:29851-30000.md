# a7046c18:packages_core_python_.venv_bin_ruff:29851-30000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29851-30000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
In Python, the `__slots__` attribute allows you to explicitly define the
attributes (instance variables) that a class can have. By default, Python
uses a dictionary to store an object's attributes, which incurs some memory
overhead. However, when `__slots__` is defined, Python uses a more compact
internal structure to store the object's attributes, resulting in memory
savings.

Subclasses of `str` inherit all the attributes and methods of the built-in
`str` class. Since strings are typically immutable, they don't require
additional attributes beyond what the `str` class provides. Defining
`__slots__` for subclasses of `str` prevents the creation of a dictionary
for each instance, reducing memory consumption.

## Example
```python
class Foo(str):
    pass
```

Use instead:
```python
class Foo(str):
    __slots__ = ()
```

## References
- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)
## What it does
Checks for subclasses of `tuple` that lack a `__slots__` definition.

## Why is this bad?
In Python, the `__slots__` attribute allows you to explicitly define the
attributes (instance variables) that a class can have. By default, Python
uses a dictionary to store an object's attributes, which incurs some memory
overhead. However, when `__slots__` is defined, Python uses a more compact
internal structure to store the object's attributes, resulting in memory
savings.

Subclasses of `tuple` inherit all the attributes and methods of the
built-in `tuple` class. Since tuples are typically immutable, they don't
require additional attributes beyond what the `tuple` class provides.
Defining `__slots__` for subclasses of `tuple` prevents the creation of a
dictionary for each instance, reducing memory consumption.

## Example
```python
class Foo(tuple):
    pass
```

Use instead:
```python
class Foo(tuple):
    __slots__ = ()
```

## References
- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)
## What it does
Checks for subclasses of `collections.namedtuple` or `typing.NamedTuple`
that lack a `__slots__` definition.

## Why is this bad?
In Python, the `__slots__` attribute allows you to explicitly define the
attributes (instance variables) that a class can have. By default, Python
uses a dictionary to store an object's attributes, which incurs some memory
overhead. However, when `__slots__` is defined, Python uses a more compact
internal structure to store the object's attributes, resulting in memory
savings.

Subclasses of `namedtuple` inherit all the attributes and methods of the
built-in `namedtuple` class. Since tuples are typically immutable, they
don't require additional attributes beyond what the `namedtuple` class
provides. Defining `__slots__` for subclasses of `namedtuple` prevents the
creation of a dictionary for each instance, reducing memory consumption.

## Example
```python
from collections import namedtuple


class Foo(namedtuple("foo", ["str", "int"])):
    pass
```

Use instead:
```python
from collections import namedtuple


class Foo(namedtuple("foo", ["str", "int"])):
    __slots__ = ()
```

## References
- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)
## What it does
Checks for banned imports.

## Why is this bad?
Projects may want to ensure that specific modules or module members are
not imported or accessed.

Security or other company policies may be a reason to impose
restrictions on importing external Python libraries. In some cases,
projects may adopt conventions around the use of certain modules or
module members that are not enforceable by the language itself.

This rule enforces certain import conventions project-wide automatically.

## Options
- `lint.flake8-tidy-imports.banned-api`
## What it does
Checks for relative imports.

## Why is this bad?
Absolute imports, or relative imports from siblings, are recommended by [PEP 8]:

> Absolute imports are recommended, as they are usually more readable and tend to be better behaved...
> ```python
> import mypkg.sibling
> from mypkg import sibling
> from mypkg.sibling import example
> ```
> However, explicit relative imports are an acceptable alternative to absolute imports,
> especially when dealing with complex package layouts where using absolute imports would be
> unnecessarily verbose:
> ```python
> from . import sibling
> from .sibling import example
> ```

## Example
```python
from .. import foo
```

Use instead:
```python
from mypkg import foo
```

## Options
- `lint.flake8-tidy-imports.ban-relative-imports`

[PEP 8]: https://peps.python.org/pep-0008/#imports
## What it does
Checks for module-level imports that should instead be imported lazily
(e.g., within a function definition, or an `if TYPE_CHECKING:` block, or
```