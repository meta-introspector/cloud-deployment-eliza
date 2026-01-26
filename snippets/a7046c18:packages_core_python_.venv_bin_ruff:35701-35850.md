# a7046c18:packages_core_python_.venv_bin_ruff:35701-35850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35701-35850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    Attributes:
        name: The name of the player.
        points: The number of points the player has.
    """

    def __init__(self, name: str, points: int = 0) -> None:
        self.name: str = name
        self.points: int = points

    def add_points(self, points: int) -> None:
        self.points += points
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for undocumented public method definitions.

## Why is this bad?
Public methods should be documented via docstrings to outline their purpose
and behavior.

Generally, a method docstring should describe the method's behavior,
arguments, side effects, exceptions, return values, and any other
information that may be relevant to the user.

If the codebase adheres to a standard format for method docstrings, follow
that format for consistency.

This rule exempts methods decorated with [`@typing.override`][override],
since it is a common practice to document a method on a superclass but not
on an overriding method in a subclass.

## Example

```python
class Cat(Animal):
    def greet(self, happy: bool = True):
        if happy:
            print("Meow!")
        else:
            raise ValueError("Tried to greet an unhappy cat.")
```

Use instead (in the NumPy docstring format):

```python
class Cat(Animal):
    def greet(self, happy: bool = True):
        """Print a greeting from the cat.

        Parameters
        ----------
        happy : bool, optional
            Whether the cat is happy, is True by default.

        Raises
        ------
        ValueError
            If the cat is not happy.
        """
        if happy:
            print("Meow!")
        else:
            raise ValueError("Tried to greet an unhappy cat.")
```

Or (in the Google docstring format):

```python
class Cat(Animal):
    def greet(self, happy: bool = True):
        """Print a greeting from the cat.

        Args:
            happy: Whether the cat is happy, is True by default.

        Raises:
            ValueError: If the cat is not happy.
        """
        if happy:
            print("Meow!")
        else:
            raise ValueError("Tried to greet an unhappy cat.")
```

## Options
- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [PEP 287 – reStructuredText Docstring Format](https://peps.python.org/pep-0287/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for undocumented public function definitions.

## Why is this bad?
Public functions should be documented via docstrings to outline their
purpose and behavior.

Generally, a function docstring should describe the function's behavior,
arguments, side effects, exceptions, return values, and any other
information that may be relevant to the user.

If the codebase adheres to a standard format for function docstrings, follow
that format for consistency.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    try:
        return distance / time
    except ZeroDivisionError as exc:
        raise FasterThanLightError from exc
```

Use instead (using the NumPy docstring format):
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
```