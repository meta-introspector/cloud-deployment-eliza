# a7046c18:packages_core_python_.venv_bin_ruff:36001-36150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36001-36150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        """Class Bar."""


bar = Foo.Bar()
bar.__doc__  # "Class Bar."
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)
## What it does
Checks for public `__init__` method definitions that are missing
docstrings.

## Why is this bad?
Public `__init__` methods are used to initialize objects. `__init__`
methods should be documented via docstrings to describe the method's
behavior, arguments, side effects, exceptions, and any other information
that may be relevant to the user.

If the codebase adheres to a standard format for `__init__` method docstrings,
follow that format for consistency.

## Example
```python
class City:
    def __init__(self, name: str, population: int) -> None:
        self.name: str = name
        self.population: int = population
```

Use instead:
```python
class City:
    def __init__(self, name: str, population: int) -> None:
        """Initialize a city with a name and population."""
        self.name: str = name
        self.population: int = population
```

## Options
- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)
## What it does
Checks for single-line docstrings that are broken across multiple lines.

## Why is this bad?
[PEP 257] recommends that docstrings that _can_ fit on one line should be
formatted on a single line, for consistency and readability.

## Example
```python
def average(values: list[float]) -> float:
    """
    Return the mean of the given values.
    """
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Fix safety
The fix is marked as unsafe because it could affect tools that parse docstrings,
documentation generators, or custom introspection utilities that rely on
specific docstring formatting.

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for docstrings on functions that are separated by one or more blank
lines from the function definition.

## Why is this bad?
Remove any blank lines between the function definition and its docstring,
for consistency.

## Example
```python
def average(values: list[float]) -> float:

    """Return the mean of the given values."""
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
Checks for docstrings on functions that are separated by one or more blank
lines from the function body.

## Why is this bad?
Remove any blank lines between the function body and the function
docstring, for consistency.

## Example
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""

    return sum(values) / len(values)
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
    return sum(values) / len(values)
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for docstrings on class definitions that are not preceded by a
```