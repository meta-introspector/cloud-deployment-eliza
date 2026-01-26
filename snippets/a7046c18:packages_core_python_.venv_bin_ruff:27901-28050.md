# a7046c18:packages_core_python_.venv_bin_ruff:27901-28050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27901-28050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Use instead:
```python
import pytest
```
## What it does
Checks for duplicate test cases in `pytest.mark.parametrize`.

## Why is this bad?
Duplicate test cases are redundant and should be removed.

## Example

```python
import pytest


@pytest.mark.parametrize(
    ("param1", "param2"),
    [
        (1, 2),
        (1, 2),
    ],
)
def test_foo(param1, param2): ...
```

Use instead:

```python
import pytest


@pytest.mark.parametrize(
    ("param1", "param2"),
    [
        (1, 2),
    ],
)
def test_foo(param1, param2): ...
```

## Fix safety
This rule's fix is marked as unsafe, as tests that rely on mutable global
state may be affected by removing duplicate test cases.

## References
- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)
## What it does
Checks for `assert` statements whose test expression is a falsy value.

## Why is this bad?
`pytest.fail` conveys the intent more clearly than `assert falsy_value`.

## Example
```python
def test_foo():
    if some_condition:
        assert False, "some_condition was True"
```

Use instead:
```python
import pytest


def test_foo():
    if some_condition:
        pytest.fail("some_condition was True")
    ...
```

## References
- [`pytest` documentation: `pytest.fail`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fail)
## What it does
Checks for `pytest.fail` calls without a message.

## Why is this bad?
`pytest.fail` calls without a message make it harder to understand and debug test failures.

## Example
```python
import pytest


def test_foo():
    pytest.fail()


def test_bar():
    pytest.fail("")


def test_baz():
    pytest.fail(reason="")
```

Use instead:
```python
import pytest


def test_foo():
    pytest.fail("...")


def test_bar():
    pytest.fail(reason="...")
```

## References
- [`pytest` documentation: `pytest.fail`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fail)
## What it does
Checks for `assert` statements in `except` clauses.

## Why is this bad?
When testing for exceptions, `pytest.raises()` should be used instead of
`assert` statements in `except` clauses, as it's more explicit and
idiomatic. Further, `pytest.raises()` will fail if the exception is _not_
raised, unlike the `assert` statement.

## Example
```python
def test_foo():
    try:
        1 / 0
    except ZeroDivisionError as e:
        assert e.args
```

Use instead:
```python
import pytest


def test_foo():
    with pytest.raises(ZeroDivisionError) as exc_info:
        1 / 0
    assert exc_info.value.args
```

## References
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
## What it does
Checks for assertions that combine multiple independent conditions.

## Why is this bad?
Composite assertion statements are harder to debug upon failure, as the
failure message will not indicate which condition failed.

## Example
```