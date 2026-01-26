# a7046c18:packages_core_python_.venv_bin_ruff:46051-46200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46051-46200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```


@dataclass
class A:
    mutable_default: list[int] = field(default_factory=list)
```

Or:
```python
from dataclasses import dataclass
from typing import ClassVar


@dataclass
class A:
    mutable_default: ClassVar[list[int]] = []
```
## What it does
Checks for function calls in dataclass attribute defaults.

## Why is this bad?
Function calls are only performed once, at definition time. The returned
value is then reused by all instances of the dataclass. This can lead to
unexpected behavior when the function call returns a mutable object, as
changes to the object will be shared across all instances.

If a field needs to be initialized with a mutable object, use the
`field(default_factory=...)` pattern.

Attributes whose default arguments are `NewType` calls
where the original type is immutable are ignored.

## Example
```python
from dataclasses import dataclass


def simple_list() -> list[int]:
    return [1, 2, 3, 4]


@dataclass
class A:
    mutable_default: list[int] = simple_list()
```

Use instead:
```python
from dataclasses import dataclass, field


def creating_list() -> list[int]:
    return [1, 2, 3, 4]


@dataclass
class A:
    mutable_default: list[int] = field(default_factory=creating_list)
```

## Options
- `lint.flake8-bugbear.extend-immutable-calls`
## What it does
Checks for uses of `str()`, `repr()`, and `ascii()` as explicit type
conversions within f-strings.

## Why is this bad?
f-strings support dedicated conversion flags for these types, which are
more succinct and idiomatic.

Note that, in many cases, calling `str()` within an f-string is
unnecessary and can be removed entirely, as the value will be converted
to a string automatically, the notable exception being for classes that
implement a custom `__format__` method.

## Example
```python
a = "some string"
f"{repr(a)}"
```

Use instead:
```python
a = "some string"
f"{a!r}"
```
## Removed
This rule was implemented in `flake8-bugbear` and has been remapped to [B035]

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

[B035]: https://docs.astral.sh/ruff/rules/static-key-dict-comprehension/
## What it does
Checks for mutable default values in class attributes.

## Why is this bad?
Mutable default values share state across all instances of the class,
while not being obvious. This can lead to bugs when the attributes are
changed in one instance, as those changes will unexpectedly affect all
other instances.

Generally speaking, you probably want to avoid having mutable default
values in the class body at all; instead, these variables should usually
be initialized in `__init__`. However, other possible fixes for the issue
can include:
- Explicitly annotating the variable with [`typing.ClassVar`][ClassVar] to
  indicate that it is intended to be shared across all instances.
- Using an immutable data type (e.g. a tuple instead of a list)
  for the default value.

## Example

```python
class A:
    variable_1: list[int] = []
    variable_2: set[int] = set()
    variable_3: dict[str, int] = {}
```

Use instead:

```python
class A:
    def __init__(self) -> None:
        self.variable_1: list[int] = []
        self.variable_2: set[int] = set()
        self.variable_3: dict[str, int] = {}
```

Or:

```