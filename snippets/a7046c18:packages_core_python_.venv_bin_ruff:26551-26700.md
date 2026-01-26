# a7046c18:packages_core_python_.venv_bin_ruff:26551-26700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:26551-26700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```pyi
class Foo:
    def __new__(cls, *args: Any, **kwargs: Any) -> Foo: ...
    def __enter__(self) -> Foo: ...
    async def __aenter__(self) -> Foo: ...
    def __iadd__(self, other: Foo) -> Foo: ...
```

Use instead:

```pyi
from typing_extensions import Self

class Foo:
    def __new__(cls, *args: Any, **kwargs: Any) -> Self: ...
    def __enter__(self) -> Self: ...
    async def __aenter__(self) -> Self: ...
    def __iadd__(self, other: Foo) -> Self: ...
```

## Fix safety
This rule's fix is marked as unsafe as it changes the meaning of your type annotations.

## Availability

Because this rule relies on the third-party `typing_extensions` module for Python versions
before 3.11, its diagnostic will not be emitted, and no fix will be offered, if
`typing_extensions` imports have been disabled by the [`lint.typing-extensions`] linter option.

## Options

- `lint.typing-extensions`

## References
- [Python documentation: `typing.Self`](https://docs.python.org/3/library/typing.html#typing.Self)

[PEP 673]: https://peps.python.org/pep-0673/#valid-locations-for-self
## What it does
Checks that `__all__`, `__match_args__`, and `__slots__` variables are
assigned to values when defined in stub files.

## Why is this bad?
Special variables like `__all__` have the same semantics in stub files
as they do in Python modules, and so should be consistent with their
runtime counterparts.

## Example
```pyi
__all__: list[str]
```

Use instead:
```pyi
__all__: list[str] = ["foo", "bar"]
```
## What it does
Checks for incorrect function signatures on `__exit__` and `__aexit__`
methods.

## Why is this bad?
Improperly annotated `__exit__` and `__aexit__` methods can cause
unexpected behavior when interacting with type checkers.

## Example

```pyi
from types import TracebackType

class Foo:
    def __exit__(
        self, typ: BaseException, exc: BaseException, tb: TracebackType
    ) -> None: ...
```

Use instead:

```pyi
from types import TracebackType

class Foo:
    def __exit__(
        self,
        typ: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None: ...
```
## What it does
Checks for parameter annotations that contain redundant unions between
builtin numeric types (e.g., `int | float`).

## Why is this bad?
The [typing specification] states:

> Python’s numeric types `complex`, `float` and `int` are not subtypes of
> each other, but to support common use cases, the type system contains a
> straightforward shortcut: when an argument is annotated as having type
> `float`, an argument of type `int` is acceptable; similar, for an
> argument annotated as having type `complex`, arguments of type `float` or
> `int` are acceptable.

As such, a union that includes both `int` and `float` is redundant in the
specific context of a parameter annotation, as it is equivalent to a union
that only includes `float`. For readability and clarity, unions should omit
redundant elements.

## Example

```pyi
def foo(x: float | int | str) -> None: ...
```

Use instead:

```pyi
def foo(x: float | str) -> None: ...
```

## Fix safety
This rule's fix is marked as safe, unless the type annotation contains comments.

Note that while the fix may flatten nested unions into a single top-level union,
the semantics of the annotation will remain unchanged.

## References
- [Python documentation: The numeric tower](https://docs.python.org/3/library/numbers.html#the-numeric-tower)
- [PEP 484: The numeric tower](https://peps.python.org/pep-0484/#the-numeric-tower)

[typing specification]: https://typing.python.org/en/latest/spec/special-types.html#special-cases-for-float-and-complex
## What it does
Checks for type aliases that do not use the CamelCase naming convention.

## Why is this bad?
It's conventional to use the CamelCase naming convention for type aliases,
to distinguish them from other variables.

## Example
```pyi
from typing import TypeAlias

type_alias_name: TypeAlias = int
```

Use instead:
```pyi
from typing import TypeAlias

TypeAliasName: TypeAlias = int
```
```