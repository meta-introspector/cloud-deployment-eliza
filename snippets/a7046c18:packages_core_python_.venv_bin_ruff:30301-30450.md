# a7046c18:packages_core_python_.venv_bin_ruff:30301-30450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30301-30450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
minimize runtime overhead.

If [`lint.flake8-type-checking.quote-annotations`] is set to `true`,
annotations will be wrapped in quotes if doing so would enable the
corresponding import to be moved into an `if TYPE_CHECKING:` block.

If a class _requires_ that type annotations be available at runtime (as is
the case for Pydantic, SQLAlchemy, and other libraries), consider using
the [`lint.flake8-type-checking.runtime-evaluated-base-classes`] and
[`lint.flake8-type-checking.runtime-evaluated-decorators`] settings to mark them
as such.

If [`lint.future-annotations`] is set to `true`, `from __future__ import
annotations` will be added if doing so would enable an import to be
moved into an `if TYPE_CHECKING:` block. This takes precedence over the
[`lint.flake8-type-checking.quote-annotations`] setting described above if
both settings are enabled.

## Example
```python
from __future__ import annotations

from pathlib import Path


def func(path: Path) -> str:
    return str(path)
```

Use instead:
```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from pathlib import Path


def func(path: Path) -> str:
    return str(path)
```

## Options
- `lint.flake8-type-checking.quote-annotations`
- `lint.flake8-type-checking.runtime-evaluated-base-classes`
- `lint.flake8-type-checking.runtime-evaluated-decorators`
- `lint.flake8-type-checking.strict`
- `lint.typing-modules`
- `lint.future-annotations`

## References
- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)
## What it does
Checks for imports that are required at runtime but are only defined in
type-checking blocks.

## Why is this bad?
The type-checking block is not executed at runtime, so if the only definition
of a symbol is in a type-checking block, it will not be available at runtime.

If [`lint.flake8-type-checking.quote-annotations`] is set to `true`,
annotations will be wrapped in quotes if doing so would enable the
corresponding import to remain in the type-checking block.

## Example
```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import foo


def bar() -> None:
    foo.bar()  # raises NameError: name 'foo' is not defined
```

Use instead:
```python
import foo


def bar() -> None:
    foo.bar()
```

## Options
- `lint.flake8-type-checking.quote-annotations`

## References
- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)
## What it does
Checks for an empty type-checking block.

## Why is this bad?
The type-checking block does not do anything and should be removed to avoid
confusion.

## Example
```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass

print("Hello, world!")
```

Use instead:
```python
print("Hello, world!")
```

## References
- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)
## What it does
Checks for unquoted type expressions in `typing.cast()` calls.

## Why is this bad?
This rule helps enforce a consistent style across your codebase.

It's often necessary to quote the first argument passed to `cast()`,
as type expressions can involve forward references, or references
to symbols which are only imported in `typing.TYPE_CHECKING` blocks.
This can lead to a visual inconsistency across different `cast()` calls,
where some type expressions are quoted but others are not. By enabling
this rule, you ensure that all type expressions passed to `cast()` are
quoted, enforcing stylistic consistency across all of your `cast()` calls.

In some cases where `cast()` is used in a hot loop, this rule may also
help avoid overhead from repeatedly evaluating complex type expressions at
runtime.

## Example
```python
from typing import cast

x = cast(dict[str, int], foo)
```

Use instead:
```python
from typing import cast

x = cast("dict[str, int]", foo)
```

## Fix safety
This fix is safe as long as the type expression doesn't span multiple
lines and includes comments on any of the lines apart from the last one.
```