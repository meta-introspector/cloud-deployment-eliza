# a7046c18:packages_core_python_.venv_bin_ruff:28351-28500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28351-28500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
@pytest.fixture()
def b(a):
    pass
```

## References
- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)
## What it does
Checks for `@pytest.mark.usefixtures()` decorators that aren't passed any
arguments.

## Why is this bad?
A `@pytest.mark.usefixtures()` decorator that isn't passed any arguments is
useless and should be removed.

## Example

```python
import pytest


@pytest.mark.usefixtures()
def test_something(): ...
```

Use instead:

```python
def test_something(): ...
```

## References
- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)
## What it does
Checks for uses of exception-related assertion methods from the `unittest`
module.

## Why is this bad?
To enforce the assertion style recommended by `pytest`, `pytest.raises` is
preferred over the exception-related assertion methods in `unittest`, like
`assertRaises`.

## Example
```python
import unittest


class TestFoo(unittest.TestCase):
    def test_foo(self):
        with self.assertRaises(ValueError):
            raise ValueError("foo")
```

Use instead:
```python
import unittest
import pytest


class TestFoo(unittest.TestCase):
    def test_foo(self):
        with pytest.raises(ValueError):
            raise ValueError("foo")
```

## References
- [`pytest` documentation: Assertions about expected exceptions](https://docs.pytest.org/en/latest/how-to/assert.html#assertions-about-expected-exceptions)
## What it does
Checks for parameters of test functions with default arguments.

## Why is this bad?
Such a parameter will always have the default value during the test
regardless of whether a fixture with the same name is defined.

## Example

```python
def test_foo(a=1): ...
```

Use instead:

```python
def test_foo(a): ...
```

## Fix safety
This rule's fix is marked as unsafe, as modifying a function signature can
change the behavior of the code.

## References
- [Original Pytest issue](https://github.com/pytest-dev/pytest/issues/12693)
## What it does
Checks for `pytest.warns` calls without an expected warning.

## Why is this bad?
`pytest.warns` expects to receive an expected warning as its first
argument. If omitted, the `pytest.warns` call will fail at runtime.

## Example
```python
import pytest


def test_foo():
    with pytest.warns():
        do_something()
```

Use instead:
```python
import pytest


def test_foo():
    with pytest.warns(SomeWarning):
        do_something()
```

## References
- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)
## What it does
Checks for `pytest.warns` calls without a `match` parameter.

## Why is this bad?
`pytest.warns(Warning)` will catch any `Warning` and may catch warnings that
are unrelated to the code under test. To avoid this, `pytest.warns` should
be called with a `match` parameter. The warning names that require a `match`
parameter can be configured via the
[`lint.flake8-pytest-style.warns-require-match-for`] and
[`lint.flake8-pytest-style.warns-extend-require-match-for`] settings.

## Example
```python
import pytest


def test_foo():
    with pytest.warns(Warning):
        ...

    # empty string is also an error
    with pytest.warns(Warning, match=""):
        ...
```

Use instead:
```python
import pytest

```