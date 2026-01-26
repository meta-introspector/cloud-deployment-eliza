# a7046c18:packages_core_python_.venv_bin_ruff:40351-40500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40351-40500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
the names of all "public" symbols exported by a module.

Assigning anything other than a `tuple` or `list` of strings to `__all__`
is invalid.

## Example
```python
__all__ = "Foo"
```

Use instead:
```python
__all__ = ("Foo",)
```

## References
- [Python documentation: The `import` statement](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement)
## What it does
Checks for hard-coded sequence accesses that are known to be out of bounds.

## Why is this bad?
Attempting to access a sequence with an out-of-bounds index will cause an
`IndexError` to be raised at runtime. When the sequence and index are
defined statically (e.g., subscripts on `list` and `tuple` literals, with
integer indexes), such errors can be detected ahead of time.

## Example
```python
print([0, 1, 2][3])
```
## What it does
Checks for bare `raise` statements outside of exception handlers.

## Why is this bad?
A bare `raise` statement without an exception object will re-raise the last
exception that was active in the current scope, and is typically used
within an exception handler to re-raise the caught exception.

If a bare `raise` is used outside of an exception handler, it will generate
an error due to the lack of an active exception.

Note that a bare `raise` within a  `finally` block will work in some cases
(namely, when the exception is raised within the `try` block), but should
be avoided as it can lead to confusing behavior.

## Example
```python
from typing import Any


def is_some(obj: Any) -> bool:
    if obj is None:
        raise
```

Use instead:
```python
from typing import Any


def is_some(obj: Any) -> bool:
    if obj is None:
        raise ValueError("`obj` cannot be `None`")
```
## What it does
Checks for repeated keyword arguments in function calls.

## Why is this bad?
Python does not allow repeated keyword arguments in function calls. If a
function is called with the same keyword argument multiple times, the
interpreter will raise an exception.

## Example
```python
func(1, 2, c=3, **{"c": 4})
```

## References
- [Python documentation: Argument](https://docs.python.org/3/glossary.html#term-argument)
## What it does
Checks for dictionary unpacking in a for loop without calling `.items()`.

## Why is this bad?
When iterating over a dictionary in a for loop, if a dictionary is unpacked
without calling `.items()`, it could lead to a runtime error if the keys are not
a tuple of two elements.

It is likely that you're looking for an iteration over (key, value) pairs which
can only be achieved when calling `.items()`.

## Example
```python
data = {"Paris": 2_165_423, "New York City": 8_804_190, "Tokyo": 13_988_129}

for city, population in data:
    print(f"{city} has population {population}.")
```

Use instead:
```python
data = {"Paris": 2_165_423, "New York City": 8_804_190, "Tokyo": 13_988_129}

for city, population in data.items():
    print(f"{city} has population {population}.")
```

## Known problems
If the dictionary key is a tuple, e.g.:

```python
d = {(1, 2): 3, (3, 4): 5}
for x, y in d:
    print(x, y)
```

The tuple key is unpacked into `x` and `y` instead of the key and values. This means that
the suggested fix of using `d.items()` would result in different runtime behavior. Ruff
cannot consistently infer the type of a dictionary's keys.

## Fix safety
Due to the known problem with tuple keys, this fix is unsafe.
## What it does
Checks for uses of `await` outside `async` functions.

## Why is this bad?
Using `await` outside an `async` function is a syntax error.

## Example
```python
import asyncio


def foo():
    await asyncio.sleep(1)
```

Use instead:
```python
import asyncio


async def foo():
    await asyncio.sleep(1)
```

## Notebook behavior
As an exception, `await` is allowed at the top level of a Jupyter notebook
(see: [autoawait]).

## References
```