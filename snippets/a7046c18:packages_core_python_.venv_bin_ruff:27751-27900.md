# a7046c18:packages_core_python_.venv_bin_ruff:27751-27900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27751-27900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
is preferred over `unittest`'s assertion methods.

## Example
```python
import unittest


class TestFoo(unittest.TestCase):
    def test_foo(self):
        self.assertEqual(a, b)
```

Use instead:
```python
import unittest


class TestFoo(unittest.TestCase):
    def test_foo(self):
        assert a == b
```

## References
- [`pytest` documentation: Assertion introspection details](https://docs.pytest.org/en/7.1.x/how-to/assert.html#assertion-introspection-details)
## What it does
Checks for `pytest.raises` calls without an expected exception.

## Why is this bad?
`pytest.raises` expects to receive an expected exception as its first
argument. If omitted, the `pytest.raises` call will fail at runtime.
The rule will also accept calls without an expected exception but with
`match` and/or `check` keyword arguments, which are also valid after
pytest version 8.4.0.

## Example
```python
import pytest


def test_foo():
    with pytest.raises():
        do_something()
```

Use instead:
```python
import pytest


def test_foo():
    with pytest.raises(SomeException):
        do_something()
```

## References
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
## What it does
Checks for `pytest.raises` calls without a `match` parameter.

## Why is this bad?
`pytest.raises(Error)` will catch any `Error` and may catch errors that are
unrelated to the code under test. To avoid this, `pytest.raises` should be
called with a `match` parameter. The exception names that require a `match`
parameter can be configured via the
[`lint.flake8-pytest-style.raises-require-match-for`] and
[`lint.flake8-pytest-style.raises-extend-require-match-for`] settings.

## Example
```python
import pytest


def test_foo():
    with pytest.raises(ValueError):
        ...

    # empty string is also an error
    with pytest.raises(ValueError, match=""):
        ...
```

Use instead:
```python
import pytest


def test_foo():
    with pytest.raises(ValueError, match="expected message"):
        ...
```

## Options
- `lint.flake8-pytest-style.raises-require-match-for`
- `lint.flake8-pytest-style.raises-extend-require-match-for`

## References
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
## What it does
Checks for `pytest.raises` context managers with multiple statements.

This rule allows `pytest.raises` bodies to contain `for`
loops with empty bodies (e.g., `pass` or `...` statements), to test
iterator behavior.

## Why is this bad?
When a `pytest.raises` is used as a context manager and contains multiple
statements, it can lead to the test passing when it actually should fail.

A `pytest.raises` context manager should only contain a single simple
statement that raises the expected exception.

## Example
```python
import pytest


def test_foo():
    with pytest.raises(MyError):
        setup()
        func_to_test()  # not executed if `setup()` raises `MyError`
        assert foo()  # not executed
```

Use instead:
```python
import pytest


def test_foo():
    setup()
    with pytest.raises(MyError):
        func_to_test()
    assert foo()
```

## References
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
## What it does
Checks for incorrect import of pytest.

## Why is this bad?
For consistency, `pytest` should be imported as `import pytest` and its members should be
accessed in the form of `pytest.xxx.yyy` for consistency

## Example
```python
import pytest as pt
from pytest import fixture
```

```