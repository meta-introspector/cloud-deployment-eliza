# a7046c18:packages_core_python_.venv_bin_ruff:26101-26250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26101-26250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
foo: str
```

## Fix safety
This rule's fix is marked as safe unless the union contains comments.

For nested union, the fix will flatten type expressions into a single
top-level union.

## References
- [Python documentation: `typing.Union`](https://docs.python.org/3/library/typing.html#typing.Union)
## What it does
Checks for assignments with multiple or non-name targets in stub files.

## Why is this bad?
In general, stub files should be thought of as "data files" for a type
checker, and are not intended to be executed. As such, it's useful to
enforce that only a subset of Python syntax is allowed in a stub file, to
ensure that everything in the stub is unambiguous for the type checker.

The need to perform multi-assignment, or assignment to a non-name target,
likely indicates a misunderstanding of how stub files are intended to be
used.

## Example

```pyi
from typing import TypeAlias

a = b = int

class Klass: ...

Klass.X: TypeAlias = int
```

Use instead:

```pyi
from typing import TypeAlias

a: TypeAlias = int
b: TypeAlias = int

class Klass:
    X: TypeAlias = int
```
## What it does
Checks for the presence of unused private `TypeVar`, `ParamSpec` or
`TypeVarTuple` declarations.

## Why is this bad?
A private `TypeVar` that is defined but not used is likely a mistake. It
should either be used, made public, or removed to avoid confusion. A type
variable is considered "private" if its name starts with an underscore.

## Example
```pyi
import typing
import typing_extensions

_T = typing.TypeVar("_T")
_Ts = typing_extensions.TypeVarTuple("_Ts")
```

## Fix safety
The fix is always marked as unsafe, as it would break your code if the type
variable is imported by another module.
## What it does
Checks for methods that use custom [`TypeVar`s][typing_TypeVar] in their
annotations when they could use [`Self`][Self] instead.

## Why is this bad?
While the semantics are often identical, using `Self` is more intuitive
and succinct (per [PEP 673]) than a custom `TypeVar`. For example, the
use of `Self` will typically allow for the omission of type parameters
on the `self` and `cls` arguments.

This check currently applies to instance methods that return `self`,
class methods that return an instance of `cls`, class methods that return
`cls`, and `__new__` methods.

## Example

```pyi
from typing import TypeVar

_S = TypeVar("_S", bound="Foo")

class Foo:
    def __new__(cls: type[_S], *args: str, **kwargs: int) -> _S: ...
    def foo(self: _S, arg: bytes) -> _S: ...
    @classmethod
    def bar(cls: type[_S], arg: int) -> _S: ...
```

Use instead:

```pyi
from typing import Self

class Foo:
    def __new__(cls, *args: str, **kwargs: int) -> Self: ...
    def foo(self, arg: bytes) -> Self: ...
    @classmethod
    def bar(cls, arg: int) -> Self: ...
```

## Fix behaviour
The fix replaces all references to the custom type variable in the method's header and body
with references to `Self`. The fix also adds an import of `Self` if neither `Self` nor `typing`
is already imported in the module. If your [`target-version`] setting is set to Python 3.11 or
newer, the fix imports `Self` from the standard-library `typing` module; otherwise, the fix
imports `Self` from the third-party [`typing_extensions`][typing_extensions] backport package.

If the custom type variable is a [PEP-695]-style `TypeVar`, the fix also removes the `TypeVar`
declaration from the method's [type parameter list]. However, if the type variable is an
old-style `TypeVar`, the declaration of the type variable will not be removed by this rule's
fix, as the type variable could still be used by other functions, methods or classes. See
[`unused-private-type-var`][PYI018] for a rule that will clean up unused private type
variables.

## Fix safety
The fix is only marked as unsafe if there is the possibility that it might delete a comment
from your code.

## Availability

Because this rule relies on the third-party `typing_extensions` module for Python versions
before 3.11, its diagnostic will not be emitted, and no fix will be offered, if
`typing_extensions` imports have been disabled by the [`lint.typing-extensions`] linter option.

## Options

- `lint.typing-extensions`

[PEP 673]: https://peps.python.org/pep-0673/#motivation
[PEP-695]: https://peps.python.org/pep-0695/
[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/
[type parameter list]: https://docs.python.org/3/reference/compound_stmts.html#type-params
[Self]: https://docs.python.org/3/library/typing.html#typing.Self
[typing_TypeVar]: https://docs.python.org/3/library/typing.html#typing.TypeVar
[typing_extensions]: https://typing-extensions.readthedocs.io/en/latest/
## What it does
Checks for quoted type annotations in stub (`.pyi`) files, which should be avoided.

## Why is this bad?
Stub files natively support forward references in all contexts, as stubs
are never executed at runtime. (They should be thought of as "data files"
for type checkers and IDEs.) As such, quotes are never required for type
```