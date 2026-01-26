# a7046c18:packages_core_python_.venv_bin_ruff:48301-48450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:48301-48450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
authors = [
  { name = "Ferris the Crab", email = "ferris@example.org" }
]
```

## References
- [Specification of `[project]` in pyproject.toml](https://packaging.python.org/en/latest/specifications/declaring-project-metadata/)
- [Specification of `[build-system]` in pyproject.toml](https://peps.python.org/pep-0518/)
- [Draft but implemented license declaration extensions](https://peps.python.org/pep-0639)
## What it does
Checks for code that raises `Exception` or `BaseException` directly.

## Why is this bad?
Handling such exceptions requires the use of `except Exception` or
`except BaseException`. These will capture almost _any_ raised exception,
including failed assertions, division by zero, and more.

Prefer to raise your own exception, or a more specific built-in
exception, so that you can avoid over-capturing exceptions that you
don't intend to handle.

## Example
```python
def main_function():
    if not cond:
        raise Exception()


def consumer_func():
    try:
        do_step()
        prepare()
        main_function()
    except Exception:
        logger.error("Oops")
```

Use instead:
```python
def main_function():
    if not cond:
        raise CustomException()


def consumer_func():
    try:
        do_step()
        prepare()
        main_function()
    except CustomException:
        logger.error("Main function failed")
    except Exception:
        logger.error("Oops")
```
## What it does
Checks for long exception messages that are not defined in the exception
class itself.

## Why is this bad?
By formatting an exception message at the `raise` site, the exception class
becomes less reusable, and may now raise inconsistent messages depending on
where it is raised.

If the exception message is instead defined within the exception class, it
will be consistent across all `raise` invocations.

This rule is not enforced for some built-in exceptions that are commonly
raised with a message and would be unusual to subclass, such as
`NotImplementedError`.

## Example
```python
class CantBeNegative(Exception):
    pass


def foo(x):
    if x < 0:
        raise CantBeNegative(f"{x} is negative")
```

Use instead:
```python
class CantBeNegative(Exception):
    def __init__(self, number):
        super().__init__(f"{number} is negative")


def foo(x):
    if x < 0:
        raise CantBeNegative(x)
```
## What it does
Checks for type checks that do not raise `TypeError`.

## Why is this bad?
The Python documentation states that `TypeError` should be raised upon
encountering an inappropriate type.

## Example
```python
def foo(n: int):
    if isinstance(n, int):
        pass
    else:
        raise ValueError("n must be an integer")
```

Use instead:
```python
def foo(n: int):
    if isinstance(n, int):
        pass
    else:
        raise TypeError("n must be an integer")
```

## References
- [Python documentation: `TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError)
## Removed
This rule is identical to [B904] which should be used instead.

## What it does
Checks for exceptions that are re-raised without specifying the cause via
the `from` keyword.

## Why is this bad?
The `from` keyword sets the `__cause__` attribute of the exception, which
stores the "cause" of the exception. The availability of an exception
"cause" is useful for debugging.

## Example
```python
def reciprocal(n):
    try:
        return 1 / n
    except ZeroDivisionError:
        raise ValueError()
```

Use instead:
```python
def reciprocal(n):
    try:
        return 1 / n
    except ZeroDivisionError as exc:
        raise ValueError() from exc
```

## References
```