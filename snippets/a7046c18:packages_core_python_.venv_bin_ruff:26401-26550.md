# a7046c18:packages_core_python_.venv_bin_ruff:26401-26550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26401-26550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Example
```pyi
from typing import Literal

field: Literal[1] | Literal[2] | str
```

Use instead:
```pyi
from typing import Literal

field: Literal[1, 2] | str
```

## Fix safety
This fix is marked unsafe if it would delete any comments within the replacement range.

An example to illustrate where comments are preserved and where they are not:

```pyi
from typing import Literal

field: (
    # deleted comment
    Literal["a", "b"]  # deleted comment
    # deleted comment
    | Literal["c", "d"]  # preserved comment
)
```

## References
- [Python documentation: `typing.Literal`](https://docs.python.org/3/library/typing.html#typing.Literal)
## What it does
Checks for `__eq__` and `__ne__` implementations that use `typing.Any` as
the type annotation for their second parameter.

## Why is this bad?
The Python documentation recommends the use of `object` to "indicate that a
value could be any type in a typesafe manner". `Any`, on the other hand,
should be seen as an "escape hatch when you need to mix dynamically and
statically typed code". Since using `Any` allows you to write highly unsafe
code, you should generally only use `Any` when the semantics of your code
would otherwise be inexpressible to the type checker.

The expectation in Python is that a comparison of two arbitrary objects
using `==` or `!=` should never raise an exception. This contract can be
fully expressed in the type system and does not involve requesting unsound
behaviour from a type checker. As such, `object` is a more appropriate
annotation than `Any` for the second parameter of the methods implementing
these comparison operators -- `__eq__` and `__ne__`.

## Example

```pyi
from typing import Any

class Foo:
    def __eq__(self, obj: Any) -> bool: ...
```

Use instead:

```pyi
class Foo:
    def __eq__(self, obj: object) -> bool: ...
```
## References
- [Python documentation: The `Any` type](https://docs.python.org/3/library/typing.html#the-any-type)
- [Mypy documentation: Any vs. object](https://mypy.readthedocs.io/en/latest/dynamic_typing.html#any-vs-object)
## What it does
Checks for the use of type comments (e.g., `x = 1  # type: int`) in stub
files.

## Why is this bad?
Stub (`.pyi`) files should use type annotations directly, rather
than type comments, even if they're intended to support Python 2, since
stub files are not executed at runtime. The one exception is `# type: ignore`.

## Example
```pyi
x = 1  # type: int
```

Use instead:
```pyi
x: int = 1
```
## What it does
Checks for methods that are annotated with a fixed return type which
should instead be returning `Self`.

## Why is this bad?
If methods that generally return `self` at runtime are annotated with a
fixed return type, and the class is subclassed, type checkers will not be
able to infer the correct return type.

For example:
```python
class Shape:
    def set_scale(self, scale: float) -> Shape:
        self.scale = scale
        return self

class Circle(Shape):
    def set_radius(self, radius: float) -> Circle:
        self.radius = radius
        return self

# Type checker infers return type as `Shape`, not `Circle`.
Circle().set_scale(0.5)

# Thus, this expression is invalid, as `Shape` has no attribute `set_radius`.
Circle().set_scale(0.5).set_radius(2.7)
```

Specifically, this check enforces that the return type of the following
methods is `Self`:

1. In-place binary-operation dunder methods, like `__iadd__`, `__imul__`, etc.
1. `__new__`, `__enter__`, and `__aenter__`, if those methods return the
   class name.
1. `__iter__` methods that return `Iterator`, despite the class inheriting
   directly from `Iterator`.
1. `__aiter__` methods that return `AsyncIterator`, despite the class
   inheriting directly from `AsyncIterator`.

The rule attempts to avoid flagging methods on metaclasses, since
[PEP 673] specifies that `Self` is disallowed in metaclasses. Ruff can
detect a class as being a metaclass if it inherits from a stdlib
metaclass such as `builtins.type` or `abc.ABCMeta`, and additionally
infers that a class may be a metaclass if it has a `__new__` method
with a similar signature to `type.__new__`. The heuristic used to
identify a metaclass-like `__new__` method signature is that it:

1. Has exactly 5 parameters (including `cls`)
1. Has a second parameter annotated with `str`
1. Has a third parameter annotated with a `tuple` type
1. Has a fourth parameter annotated with a `dict` type
1. Has a fifth parameter is keyword-variadic (`**kwargs`)

For example, the following class would be detected as a metaclass, disabling
the rule:

```python
class MyMetaclass(django.db.models.base.ModelBase):
    def __new__(cls, name: str, bases: tuple[Any, ...], attrs: dict[str, Any], **kwargs: Any) -> MyMetaclass:
        ...
```

## Example
```