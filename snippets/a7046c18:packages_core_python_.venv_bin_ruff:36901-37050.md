# a7046c18:packages_core_python_.venv_bin_ruff:36901-37050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36901-37050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for docstrings that do not start with a capital letter.

## Why is this bad?
The first non-whitespace character in a docstring should be
capitalized for grammatical correctness and consistency.

## Example
```python
def average(values: list[float]) -> float:
    """return the mean of the given values."""
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for docstrings that start with `This`.

## Why is this bad?
[PEP 257] recommends that the first line of a docstring be written in the
imperative mood, for consistency.

Hint: to rewrite the docstring in the imperative, phrase the first line as
if it were a command.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `numpy`
convention,, and disabled when using the `google` and `pep257` conventions.

## Example
```python
def average(values: list[float]) -> float:
    """This function returns the mean of the given values."""
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Options
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for section headers in docstrings that do not begin with capital
letters.

## Why is this bad?
For stylistic consistency, all section headers in a docstring should be
capitalized.

Multiline docstrings are typically composed of a summary line, followed by
a blank line, followed by a series of sections. Each section typically has
a header and a body.

This rule is enabled when using the `numpy` and `google` conventions, and
disabled when using the `pep257` convention.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    args:
        distance: Distance traveled.
        time: Time spent traveling.

    returns:
        Speed as distance divided by time.

    raises:
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
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for section headers in docstrings that are followed by non-newline
characters.

## Why is this bad?
This rule enforces a consistent style for multiline numpy-style docstrings.

Multiline numpy-style docstrings are typically composed of a summary line,
followed by a blank line, followed by a series of sections. Each section
has a section header and a section body. The section header should be
followed by a newline, rather than by some other character (like a colon).

This rule is enabled when using the `numpy` convention, and disabled
when using the `google` or `pep257` conventions.

## Example
```python
```