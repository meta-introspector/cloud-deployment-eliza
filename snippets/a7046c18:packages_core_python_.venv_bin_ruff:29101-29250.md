# a7046c18:packages_core_python_.venv_bin_ruff:29101-29250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29101-29250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
try:
    1 / 0
except ZeroDivisionError:
    pass
```

Use instead:
```python
import contextlib

with contextlib.suppress(ZeroDivisionError):
    1 / 0
```

## References
- [Python documentation: `contextlib.suppress`](https://docs.python.org/3/library/contextlib.html#contextlib.suppress)
- [Python documentation: `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)
- [a simpler `try`/`except` (and why maybe shouldn't)](https://www.youtube.com/watch?v=MZAJ8qnC7mk)
## What it does
Checks for `return` statements in `try`-`except` and `finally` blocks.

## Why is this bad?
The `return` statement in a `finally` block will always be executed, even if
an exception is raised in the `try` or `except` block. This can lead to
unexpected behavior.

## Example
```python
def squared(n):
    try:
        sqr = n**2
        return sqr
    except Exception:
        return "An exception occurred"
    finally:
        return -1  # Always returns -1.
```

Use instead:
```python
def squared(n):
    try:
        return_value = n**2
    except Exception:
        return_value = "An exception occurred"
    finally:
        return_value = -1
    return return_value
```

## References
- [Python documentation: Defining Clean-up Actions](https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions)
## What it does
Check for `if`-`else`-blocks that can be replaced with a ternary
or binary operator.

The lint is suppressed if the suggested replacement would exceed
the maximum line length configured in [pycodestyle.max-line-length].

## Why is this bad?
`if`-`else`-blocks that assign a value to a variable in both branches can
be expressed more concisely by using a ternary or binary operator.

## Example

```python
if foo:
    bar = x
else:
    bar = y
```

Use instead:
```python
bar = x if foo else y
```

Or:

```python
if cond:
    z = cond
else:
    z = other_cond
```

Use instead:

```python
z = cond or other_cond
```

## Known issues
This is an opinionated style rule that may not always be to everyone's
taste, especially for code that makes use of complex `if` conditions.
Ternary operators can also make it harder to measure [code coverage]
with tools that use line profiling.

## Options

- `lint.pycodestyle.max-line-length`
- `indent-width`

## References
- [Python documentation: Conditional expressions](https://docs.python.org/3/reference/expressions.html#conditional-expressions)

[code coverage]: https://github.com/nedbat/coveragepy/issues/509
[pycodestyle.max-line-length]: https://docs.astral.sh/ruff/settings/#lint_pycodestyle_max-line-length
## What it does
Checks for boolean expressions that contain multiple equality comparisons
to the same value.

## Why is this bad?
To check if an object is equal to any one of multiple values, it's more
concise to use the `in` operator with a tuple of values.

## Example
```python
if foo == x or foo == y:
    ...
```

Use instead:
```python
if foo in (x, y):
    ...
```

## References
- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)
## What it does
Checks for `for` loops that can be replaced with a builtin function, like
`any` or `all`.

## Why is this bad?
Using a builtin function is more concise and readable.

## Example
```python
def foo():
    for item in iterable:
        if predicate(item):
            return True
    return False
```

Use instead:
```python
def foo():
    return any(predicate(item) for item in iterable)
```