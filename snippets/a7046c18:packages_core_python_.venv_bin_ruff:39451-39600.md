# a7046c18:packages_core_python_.venv_bin_ruff:39451-39600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39451-39600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Any string iterable may be assigned to `__slots__` (most commonly, a
`tuple` of strings). If a string is assigned to `__slots__`, it is
interpreted as a single attribute name, rather than an iterable of attribute
names. This can cause confusion, as users that iterate over the `__slots__`
value may expect to iterate over a sequence of attributes, but would instead
iterate over the characters of the string.

To use a single string attribute in `__slots__`, wrap the string in an
iterable container type, like a `tuple`.

## Example
```python
class Person:
    __slots__: str = "name"

    def __init__(self, name: str) -> None:
        self.name = name
```

Use instead:
```python
class Person:
    __slots__: tuple[str, ...] = ("name",)

    def __init__(self, name: str) -> None:
        self.name = name
```

## References
- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)
## What it does
Checks for dictionary iterations that extract the dictionary value
via explicit indexing, instead of using `.items()`.

## Why is this bad?
Iterating over a dictionary with `.items()` is semantically clearer
and more efficient than extracting the value with the key.

## Example
```python
ORCHESTRA = {
    "violin": "strings",
    "oboe": "woodwind",
    "tuba": "brass",
    "gong": "percussion",
}

for instrument in ORCHESTRA:
    print(f"{instrument}: {ORCHESTRA[instrument]}")
```

Use instead:
```python
ORCHESTRA = {
    "violin": "strings",
    "oboe": "woodwind",
    "tuba": "brass",
    "gong": "percussion",
}

for instrument, section in ORCHESTRA.items():
    print(f"{instrument}: {section}")
```
## What it does
Checks for access to the first or last element of `str.split()` or `str.rsplit()` without
`maxsplit=1`

## Why is this bad?
Calling `str.split()` or `str.rsplit()` without passing `maxsplit=1` splits on every delimiter in the
string. When accessing only the first or last element of the result, it
would be more efficient to only split once.

## Example
```python
url = "www.example.com"
prefix = url.split(".")[0]
```

Use instead:
```python
url = "www.example.com"
prefix = url.split(".", maxsplit=1)[0]
```

To access the last element, use `str.rsplit()` instead of `str.split()`:
```python
url = "www.example.com"
suffix = url.rsplit(".", maxsplit=1)[-1]
```

## Fix Safety
This rule's fix is marked as unsafe for `split()`/`rsplit()` calls that contain `*args` or `**kwargs` arguments, as
adding a `maxsplit` argument to such a call may lead to duplicated arguments.
## What it does
Checks for iteration over a `set` literal where each element in the set is
itself a literal value.

## Why is this bad?
Iterating over a `set` is less efficient than iterating over a sequence
type, like `list` or `tuple`.

## Example
```python
for number in {1, 2, 3}:
    ...
```

Use instead:
```python
for number in (1, 2, 3):
    ...
```

## References
- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)
## What it does
Checks for import aliases that do not rename the original package.
This rule does not apply in `__init__.py` files.

## Why is this bad?
The import alias is redundant and should be removed to avoid confusion.

## Fix safety
This fix is marked as always unsafe because the user may be intentionally
re-exporting the import. While statements like `import numpy as numpy`
appear redundant, they can have semantic meaning in certain contexts.

## Example
```python
import numpy as numpy
```

Use instead:
```python
import numpy as np
```

or

```python
import numpy
```

## Options

The rule will emit a diagnostic but not a fix if the import is required by the `isort`
configuration option:

- `lint.isort.required-imports`
```