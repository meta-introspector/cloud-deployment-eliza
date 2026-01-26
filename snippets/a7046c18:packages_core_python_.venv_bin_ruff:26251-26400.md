# a7046c18:packages_core_python_.venv_bin_ruff:26251-26400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26251-26400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
annotations in stub files, and should be omitted.

## Example

```pyi
def function() -> "int": ...
```

Use instead:

```pyi
def function() -> int: ...
```

## References
- [Typing documentation - Writing and Maintaining Stub Files](https://typing.python.org/en/latest/guides/writing_stubs.html)
## What it does
Checks for the presence of docstrings in stub files.

## Why is this bad?
Stub files should omit docstrings, as they're intended to provide type
hints, rather than documentation.

## Example

```pyi
def func(param: int) -> str:
    """This is a docstring."""
    ...
```

Use instead:

```pyi
def func(param: int) -> str: ...
```
## What it does
Checks for uses of `collections.namedtuple` in stub files.

## Why is this bad?
`typing.NamedTuple` is the "typed version" of `collections.namedtuple`.

Inheriting from `typing.NamedTuple` creates a custom `tuple` subclass in
the same way as using the `collections.namedtuple` factory function.
However, using `typing.NamedTuple` allows you to provide a type annotation
for each field in the class. This means that type checkers will have more
information to work with, and will be able to analyze your code more
precisely.

## Example
```pyi
from collections import namedtuple

Person = namedtuple("Person", ["name", "age"])
```

Use instead:
```pyi
from typing import NamedTuple

class Person(NamedTuple):
    name: str
    age: int
```
## What it does
Checks for `from collections.abc import Set` imports that do not alias
`Set` to `AbstractSet`.

## Why is this bad?
The `Set` type in `collections.abc` is an abstract base class for set-like types.
It is easily confused with, and not equivalent to, the `set` builtin.

To avoid confusion, `Set` should be aliased to `AbstractSet` when imported. This
makes it clear that the imported type is an abstract base class, and not the
`set` builtin.

## Example
```pyi
from collections.abc import Set
```

Use instead:
```pyi
from collections.abc import Set as AbstractSet
```

## Fix safety
This rule's fix is marked as unsafe for `Set` imports defined at the
top-level of a `.py` module. Top-level symbols are implicitly exported by the
module, and so renaming a top-level symbol may break downstream modules
that import it.

The same is not true for `.pyi` files, where imported symbols are only
re-exported if they are included in `__all__`, use a "redundant"
`import foo as foo` alias, or are imported via a `*` import. As such, the
fix is marked as safe in more cases for `.pyi` files.
## What it does
Checks for type alias definitions that are not annotated with
`typing.TypeAlias`.

## Why is this bad?
In Python, a type alias is defined by assigning a type to a variable (e.g.,
`Vector = list[float]`).

It's best to annotate type aliases with the `typing.TypeAlias` type to
make it clear that the statement is a type alias declaration, as opposed
to a normal variable assignment.

## Example
```pyi
Vector = list[float]
```

Use instead:
```pyi
from typing import TypeAlias

Vector: TypeAlias = list[float]
```

## Availability

Because this rule relies on the third-party `typing_extensions` module for Python versions
before 3.10, its diagnostic will not be emitted, and no fix will be offered, if
`typing_extensions` imports have been disabled by the [`lint.typing-extensions`] linter option.

## Options

- `lint.typing-extensions`
## What it does
Checks for redundant definitions of `__str__` or `__repr__` in stubs.

## Why is this bad?
Defining `__str__` or `__repr__` in a stub is almost always redundant,
as the signatures are almost always identical to those of the default
equivalent, `object.__str__` and `object.__repr__`, respectively.

## Example

```pyi
class Foo:
    def __repr__(self) -> str: ...
```
## What it does
Checks for the presence of multiple literal types in a union.

## Why is this bad?
`Literal["foo", 42]` has identical semantics to
`Literal["foo"] | Literal[42]`, but is clearer and more concise.

```