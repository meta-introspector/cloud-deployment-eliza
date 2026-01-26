# a7046c18:packages_core_python_.venv_bin_ruff:41701-41850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41701-41850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Why is this bad?
`exit` and `quit` come from the `site` module, which is typically imported
automatically during startup. However, it is not _guaranteed_ to be
imported, and so using these functions may result in a `NameError` at
runtime. Generally, these constants are intended to be used in an interactive
interpreter, and not in programs.

Prefer `sys.exit()`, as the `sys` module is guaranteed to exist in all
contexts.

## Fix safety
This fix is always unsafe. When replacing `exit` or `quit` with `sys.exit`,
the behavior can change in the following ways:

1. If the code runs in an environment where the `site` module is not imported
   (e.g., with `python -S`), the original code would raise a `NameError`, while
   the fixed code would execute normally.

2. `site.exit` and `sys.exit` handle tuple arguments differently. `site.exit`
   treats tuples as regular objects and always returns exit code 1, while `sys.exit`
   interprets tuple contents to determine the exit code: an empty tuple () results in
   exit code 0, and a single-element tuple like (2,) uses that element's value (2) as
   the exit code.

## Example
```python
if __name__ == "__main__":
    exit()
```

Use instead:
```python
import sys

if __name__ == "__main__":
    sys.exit()
```

## References
- [Python documentation: Constants added by the `site` module](https://docs.python.org/3/library/constants.html#constants-added-by-the-site-module)
## What it does
Checks for `if` statements that can be replaced with `min()` or `max()`
calls.

## Why is this bad?
An `if` statement that selects the lesser or greater of two sub-expressions
can be replaced with a `min()` or `max()` call respectively. Where possible,
prefer `min()` and `max()`, as they're more concise and readable than the
equivalent `if` statements.

## Example
```python
if score > highest_score:
    highest_score = score
```

Use instead:
```python
highest_score = max(highest_score, score)
```

## Fix safety
This fix is marked unsafe if it would delete any comments within the replacement range.

An example to illustrate where comments are preserved and where they are not:

```py
a, b = 0, 10

if a >= b: # deleted comment
    # deleted comment
    a = b # preserved comment
```

## References
- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)
- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)
## What it does
Checks for key-based dict accesses during `.items()` iterations.

## Why is this bad?
When iterating over a dict via `.items()`, the current value is already
available alongside its key. Using the key to look up the value is
unnecessary.

## Example
```python
FRUITS = {"apple": 1, "orange": 10, "berry": 22}

for fruit_name, fruit_count in FRUITS.items():
    print(FRUITS[fruit_name])
```

Use instead:
```python
FRUITS = {"apple": 1, "orange": 10, "berry": 22}

for fruit_name, fruit_count in FRUITS.items():
    print(fruit_count)
```
## What it does
Checks for index-based list accesses during `enumerate` iterations.

## Why is this bad?
When iterating over a list with `enumerate`, the current item is already
available alongside its index. Using the index to look up the item is
unnecessary.

## Example
```python
letters = ["a", "b", "c"]

for index, letter in enumerate(letters):
    print(letters[index])
```

Use instead:
```python
letters = ["a", "b", "c"]

for index, letter in enumerate(letters):
    print(letter)
```
## What it does
Checks for the use of unnamed numerical constants ("magic") values in
comparisons.

## Why is this bad?
The use of "magic" values can make code harder to read and maintain, as
readers will have to infer the meaning of the value from the context.
Such values are discouraged by [PEP 8].

For convenience, this rule excludes a variety of common values from the
"magic" value definition, such as `0`, `1`, `""`, and `"__main__"`.

## Example
```python
def apply_discount(price: float) -> float:
    if price <= 100:
        return price / 2
    else:
        return price
```

Use instead:
```python
MAX_DISCOUNT = 100


```