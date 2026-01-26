# a7046c18:packages_core_python_.venv_bin_ruff:35251-35400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35251-35400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
value = "new line\nand invalid escape \_ here"
```

Use instead:
```python
value = "new line\nand invalid escape \\_ here"
```

## References
- [Python documentation: String and Bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)
## What it does
Checks for function docstrings that include parameters which are not
in the function signature.

## Why is this bad?
If a docstring documents a parameter which is not in the function signature,
it can be misleading to users and/or a sign of incomplete documentation or
refactors.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.
        time: Time spent traveling.
        acceleration: Rate of change of speed.

    Returns:
        Speed as distance divided by time.
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

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
## What it does
Checks for functions with `return` statements that do not have "Returns"
sections in their docstrings.

## Why is this bad?
A missing "Returns" section is a sign of incomplete documentation.

This rule is not enforced for abstract methods or functions that only return
`None`. It is also ignored for "stub functions": functions where the body only
consists of `pass`, `...`, `raise NotImplementedError`, or similar.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
    """Calculate speed as distance divided by time.

    Args:
        distance: Distance traveled.
        time: Time spent traveling.
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

## Options

- `lint.pydoclint.ignore-one-line-docstrings`
- `lint.pydocstyle.convention`
- `lint.pydocstyle.property-decorators`
## What it does
Checks for function docstrings with unnecessary "Returns" sections.

## Why is this bad?
A function without an explicit `return` statement should not have a
"Returns" section in its docstring.

This rule is not enforced for abstract methods. It is also ignored for
"stub functions": functions where the body only consists of `pass`, `...`,
`raise NotImplementedError`, or similar.

## Example
```python
def say_hello(n: int) -> None:
    """Says hello to the user.

    Args:
        n: Number of times to say hello.

    Returns:
        Doesn't return anything.
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
Checks for functions with `yield` statements that do not have "Yields" sections in
their docstrings.

## Why is this bad?
A missing "Yields" section is a sign of incomplete documentation.

This rule is not enforced for abstract methods or functions that only yield `None`.
It is also ignored for "stub functions": functions where the body only consists
of `pass`, `...`, `raise NotImplementedError`, or similar.
```