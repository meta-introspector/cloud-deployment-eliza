# a7046c18:packages_core_python_.venv_bin_ruff:28501-28650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28501-28650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

def test_foo():
    with pytest.warns(Warning, match="expected message"):
        ...
```

## Options
- `lint.flake8-pytest-style.warns-require-match-for`
- `lint.flake8-pytest-style.warns-extend-require-match-for`

## References
- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)
## What it does
Checks for `pytest.warns` context managers with multiple statements.

This rule allows `pytest.warns` bodies to contain `for`
loops with empty bodies (e.g., `pass` or `...` statements), to test
iterator behavior.

## Why is this bad?
When `pytest.warns` is used as a context manager and contains multiple
statements, it can lead to the test passing when it should instead fail.

A `pytest.warns` context manager should only contain a single
simple statement that triggers the expected warning.


## Example
```python
import pytest


def test_foo_warns():
    with pytest.warns(Warning):
        setup()  # False negative if setup triggers a warning but foo does not.
        foo()
```

Use instead:
```python
import pytest


def test_foo_warns():
    setup()
    with pytest.warns(Warning):
        foo()
```

## References
- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)
## What it does
Checks for inline strings that use single quotes or double quotes,
depending on the value of the [`lint.flake8-quotes.inline-quotes`] option.

## Why is this bad?
Consistency is good. Use either single or double quotes for inline
strings, but be consistent.

## Example
```python
foo = 'bar'
```

Assuming `inline-quotes` is set to `double`, use instead:
```python
foo = "bar"
```

## Options
- `lint.flake8-quotes.inline-quotes`

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent quotes for inline strings, making the rule
redundant.

[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for multiline strings that use single quotes or double quotes,
depending on the value of the [`lint.flake8-quotes.multiline-quotes`]
setting.

## Why is this bad?
Consistency is good. Use either single or double quotes for multiline
strings, but be consistent.

## Example
```python
foo = '''
bar
'''
```

Assuming `multiline-quotes` is set to `double`, use instead:
```python
foo = """
bar
"""
```

## Options
- `lint.flake8-quotes.multiline-quotes`

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces double quotes for multiline strings, making the rule
redundant.

[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for docstrings that use single quotes or double quotes, depending
on the value of the [`lint.flake8-quotes.docstring-quotes`] setting.

## Why is this bad?
Consistency is good. Use either single or double quotes for docstring
strings, but be consistent.

## Example
```python
'''
bar
'''
```

Assuming `docstring-quotes` is set to `double`, use instead:
```python
"""
bar
"""
```

## Options
- `lint.flake8-quotes.docstring-quotes`

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces double quotes for docstrings, making the rule
redundant.

[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for strings that include escaped quotes, and suggests changing
the quote style to avoid the need to escape them.

## Why is this bad?
It's preferable to avoid escaped quotes in strings. By changing the
outer quote style, you can avoid escaping inner quotes.

## Example
```