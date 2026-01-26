# a7046c18:packages_core_python_.venv_bin_ruff:27601-27750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:27601-27750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```


# multiple parameters, expecting tuple
@pytest.mark.parametrize(["param1", "param2"], [(1, 2), (3, 4)])
def test_bar(param1, param2): ...


# multiple parameters, expecting tuple
@pytest.mark.parametrize("param1,param2", [(1, 2), (3, 4)])
def test_baz(param1, param2): ...
```

Use instead:

```python
import pytest


@pytest.mark.parametrize("param", [1, 2, 3])
def test_foo(param): ...


@pytest.mark.parametrize(("param1", "param2"), [(1, 2), (3, 4)])
def test_bar(param1, param2): ...
```

## Options
- `lint.flake8-pytest-style.parametrize-names-type`

## References
- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)
## What it does
Checks for the type of parameter values passed to `pytest.mark.parametrize`.

## Why is this bad?
The `argvalues` argument of `pytest.mark.parametrize` takes an iterator of
parameter values, which can be provided as lists or tuples.

To aid in readability, it's recommended to use a consistent style for the
list of values rows, and, in the case of multiple parameters, for each row
of values.

The style for the list of values rows can be configured via the
[`lint.flake8-pytest-style.parametrize-values-type`] setting, while the
style for each row of values can be configured via the
[`lint.flake8-pytest-style.parametrize-values-row-type`] setting.

For example, [`lint.flake8-pytest-style.parametrize-values-type`] will lead to
the following expectations:

- `tuple`: `@pytest.mark.parametrize("value", ("a", "b", "c"))`
- `list`: `@pytest.mark.parametrize("value", ["a", "b", "c"])`

Similarly, [`lint.flake8-pytest-style.parametrize-values-row-type`] will lead to
the following expectations:

- `tuple`: `@pytest.mark.parametrize(("key", "value"), [("a", "b"), ("c", "d")])`
- `list`: `@pytest.mark.parametrize(("key", "value"), [["a", "b"], ["c", "d"]])`

## Example

```python
import pytest


# expected list, got tuple
@pytest.mark.parametrize("param", (1, 2))
def test_foo(param): ...


# expected top-level list, got tuple
@pytest.mark.parametrize(
    ("param1", "param2"),
    (
        (1, 2),
        (3, 4),
    ),
)
def test_bar(param1, param2): ...


# expected individual rows to be tuples, got lists
@pytest.mark.parametrize(
    ("param1", "param2"),
    [
        [1, 2],
        [3, 4],
    ],
)
def test_baz(param1, param2): ...
```

Use instead:

```python
import pytest


@pytest.mark.parametrize("param", [1, 2, 3])
def test_foo(param): ...


@pytest.mark.parametrize(("param1", "param2"), [(1, 2), (3, 4)])
def test_bar(param1, param2): ...
```

## Options
- `lint.flake8-pytest-style.parametrize-values-type`
- `lint.flake8-pytest-style.parametrize-values-row-type`

## References
- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)
## What it does
Checks for mocked calls that use a dummy `lambda` function instead of
`return_value`.

## Why is this bad?
When patching calls, an explicit `return_value` better conveys the intent
than a `lambda` function, assuming the `lambda` does not use the arguments
passed to it.

`return_value` is also robust to changes in the patched function's
signature, and enables additional assertions to verify behavior. For
example, `return_value` allows for verification of the number of calls or
the arguments passed to the patched function via `assert_called_once_with`
and related methods.

## Example
```python
def test_foo(mocker):
    mocker.patch("module.target", lambda x, y: 7)
```

Use instead:
```python
def test_foo(mocker):
    mocker.patch("module.target", return_value=7)

    # If the lambda makes use of the arguments, no diagnostic is emitted.
    mocker.patch("module.other_target", lambda x, y: x)
```

## References
- [Python documentation: `unittest.mock.patch`](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.patch)
- [PyPI: `pytest-mock`](https://pypi.org/project/pytest-mock/)
## What it does
Checks for uses of assertion methods from the `unittest` module.

## Why is this bad?
To make use of `pytest`'s assertion rewriting, a regular `assert` statement
```