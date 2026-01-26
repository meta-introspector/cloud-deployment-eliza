# a7046c18:packages_core_python_.venv_bin_ruff:21901-22050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21901-22050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
## What it does
Checks for exception handlers that catch non-exception classes.

## Why is this bad?
Catching classes that do not inherit from `BaseException` will raise a
`TypeError`.

## Example
```python
try:
    1 / 0
except 1:
    ...
```

Use instead:
```python
try:
    1 / 0
except ZeroDivisionError:
    ...
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
- [Python documentation: Built-in Exceptions](https://docs.python.org/3/library/exceptions.html#built-in-exceptions)
## What it does
Checks for multiple usage of the generator returned from
`itertools.groupby()`.

## Why is this bad?
Using the generator more than once will do nothing on the second usage.
If that data is needed later, it should be stored as a list.

## Example:
```python
import itertools

for name, group in itertools.groupby(data):
    for _ in range(5):
        do_something_with_the_group(group)
```

Use instead:
```python
import itertools

for name, group in itertools.groupby(data):
    values = list(group)
    for _ in range(5):
        do_something_with_the_group(values)
```
## What it does
Checks for the unintentional use of type annotations.

## Why is this bad?
The use of a colon (`:`) in lieu of an assignment (`=`) can be syntactically valid, but
is almost certainly a mistake when used in a subscript or attribute assignment.

## Example
```python
a["b"]: 1
```

Use instead:
```python
a["b"] = 1
```
## What it does
Checks for set literals that contain duplicate items.

## Why is this bad?
In Python, sets are unordered collections of unique elements. Including a
duplicate item in a set literal is redundant, as the duplicate item will be
replaced with a single item at runtime.

## Example
```python
{1, 2, 3, 1}
```

Use instead:
```python
{1, 2, 3}
```
## What it does
Checks for calls to `re.sub`, `re.subn`, and `re.split` that pass `count`,
`maxsplit`, or `flags` as positional arguments.

## Why is this bad?
Passing `count`, `maxsplit`, or `flags` as positional arguments to
`re.sub`, `re.subn`, or `re.split` can lead to confusion, as most methods in
the `re` module accept `flags` as the third positional argument, while
`re.sub`, `re.subn`, and `re.split` have different signatures.

Instead, pass `count`, `maxsplit`, and `flags` as keyword arguments.

## Example
```python
import re

re.split("pattern", "replacement", 1)
```

Use instead:
```python
import re

re.split("pattern", "replacement", maxsplit=1)
```

## References
- [Python documentation: `re.sub`](https://docs.python.org/3/library/re.html#re.sub)
- [Python documentation: `re.subn`](https://docs.python.org/3/library/re.html#re.subn)
- [Python documentation: `re.split`](https://docs.python.org/3/library/re.html#re.split)
## What it does
Checks for dictionary comprehensions that use a static key, like a string
literal or a variable defined outside the comprehension.

## Why is this bad?
Using a static key (like a string literal) in a dictionary comprehension
is usually a mistake, as it will result in a dictionary with only one key,
despite the comprehension iterating over multiple values.

## Example
```python
data = ["some", "Data"]
{"key": value.upper() for value in data}
```

Use instead:
```python
data = ["some", "Data"]
{value: value.upper() for value in data}
```
## What it does
Checks for uses of mutable objects as `ContextVar` defaults.

## Why is this bad?

The `ContextVar` default is evaluated once, when the `ContextVar` is defined.

The same mutable object is then shared across all `.get()` method calls to
the `ContextVar`. If the object is modified, those modifications will persist
across calls, which can lead to unexpected behavior.

```