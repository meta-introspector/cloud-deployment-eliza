# a7046c18:packages_core_python_.venv_bin_ruff:41251-41400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41251-41400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        elif letter == "C":
            number = 2.0
        elif letter == "B":
            number = 3.0
        elif letter == "A":
            number = 4.0
        else:
            raise ValueError(f"Invalid grade: {grade}")

        modifier = 0.0
        if letter != "F" and grade[-1] == "+":
            modifier = 0.3
        elif letter != "F" and grade[-1] == "-":
            modifier = -0.3

        numbers.append(max(0.0, min(number + modifier, 4.0)))

    try:
        return sum(numbers) / len(numbers)
    except ZeroDivisionError:  # 13th branch
        return 0
```

Use instead:
```python
def grades_to_average_number(grades):
    grade_values = {"F": 0.0, "E": 0.0, "D": 1.0, "C": 2.0, "B": 3.0, "A": 4.0}
    modifier_values = {"+": 0.3, "-": -0.3}

    numbers = []
    for grade in grades:
        if len(grade) not in {1, 2}:
            raise ValueError(f"Invalid grade: {grade}")

        letter = grade[0]
        if letter not in grade_values:
            raise ValueError(f"Invalid grade: {grade}")
        number = grade_values[letter]

        if len(grade) == 2 and grade[1] not in modifier_values:
            raise ValueError(f"Invalid grade: {grade}")
        modifier = modifier_values.get(grade[-1], 0.0)

        if letter == "F":
            numbers.append(0.0)
        else:
            numbers.append(max(0.0, min(number + modifier, 4.0)))

    try:
        return sum(numbers) / len(numbers)
    except ZeroDivisionError:
        return 0
```

## Options
- `lint.pylint.max-branches`
## What it does
Checks for function definitions that include too many arguments.

By default, this rule allows up to five arguments, as configured by the
[`lint.pylint.max-args`] option.

This rule exempts methods decorated with [`@typing.override`][override].
Changing the signature of a subclass method may cause type checkers to
complain about a violation of the Liskov Substitution Principle if it
means that the method now incompatibly overrides a method defined on a
superclass. Explicitly decorating an overriding method with `@override`
signals to Ruff that the method is intended to override a superclass
method and that a type checker will enforce that it does so; Ruff
therefore knows that it should not enforce rules about methods having
too many arguments.

## Why is this bad?
Functions with many arguments are harder to understand, maintain, and call.
Consider refactoring functions with many arguments into smaller functions
with fewer arguments, or using objects to group related arguments.

## Example
```python
def calculate_position(x_pos, y_pos, z_pos, x_vel, y_vel, z_vel, time):
    new_x = x_pos + x_vel * time
    new_y = y_pos + y_vel * time
    new_z = z_pos + z_vel * time
    return new_x, new_y, new_z
```

Use instead:
```python
from typing import NamedTuple


class Vector(NamedTuple):
    x: float
    y: float
    z: float


def calculate_position(pos: Vector, vel: Vector, time: float) -> Vector:
    return Vector(*(p + v * time for p, v in zip(pos, vel)))
```

## Options
- `lint.pylint.max-args`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for functions that include too many local variables.

By default, this rule allows up to fifteen locals, as configured by the
[`lint.pylint.max-locals`] option.

## Why is this bad?
Functions with many local variables are harder to understand and maintain.

Consider refactoring functions with many local variables into smaller
functions with fewer assignments.

## Options
- `lint.pylint.max-locals`
## What it does
Checks for functions or methods with too many statements.

By default, this rule allows up to 50 statements, as configured by the
[`lint.pylint.max-statements`] option.

## Why is this bad?
Functions or methods with many statements are harder to understand
and maintain.

Instead, consider refactoring the function or method into smaller
functions or methods, or identifying generalizable patterns and
replacing them with generic logic or abstractions.

## Example
```python
def is_even(number: int) -> bool:
    if number == 0:
        return True
    elif number == 1:
        return False
    elif number == 2:
        return True
    elif number == 3:
        return False
    elif number == 4:
        return True
    elif number == 5:
        return False
    else:
        ...
```