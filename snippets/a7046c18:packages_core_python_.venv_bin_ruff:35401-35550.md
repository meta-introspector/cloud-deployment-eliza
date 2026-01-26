# a7046c18:packages_core_python_.venv_bin_ruff:35401-35550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35401-35550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
def count_to_n(n: int) -> int:
    """Generate integers up to *n*.

    Args:
        n: The number at which to stop counting.
    """
    for i in range(1, n + 1):
        yield i
```

Use instead:
```python
def count_to_n(n: int) -> int:
    """Generate integers up to *n*.

    Args:
        n: The number at which to stop counting.

    Yields:
        int: The number we're at in the count.
    """
    for i in range(1, n + 1):
        yield i
```

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
## What it does
Checks for function docstrings with unnecessary "Yields" sections.

## Why is this bad?
A function that doesn't yield anything should not have a "Yields" section
in its docstring.

This rule is not enforced for abstract methods. It is also ignored for
"stub functions": functions where the body only consists of `pass`, `...`,
`raise NotImplementedError`, or similar.

## Example
```python
def say_hello(n: int) -> None:
    """Says hello to the user.

    Args:
        n: Number of times to say hello.

    Yields:
        Doesn't yield anything.
    """
    for _ in range(n):
        print("Hello!")
```

Use instead:
```python
def say_hello(n: int) -> None:
    """Says hello to the user.

    Args:
        n: Number of times to say hello.
    """
    for _ in range(n):
        print("Hello!")
```

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
## What it does
Checks for function docstrings that do not document all explicitly raised
exceptions.

## Why is this bad?
A function should document all exceptions that are directly raised in some
circumstances. Failing to document an exception that could be raised
can be misleading to users and/or a sign of incomplete documentation.

This rule is not enforced for abstract methods. It is also ignored for
"stub functions": functions where the body only consists of `pass`, `...`,
`raise NotImplementedError`, or similar.

## Example
```python
class FasterThanLightError(ArithmeticError): ...


def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.
        time: Time spent traveling.

    Returns:
        Speed as distance divided by time.
    """
    try:
        return distance / time
    except ZeroDivisionError as exc:
        raise FasterThanLightError from exc
```

Use instead:
```python
class FasterThanLightError(ArithmeticError): ...


def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.
        time: Time spent traveling.

    Returns:
        Speed as distance divided by time.

    Raises:
        FasterThanLightError: If speed is greater than the speed of light.
    """
    try:
        return distance / time
    except ZeroDivisionError as exc:
        raise FasterThanLightError from exc
```

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
## What it does
Checks for function docstrings that state that exceptions could be raised
even though they are not directly raised in the function body.

## Why is this bad?
Some conventions prefer non-explicit exceptions be omitted from the
docstring.

This rule is not enforced for abstract methods. It is also ignored for
"stub functions": functions where the body only consists of `pass`, `...`,
`raise NotImplementedError`, or similar.

## Example
```python
```