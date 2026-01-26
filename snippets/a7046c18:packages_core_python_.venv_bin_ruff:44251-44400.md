# a7046c18:packages_core_python_.venv_bin_ruff:44251-44400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44251-44400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
class Foo(StrEnum):
    BAR = "bar"


f"{Foo.BAR}"  # > bar
```

As such, migrating to `enum.StrEnum` will introduce a behavior change for
code that relies on the Python 3.11 behavior.

## Options

- `target-version`

## References
- [enum.StrEnum](https://docs.python.org/3/library/enum.html#enum.StrEnum)

[breaking change]: https://blog.pecar.me/python-enum
## What it does
Checks for unnecessary default type arguments for `Generator` and
`AsyncGenerator` on Python 3.13+.
In [preview], this rule will also apply to stub files.

## Why is this bad?
Python 3.13 introduced the ability for type parameters to specify default
values. Following this change, several standard-library classes were
updated to add default values for some of their type parameters. For
example, `Generator[int]` is now equivalent to
`Generator[int, None, None]`, as the second and third type parameters of
`Generator` now default to `None`.

Omitting type arguments that match the default values can make the code
more concise and easier to read.

## Example

```python
from collections.abc import Generator, AsyncGenerator


def sync_gen() -> Generator[int, None, None]:
    yield 42


async def async_gen() -> AsyncGenerator[int, None]:
    yield 42
```

Use instead:

```python
from collections.abc import Generator, AsyncGenerator


def sync_gen() -> Generator[int]:
    yield 42


async def async_gen() -> AsyncGenerator[int]:
    yield 42
```

## Fix safety
This rule's fix is marked as safe, unless the type annotation contains comments.

## Options
- `target-version`

## References
- [PEP 696 – Type Defaults for Type Parameters](https://peps.python.org/pep-0696/)
- [Annotating generators and coroutines](https://docs.python.org/3/library/typing.html#annotating-generators-and-coroutines)
- [Python documentation: `typing.Generator`](https://docs.python.org/3/library/typing.html#typing.Generator)
- [Python documentation: `typing.AsyncGenerator`](https://docs.python.org/3/library/typing.html#typing.AsyncGenerator)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of `Unpack[]` on Python 3.11 and above, and suggests
using `*` instead.

## Why is this bad?
[PEP 646] introduced a new syntax for unpacking sequences based on the `*`
operator. This syntax is more concise and readable than the previous
`Unpack[]` syntax.

## Example
```python
from typing import Unpack


def foo(*args: Unpack[tuple[int, ...]]) -> None:
    pass
```

Use instead:
```python
def foo(*args: *tuple[int, ...]) -> None:
    pass
```

## Fix safety
This rule's fix is marked as unsafe, as `Unpack[T]` and `*T` are considered
different values when introspecting types at runtime. However, in most cases,
the fix should be safe to apply.

## Options

- `target-version`

[PEP 646]: https://peps.python.org/pep-0646/
## What it does
Check for `typing.Optional` annotations that can be rewritten based on [PEP 604] syntax.

## Why is this bad?
[PEP 604] introduced a new syntax for union type annotations based on the
`|` operator. This syntax is more concise and readable than the previous
`typing.Optional` syntax.

This rule is enabled when targeting Python 3.10 or later (see:
[`target-version`]). By default, it's _also_ enabled for earlier Python
versions if `from __future__ import annotations` is present, as
`__future__` annotations are not evaluated at runtime. If your code relies
on runtime type annotations (either directly or via a library like
Pydantic), you can disable this behavior for Python versions prior to 3.10
by setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.

## Example
```python
from typing import Optional

foo: Optional[int] = None
```

Use instead:
```python
foo: int | None = None
```

## Fix safety
This rule's fix is marked as unsafe, as it may lead to runtime errors
using libraries that rely on runtime type annotations, like Pydantic,
on Python versions prior to Python 3.10. It may also lead to runtime errors
in unusual and likely incorrect type annotations where the type does not
support the `|` operator.

## Options
- `target-version`
- `lint.pyupgrade.keep-runtime-typing`

[PEP 604]: https://peps.python.org/pep-0604/
## What it does
```