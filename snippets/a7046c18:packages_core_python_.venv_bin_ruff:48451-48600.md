# a7046c18:packages_core_python_.venv_bin_ruff:48451-48600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:48451-48600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Python documentation: Exception context](https://docs.python.org/3/library/exceptions.html#exception-context)

[B904]: https://docs.astral.sh/ruff/rules/raise-without-from-inside-except/
## What it does
Checks for needless exception names in `raise` statements.

## Why is this bad?
It's redundant to specify the exception name in a `raise` statement if the
exception is being re-raised.

## Example
```python
def foo():
    try:
        ...
    except ValueError as exc:
        raise exc
```

Use instead:
```python
def foo():
    try:
        ...
    except ValueError:
        raise
```

## Fix safety
This rule's fix is marked as unsafe, as it doesn't properly handle bound
exceptions that are shadowed between the `except` and `raise` statements.
## What it does
Checks for immediate uses of `raise` within exception handlers.

## Why is this bad?
Capturing an exception, only to immediately reraise it, has no effect.
Instead, remove the error-handling code and let the exception propagate
upwards without the unnecessary `try`-`except` block.

## Example
```python
def foo():
    try:
        bar()
    except NotImplementedError:
        raise
```

Use instead:
```python
def foo():
    bar()
```
## What it does
Checks for `return` statements in `try` blocks.

## Why is this bad?
The `try`-`except` statement has an `else` clause for code that should
run _only_ if no exceptions were raised. Returns in `try` blocks may
exhibit confusing or unwanted behavior, such as being overridden by
control flow in `except` and `finally` blocks, or unintentionally
suppressing an exception.

## Example
```python
import logging


def reciprocal(n):
    try:
        rec = 1 / n
        print(f"reciprocal of {n} is {rec}")
        return rec
    except ZeroDivisionError:
        logging.exception("Exception occurred")
        raise
```

Use instead:
```python
import logging


def reciprocal(n):
    try:
        rec = 1 / n
    except ZeroDivisionError:
        logging.exception("Exception occurred")
        raise
    else:
        print(f"reciprocal of {n} is {rec}")
        return rec
```

## References
- [Python documentation: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
## What it does
Checks for `raise` statements within `try` blocks. The only `raise`s
caught are those that throw exceptions caught by the `try` statement itself.

## Why is this bad?
Raising and catching exceptions within the same `try` block is redundant,
as the code can be refactored to avoid the `try` block entirely.

Alternatively, the `raise` can be moved within an inner function, making
the exception reusable across multiple call sites.

## Example
```python
def bar():
    pass


def foo():
    try:
        a = bar()
        if not a:
            raise ValueError
    except ValueError:
        raise
```

Use instead:
```python
def bar():
    raise ValueError


def foo():
    try:
        a = bar()  # refactored `bar` to raise `ValueError`
    except ValueError:
        raise
```
## What it does
Checks for uses of `logging.error` instead of `logging.exception` when
logging an exception.

## Why is this bad?
`logging.exception` logs the exception and the traceback, while
`logging.error` only logs the exception. The former is more appropriate
when logging an exception, as the traceback is often useful for debugging.

## Example
```python
import logging


def func():
    try:
```