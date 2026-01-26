# a7046c18:packages_core_python_.venv_bin_ruff:35851-36000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35851-36000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    except ZeroDivisionError as exc:
        raise FasterThanLightError from exc
```

Or, using the Google docstring format:
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
- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)
## What it does
Checks for undocumented public package definitions.

## Why is this bad?
Public packages should be documented via docstrings to outline their
purpose and contents.

Generally, package docstrings should list the modules and subpackages that
are exported by the package.

If the codebase adheres to a standard format for package docstrings, follow
that format for consistency.

## Example
```python
__all__ = ["Player", "Game"]
```

Use instead:
```python
"""Game and player management package.

This package provides classes for managing players and games.
"""

__all__ = ["player", "game"]
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)
## What it does
Checks for undocumented magic method definitions.

## Why is this bad?
Magic methods (methods with names that start and end with double
underscores) are used to implement operator overloading and other special
behavior. Such methods should be documented via docstrings to
outline their behavior.

Generally, magic method docstrings should describe the method's behavior,
arguments, side effects, exceptions, return values, and any other
information that may be relevant to the user.

If the codebase adheres to a standard format for method docstrings, follow
that format for consistency.

## Example
```python
class Cat(Animal):
    def __str__(self) -> str:
        return f"Cat: {self.name}"


cat = Cat("Dusty")
print(cat)  # "Cat: Dusty"
```

Use instead:
```python
class Cat(Animal):
    def __str__(self) -> str:
        """Return a string representation of the cat."""
        return f"Cat: {self.name}"


cat = Cat("Dusty")
print(cat)  # "Cat: Dusty"
```

## Options
- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)
## What it does
Checks for undocumented public class definitions, for nested classes.

## Why is this bad?
Public classes should be documented via docstrings to outline their
purpose and behavior.

Nested classes do not inherit the docstring of their enclosing class, so
they should have their own docstrings.

If the codebase adheres to a standard format for class docstrings, follow
that format for consistency.

## Example

```python
class Foo:
    """Class Foo."""

    class Bar: ...


bar = Foo.Bar()
bar.__doc__  # None
```

Use instead:

```python
class Foo:
    """Class Foo."""

    class Bar:
```