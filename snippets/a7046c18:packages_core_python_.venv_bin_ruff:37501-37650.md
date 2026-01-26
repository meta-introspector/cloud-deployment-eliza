# a7046c18:packages_core_python_.venv_bin_ruff:37501-37650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:37501-37650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    time : float
        Time spent traveling.

    Returns
    -------
    float
        Speed as distance divided by time.

    Raises
    ------
    FasterThanLightError
        If speed is greater than the speed of light.
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
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
## What it does
Checks for docstring sections that contain blank lines between a section
header and a section body.

## Why is this bad?
This rule enforces a consistent style for multiline docstrings.

Multiline docstrings are typically composed of a summary line, followed by
a blank line, followed by a series of sections, each with a section header
and a section body. There should be no blank lines between a section header
and a section body.

## Example
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

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for missing blank lines after the last section of a multiline
docstring.

## Why is this bad?
This rule enforces a consistent style for multiline docstrings.

Multiline docstrings are typically composed of a summary line, followed by
a blank line, followed by a series of sections, each with a section header
and a section body.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, the rule is disabled when using the `google`,
`numpy`, and `pep257` conventions.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Parameters
    ----------
    distance : float
        Distance traveled.
    time : float
        Time spent traveling.
    Returns
    -------
    float
        Speed as distance divided by time.
    Raises
    ------
    FasterThanLightError
        If speed is greater than the speed of light.
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

    Parameters
    ----------
    distance : float
        Distance traveled.
    time : float
        Time spent traveling.

    Returns
    -------
    float
        Speed as distance divided by time.

    Raises
    ------
```