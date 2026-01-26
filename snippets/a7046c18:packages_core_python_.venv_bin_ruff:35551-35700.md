# a7046c18:packages_core_python_.venv_bin_ruff:35551-35700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35551-35700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.
        time: Time spent traveling.

    Returns:
        Speed as distance divided by time.

    Raises:
        ZeroDivisionError: Divided by zero.
    """
    return distance / time
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
    """
    return distance / time
```

## Known issues
It may often be desirable to document *all* exceptions that a function
could possibly raise, even those which are not explicitly raised using
`raise` statements in the function body.

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
## What it does
Checks for undocumented public module definitions.

## Why is this bad?
Public modules should be documented via docstrings to outline their purpose
and contents.

Generally, module docstrings should describe the purpose of the module and
list the classes, exceptions, functions, and other objects that are exported
by the module, alongside a one-line summary of each.

If the module is a script, the docstring should be usable as its "usage"
message.

If the codebase adheres to a standard format for module docstrings, follow
that format for consistency.

## Example

```python
class FasterThanLightError(ZeroDivisionError): ...


def calculate_speed(distance: float, time: float) -> float: ...
```

Use instead:

```python
"""Utility functions and classes for calculating speed.

This module provides:
- FasterThanLightError: exception when FTL speed is calculated;
- calculate_speed: calculate speed given distance and time.
"""


class FasterThanLightError(ZeroDivisionError): ...


def calculate_speed(distance: float, time: float) -> float: ...
```

## Notebook behavior
This rule is ignored for Jupyter Notebooks.

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for undocumented public class definitions.

## Why is this bad?
Public classes should be documented via docstrings to outline their purpose
and behavior.

Generally, a class docstring should describe the class's purpose and list
its public attributes and methods.

If the codebase adheres to a standard format for class docstrings, follow
that format for consistency.

## Example
```python
class Player:
    def __init__(self, name: str, points: int = 0) -> None:
        self.name: str = name
        self.points: int = points

    def add_points(self, points: int) -> None:
        self.points += points
```

Use instead (in the NumPy docstring format):
```python
class Player:
    """A player in the game.

    Attributes
    ----------
    name : str
        The name of the player.
    points : int
        The number of points the player has.

    Methods
    -------
    add_points(points: int) -> None
        Add points to the player's score.
    """

    def __init__(self, name: str, points: int = 0) -> None:
        self.name: str = name
        self.points: int = points

    def add_points(self, points: int) -> None:
        self.points += points
```

Or (in the Google docstring format):
```python
class Player:
    """A player in the game.

```