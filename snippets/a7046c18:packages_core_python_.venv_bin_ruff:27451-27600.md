# a7046c18:packages_core_python_.venv_bin_ruff:27451-27600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27451-27600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
@pytest.fixture(scope="module")
def my_fixture(): ...
```

## References
- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)
## What it does
Checks for `pytest.fixture` calls with `scope="function"`.

## Why is this bad?
`scope="function"` can be omitted, as it is the default.

## Example

```python
import pytest


@pytest.fixture(scope="function")
def my_fixture(): ...
```

Use instead:

```python
import pytest


@pytest.fixture()
def my_fixture(): ...
```

## References
- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)
## Removal
This rule has been removed because marking fixtures that do not return a value with an underscore
isn't a practice recommended by the pytest community.

## What it does
Checks for `pytest` fixtures that do not return a value, but are not named
with a leading underscore.

## Why is this bad?
By convention, fixtures that don't return a value should be named with a
leading underscore, while fixtures that do return a value should not.

This rule ignores abstract fixtures and generators.

## Example
```python
import pytest


@pytest.fixture()
def patch_something(mocker):
    mocker.patch("module.object")


@pytest.fixture()
def use_context():
    with create_context():
        yield
```

Use instead:
```python
import pytest


@pytest.fixture()
def _patch_something(mocker):
    mocker.patch("module.object")


@pytest.fixture()
def _use_context():
    with create_context():
        yield
```

## References
- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)
## Removal
This rule has been removed because marking fixtures that do not return a value with an underscore
isn't a practice recommended by the pytest community.

## What it does
Checks for `pytest` fixtures that return a value, but are named with a
leading underscore.

## Why is this bad?
By convention, fixtures that don't return a value should be named with a
leading underscore, while fixtures that do return a value should not.

This rule ignores abstract fixtures.

## Example
```python
import pytest


@pytest.fixture()
def _some_object():
    return SomeClass()


@pytest.fixture()
def _some_object_with_cleanup():
    obj = SomeClass()
    yield obj
    obj.cleanup()
```

Use instead:
```python
import pytest


@pytest.fixture()
def some_object():
    return SomeClass()


@pytest.fixture()
def some_object_with_cleanup():
    obj = SomeClass()
    yield obj
    obj.cleanup()
```

## References
- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)
## What it does
Checks for the type of parameter names passed to `pytest.mark.parametrize`.

## Why is this bad?
The `argnames` argument of `pytest.mark.parametrize` takes a string or
a sequence of strings. For a single parameter, it's preferable to use a
string. For multiple parameters, it's preferable to use the style
configured via the [`lint.flake8-pytest-style.parametrize-names-type`] setting.

## Example

```python
import pytest


# single parameter, always expecting string
@pytest.mark.parametrize(("param",), [1, 2, 3])
def test_foo(param): ...
```