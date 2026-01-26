# a7046c18:packages_core_python_.venv_bin_ruff:28051-28200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28051-28200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
def test_foo():
    assert something and something_else


def test_bar():
    assert not (something or something_else)
```

Use instead:
```python
def test_foo():
    assert something
    assert something_else


def test_bar():
    assert not something
    assert not something_else
```
## What it does
Checks for `pytest` test functions that should be decorated with
`@pytest.mark.usefixtures`.

## Why is this bad?
In `pytest`, fixture injection is used to activate fixtures in a test
function.

Fixtures can be injected either by passing them as parameters to the test
function, or by using the `@pytest.mark.usefixtures` decorator.

If the test function depends on the fixture being activated, but does not
use it in the test body or otherwise rely on its return value, prefer
the `@pytest.mark.usefixtures` decorator, to make the dependency explicit
and avoid the confusion caused by unused arguments.

## Example

```python
import pytest


@pytest.fixture
def _patch_something(): ...


def test_foo(_patch_something): ...
```

Use instead:

```python
import pytest


@pytest.fixture
def _patch_something(): ...


@pytest.mark.usefixtures("_patch_something")
def test_foo(): ...
```

## References
- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)
## What it does
Checks for `pytest.yield_fixture` usage.

## Why is this bad?
`pytest.yield_fixture` is deprecated. `pytest.fixture` should be used instead.

## Example
```python
import pytest


@pytest.yield_fixture()
def my_fixture():
    obj = SomeClass()
    yield obj
    obj.cleanup()
```

Use instead:
```python
import pytest


@pytest.fixture()
def my_fixture():
    obj = SomeClass()
    yield obj
    obj.cleanup()
```

## References
- [`pytest` documentation: `yield_fixture` functions](https://docs.pytest.org/en/latest/yieldfixture.html)
## What it does
Checks for unnecessary `request.addfinalizer` usages in `pytest` fixtures.

## Why is this bad?
`pytest` offers two ways to perform cleanup in fixture code. The first is
sequential (via the `yield` statement), the second callback-based (via
`request.addfinalizer`).

The sequential approach is more readable and should be preferred, unless
the fixture uses the "factory as fixture" pattern.

## Example
```python
import pytest


@pytest.fixture()
def my_fixture(request):
    resource = acquire_resource()
    request.addfinalizer(resource.release)
    return resource
```

Use instead:
```python
import pytest


@pytest.fixture()
def my_fixture():
    resource = acquire_resource()
    yield resource
    resource.release()


# "factory-as-fixture" pattern
@pytest.fixture()
def my_factory(request):
    def create_resource(arg):
        resource = acquire_resource(arg)
        request.addfinalizer(resource.release)
        return resource

    return create_resource
```

## References
- [`pytest` documentation: Adding finalizers directly](https://docs.pytest.org/en/latest/how-to/fixtures.html#adding-finalizers-directly)
- [`pytest` documentation: Factories as fixtures](https://docs.pytest.org/en/latest/how-to/fixtures.html#factories-as-fixtures)
## What it does
Checks for unnecessary `yield` expressions in `pytest` fixtures.

## Why is this bad?
```