# a7046c18:packages_core_python_.venv_bin_ruff:28201-28350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28201-28350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
In `pytest` fixtures, the `yield` expression should only be used for fixtures
that include teardown code, to clean up the fixture after the test function
has finished executing.

## Example
```python
import pytest


@pytest.fixture()
def my_fixture():
    resource = acquire_resource()
    yield resource
```

Use instead:
```python
import pytest


@pytest.fixture()
def my_fixture_with_teardown():
    resource = acquire_resource()
    yield resource
    resource.release()


@pytest.fixture()
def my_fixture_without_teardown():
    resource = acquire_resource()
    return resource
```

## References
- [`pytest` documentation: Teardown/Cleanup](https://docs.pytest.org/en/latest/how-to/fixtures.html#teardown-cleanup-aka-fixture-finalization)
## What it does
Checks for argument-free `@pytest.mark.<marker>()` decorators with or
without parentheses, depending on the [`lint.flake8-pytest-style.mark-parentheses`]
setting.

The rule defaults to removing unnecessary parentheses,
to match the documentation of the official pytest projects.

## Why is this bad?
If a `@pytest.mark.<marker>()` doesn't take any arguments, the parentheses are
optional.

Either removing those unnecessary parentheses _or_ requiring them for all
fixtures is fine, but it's best to be consistent.

## Example

```python
import pytest


@pytest.mark.foo()
def test_something(): ...
```

Use instead:

```python
import pytest


@pytest.mark.foo
def test_something(): ...
```

## Fix safety
This rule's fix is marked as unsafe if there's comments in the
`pytest.mark.<marker>` decorator.
```python
import pytest


@pytest.mark.foo(
    # comment
)
def test_something(): ...
```

## Options
- `lint.flake8-pytest-style.mark-parentheses`

## References
- [`pytest` documentation: Marks](https://docs.pytest.org/en/latest/reference/reference.html#marks)
## What it does
Checks for unnecessary `@pytest.mark.asyncio` decorators applied to fixtures.

## Why is this bad?
`pytest.mark.asyncio` is unnecessary for fixtures.

## Example
```python
import pytest


@pytest.mark.asyncio()
@pytest.fixture()
async def my_fixture():
    return 0
```

Use instead:
```python
import pytest


@pytest.fixture()
async def my_fixture():
    return 0
```

## References
- [PyPI: `pytest-asyncio`](https://pypi.org/project/pytest-asyncio/)
## What it does
Checks for `pytest.mark.usefixtures` decorators applied to `pytest`
fixtures.

## Why is this bad?
The `pytest.mark.usefixtures` decorator has no effect on `pytest` fixtures.

## Example
```python
import pytest


@pytest.fixture()
def a():
    pass


@pytest.mark.usefixtures("a")
@pytest.fixture()
def b(a):
    pass
```

Use instead:
```python
import pytest


@pytest.fixture()
def a():
    pass


```