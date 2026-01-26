# a7046c18:packages_core_python_.venv_bin_ruff:27301-27450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27301-27450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Options
- `target-version`

[PEP 484]: https://peps.python.org/pep-0484/#positional-only-arguments
[PEP 570]: https://peps.python.org/pep-0570
## What it does
Checks for redundant `Final[Literal[...]]` annotations.

## Why is this bad?
All constant variables annotated as `Final` are understood as implicitly
having `Literal` types by a type checker. As such, a `Final[Literal[...]]`
annotation can often be replaced with a bare `Final`, annotation, which
will have the same meaning to the type checker while being more concise and
more readable.

## Example

```pyi
from typing import Final, Literal

x: Final[Literal[42]]
y: Final[Literal[42]] = 42
```

Use instead:
```pyi
from typing import Final, Literal

x: Final = 42
y: Final = 42
```
## What it does
Checks for code that branches on `sys.version_info` comparisons where
branches corresponding to older Python versions come before branches
corresponding to newer Python versions.

## Why is this bad?
As a convention, branches that correspond to newer Python versions should
come first. This makes it easier to understand the desired behavior, which
typically corresponds to the latest Python versions.

This rule enforces the convention by checking for `if` tests that compare
`sys.version_info` with `<` rather than `>=`.

By default, this rule only applies to stub files.
In [preview], it will also flag this anti-pattern in non-stub files.

## Example

```pyi
import sys

if sys.version_info < (3, 10):
    def read_data(x, *, preserve_order=True): ...

else:
    def read_data(x): ...
```

Use instead:

```pyi
if sys.version_info >= (3, 10):
    def read_data(x): ...

else:
    def read_data(x, *, preserve_order=True): ...
```

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for argument-free `@pytest.fixture()` decorators with or without
parentheses, depending on the [`lint.flake8-pytest-style.fixture-parentheses`]
setting.

## Why is this bad?
If a `@pytest.fixture()` doesn't take any arguments, the parentheses are
optional.

Either removing those unnecessary parentheses _or_ requiring them for all
fixtures is fine, but it's best to be consistent. The rule defaults to
removing unnecessary parentheses, to match the documentation of the
official pytest projects.

## Example

```python
import pytest


@pytest.fixture()
def my_fixture(): ...
```

Use instead:

```python
import pytest


@pytest.fixture
def my_fixture(): ...
```

## Fix safety
This rule's fix is marked as unsafe if there's comments in the
`pytest.fixture` decorator.

For example, the fix would be marked as unsafe in the following case:
```python
import pytest


@pytest.fixture(
    # comment
    # scope = "module"
)
def my_fixture(): ...
```

## Options
- `lint.flake8-pytest-style.fixture-parentheses`

## References
- [`pytest` documentation: API Reference: Fixtures](https://docs.pytest.org/en/latest/reference/reference.html#fixtures-api)
## What it does
Checks for `pytest.fixture` calls with positional arguments.

## Why is this bad?
For clarity and consistency, prefer using keyword arguments to specify
fixture configuration.

## Example

```python
import pytest


@pytest.fixture("module")
def my_fixture(): ...
```

Use instead:

```python
import pytest


```