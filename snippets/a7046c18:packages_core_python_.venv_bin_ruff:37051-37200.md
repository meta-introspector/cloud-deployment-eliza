# a7046c18:packages_core_python_.venv_bin_ruff:37051-37200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:37051-37200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# The `Parameters`, `Returns` and `Raises` section headers are all followed
# by a colon in this function's docstring:
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Parameters:
    -----------
    distance : float
        Distance traveled.
    time : float
        Time spent traveling.

    Returns:
    --------
    float
        Speed as distance divided by time.

    Raises:
    -------
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
Checks for section headers in docstrings that are not followed by
underlines.

## Why is this bad?
This rule enforces a consistent style for multiline numpy-style docstrings,
and helps prevent incorrect syntax in docstrings using reStructuredText.

Multiline numpy-style docstrings are typically composed of a summary line,
followed by a blank line, followed by a series of sections. Each section
has a section header and a section body, and the header should be followed
by a series of underline characters in the following line.

This rule enforces a consistent style for multiline numpy-style docstrings
with sections. If your docstring uses reStructuredText, the rule also
helps protect against incorrect reStructuredText syntax, which would cause
errors if you tried to use a tool such as Sphinx to generate documentation
from the docstring.

This rule is enabled when using the `numpy` convention, and disabled
when using the `google` or `pep257` conventions.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Parameters

    distance : float
        Distance traveled.
    time : float
        Time spent traveling.

    Returns

    float
        Speed as distance divided by time.

    Raises

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
Checks for section underlines in docstrings that are not on the line
```