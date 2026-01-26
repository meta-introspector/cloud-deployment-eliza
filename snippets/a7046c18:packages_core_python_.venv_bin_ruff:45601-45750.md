# a7046c18:packages_core_python_.venv_bin_ruff:45601-45750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45601-45750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?

Instead of `class C(metaclass=abc.ABCMeta): ...`, use `class C(ABC): ...`
to define an abstract base class. Inheriting from the `ABC` wrapper class
is semantically identical to setting `metaclass=abc.ABCMeta`, but more
succinct.

## Example
```python
import abc


class C(metaclass=abc.ABCMeta):
    pass
```

Use instead:
```python
import abc


class C(abc.ABC):
    pass
```

## Fix safety
The rule's fix is unsafe if the class has base classes. This is because the base classes might
be validating the class's other base classes (e.g., `typing.Protocol` does this) or otherwise
alter runtime behavior if more base classes are added.

## References
- [Python documentation: `abc.ABC`](https://docs.python.org/3/library/abc.html#abc.ABC)
- [Python documentation: `abc.ABCMeta`](https://docs.python.org/3/library/abc.html#abc.ABCMeta)
## What it does
Checks for the use of `.digest().hex()` on a hashlib hash, like `sha512`.

## Why is this bad?
When generating a hex digest from a hash, it's preferable to use the
`.hexdigest()` method, rather than calling `.digest()` and then `.hex()`,
as the former is more concise and readable.

## Example
```python
from hashlib import sha512

hashed = sha512(b"some data").digest().hex()
```

Use instead:
```python
from hashlib import sha512

hashed = sha512(b"some data").hexdigest()
```

## References
- [Python documentation: `hashlib`](https://docs.python.org/3/library/hashlib.html)
## What it does
Checks for list reversals that can be performed in-place in lieu of
creating a new list.

## Why is this bad?
When reversing a list, it's more efficient to use the in-place method
`.reverse()` instead of creating a new list, if the original list is
no longer needed.

## Example
```python
l = [1, 2, 3]
l = reversed(l)

l = [1, 2, 3]
l = list(reversed(l))

l = [1, 2, 3]
l = l[::-1]
```

Use instead:
```python
l = [1, 2, 3]
l.reverse()
```

## Fix safety
This rule's fix is marked as unsafe, as calling `.reverse()` on a list
will mutate the list in-place, unlike `reversed`, which creates a new list
and leaves the original list unchanged.

If the list is referenced elsewhere, this could lead to unexpected
behavior.

## References
- [Python documentation: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)
## What it does
Checks for code that could be written more idiomatically using
[`str.removeprefix()`](https://docs.python.org/3/library/stdtypes.html#str.removeprefix)
or [`str.removesuffix()`](https://docs.python.org/3/library/stdtypes.html#str.removesuffix).

Specifically, the rule flags code that conditionally removes a prefix or suffix
using a slice operation following an `if` test that uses `str.startswith()` or `str.endswith()`.

The rule is only applied if your project targets Python 3.9 or later.

## Why is this bad?
The methods [`str.removeprefix()`](https://docs.python.org/3/library/stdtypes.html#str.removeprefix)
and [`str.removesuffix()`](https://docs.python.org/3/library/stdtypes.html#str.removesuffix),
introduced in Python 3.9, have the same behavior while being more readable and efficient.

## Example
```python
def example(filename: str, text: str):
    filename = filename[:-4] if filename.endswith(".txt") else filename

    if text.startswith("pre"):
        text = text[3:]
```

Use instead:
```python
def example(filename: str, text: str):
    filename = filename.removesuffix(".txt")
    text = text.removeprefix("pre")
```
## What it does
Checks for subclasses of `dict`, `list` or `str`.

## Why is this bad?
Built-in types don't consistently use their own dunder methods. For example,
`dict.__init__` and `dict.update()` bypass `__setitem__`, making inheritance unreliable.

Use the `UserDict`, `UserList`, and `UserString` objects from the `collections` module
instead.

## Example

```python
class UppercaseDict(dict):
    def __setitem__(self, key, value):
        super().__setitem__(key.upper(), value)


d = UppercaseDict({"a": 1, "b": 2})  # Bypasses __setitem__
print(d)  # {'a': 1, 'b': 2}
```

Use instead:

```python
from collections import UserDict
```