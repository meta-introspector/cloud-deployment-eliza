# a7046c18:packages_core_python_.venv_bin_ruff:30151-30300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30151-30300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks that the colon after a "TODO" tag is followed by a space.

## Why is this bad?
"TODO" tags are typically followed by a parenthesized author name, a colon,
a space, and a description of the issue, in that order.

Deviating from this pattern can lead to inconsistent and non-idiomatic
comments.

## Example
```python
# TODO(charlie):fix this
```

Use instead:
```python
# TODO(charlie): fix this
```
## What it does
Checks for first-party imports that are only used for type annotations, but
aren't defined in a type-checking block.

## Why is this bad?
Unused imports add a performance overhead at runtime, and risk creating
import cycles. If an import is _only_ used in typing-only contexts, it can
instead be imported conditionally under an `if TYPE_CHECKING:` block to
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

from . import local_module


def func(sized: local_module.Container) -> int:
    return len(sized)
```

Use instead:
```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from . import local_module


def func(sized: local_module.Container) -> int:
    return len(sized)
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
Checks for third-party imports that are only used for type annotations, but
aren't defined in a type-checking block.

## Why is this bad?
Unused imports add a performance overhead at runtime, and risk creating
import cycles. If an import is _only_ used in typing-only contexts, it can
instead be imported conditionally under an `if TYPE_CHECKING:` block to
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

import pandas as pd


def func(df: pd.DataFrame) -> int:
    return len(df)
```

Use instead:
```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    import pandas as pd


def func(df: pd.DataFrame) -> int:
    return len(df)
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
Checks for standard library imports that are only used for type
annotations, but aren't defined in a type-checking block.

## Why is this bad?
Unused imports add a performance overhead at runtime, and risk creating
import cycles. If an import is _only_ used in typing-only contexts, it can
instead be imported conditionally under an `if TYPE_CHECKING:` block to
```