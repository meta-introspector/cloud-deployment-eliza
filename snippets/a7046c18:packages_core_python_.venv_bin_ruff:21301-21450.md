# a7046c18:packages_core_python_.venv_bin_ruff:21301-21450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21301-21450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for uses of `assert False`.

## Why is this bad?
Python removes `assert` statements when running in optimized mode
(`python -O`), making `assert False` an unreliable means of
raising an `AssertionError`.

Instead, raise an `AssertionError` directly.

## Example
```python
assert False
```

Use instead:
```python
raise AssertionError
```

## Fix safety
This rule's fix is marked as unsafe, as changing an `assert` to a
`raise` will change the behavior of your program when running in
optimized mode (`python -O`).

## References
- [Python documentation: `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
## What it does
Checks for `break`, `continue`, and `return` statements in `finally`
blocks.

## Why is this bad?
The use of `break`, `continue`, and `return` statements in `finally` blocks
can cause exceptions to be silenced.

`finally` blocks execute regardless of whether an exception is raised. If a
`break`, `continue`, or `return` statement is reached in a `finally` block,
any exception raised in the `try` or `except` blocks will be silenced.

## Example
```python
def speed(distance, time):
    try:
        return distance / time
    except ZeroDivisionError:
        raise ValueError("Time cannot be zero")
    finally:
        return 299792458  # `ValueError` is silenced
```

Use instead:
```python
def speed(distance, time):
    try:
        return distance / time
    except ZeroDivisionError:
        raise ValueError("Time cannot be zero")
```

## References
- [Python documentation: The `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)
## What it does
Checks for single-element tuples in exception handlers (e.g.,
`except (ValueError,):`).

Note: Single-element tuples consisting of a starred expression
are allowed.

## Why is this bad?
A tuple with a single element can be more concisely and idiomatically
expressed as a single value.

## Example
```python
try:
    ...
except (ValueError,):
    ...
```

Use instead:
```python
try:
    ...
except ValueError:
    ...
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
## What it does
Checks for exception handlers that catch duplicate exceptions.

## Why is this bad?
Including the same exception multiple times in the same handler is redundant,
as the first exception will catch the exception, making the second exception
unreachable. The same applies to exception hierarchies, as a handler for a
parent exception (like `Exception`) will also catch child exceptions (like
`ValueError`).

## Example
```python
try:
    ...
except (Exception, ValueError):  # `Exception` includes `ValueError`.
    ...
```

Use instead:
```python
try:
    ...
except Exception:
    ...
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)
## What it does
Checks for useless comparisons.

## Why is this bad?
Useless comparisons have no effect on the program, and are often included
by mistake. If the comparison is intended to enforce an invariant, prepend
the comparison with an `assert`. Otherwise, remove it entirely.

## Example
```python
foo == bar
```

Use instead:
```python
assert foo == bar, "`foo` and `bar` should be equal."
```

## Notebook behavior
For Jupyter Notebooks, this rule is not applied to the last top-level expression in a cell.
This is because it's common to have a notebook cell that ends with an expression,
which will result in the `repr` of the evaluated expression being printed as the cell's output.

## References
- [Python documentation: `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
## What it does
Checks for `raise` statements that raise a literal value.

## Why is this bad?
`raise` must be followed by an exception instance or an exception class,
and exceptions must be instances of `BaseException` or a subclass thereof.
Raising a literal will raise a `TypeError` at runtime.
```