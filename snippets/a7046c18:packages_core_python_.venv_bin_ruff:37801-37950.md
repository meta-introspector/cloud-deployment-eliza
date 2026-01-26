# a7046c18:packages_core_python_.venv_bin_ruff:37801-37950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:37801-37950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    Raises
        FasterThanLightError: If speed is greater than the speed of light.
    """
    try:
        return distance / time
    except ZeroDivisionError as exc:
        raise FasterThanLightError from exc
```

Use instead:
```python
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
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [Google Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for function docstrings that do not include documentation for all
parameters in the function.

## Why is this bad?
This rule helps prevent you from leaving Google-style docstrings unfinished
or incomplete. Multiline Google-style docstrings should describe all
parameters for the function they are documenting.

Multiline docstrings are typically composed of a summary line, followed by
a blank line, followed by a series of sections, each with a section header
and a section body. Function docstrings often include a section for
function arguments; this rule is concerned with that section only.
Note that this rule only checks docstrings with an arguments (e.g. `Args`) section.

This rule is enabled when using the `google` convention, and disabled when
using the `pep257` and `numpy` conventions.

Parameters annotated with `typing.Unpack` are exempt from this rule.
This follows the Python typing specification for unpacking keyword arguments.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.

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

Use instead:
```python
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
- `lint.pydocstyle.convention`
- `lint.pydocstyle.ignore-var-parameters`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- [Python - Unpack for keyword arguments](https://typing.python.org/en/latest/spec/callables.html#unpack-kwargs)
## What it does
Checks for `@overload` function definitions that contain a docstring.

## Why is this bad?
The `@overload` decorator is used to define multiple compatible signatures
for a given function, to support type-checking. A series of `@overload`
definitions should be followed by a single non-decorated definition that
contains the implementation of the function.

`@overload` function definitions should not contain a docstring; instead,
the docstring should be placed on the non-decorated definition that contains
the implementation.

## Example

```python
from typing import overload


@overload
def factorial(n: int) -> int:
    """Return the factorial of n."""


@overload
def factorial(n: float) -> float:
    """Return the factorial of n."""


def factorial(n):
    """Return the factorial of n."""


factorial.__doc__  # "Return the factorial of n."
```

Use instead:

```python
from typing import overload


```