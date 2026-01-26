# a7046c18:packages_core_python_.venv_bin_ruff:21001-21150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21001-21150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
hasattr(obj, "__call__")
```

Use instead:
```python
callable(obj)
```

## Fix safety
This rule's fix is marked as unsafe because the replacement may not be semantically
equivalent to the original expression, potentially changing the behavior of the code.

For example, an imported module may have a `__call__` attribute but is not considered
a callable object:
```python
import operator

assert hasattr(operator, "__call__")
assert callable(operator) is False
```
Additionally, `__call__` may be defined only as an instance method:
```python
class A:
    def __init__(self):
        self.__call__ = None


assert hasattr(A(), "__call__")
assert callable(A()) is False
```

Additionally, if there are comments in the `hasattr` call expression, they may be removed:
```python
hasattr(
    # comment 1
    obj,  # comment 2
    # comment 3
    "__call__",  # comment 4
    # comment 5
)
```

## References
- [Python documentation: `callable`](https://docs.python.org/3/library/functions.html#callable)
- [Python documentation: `hasattr`](https://docs.python.org/3/library/functions.html#hasattr)
- [Python documentation: `__getattr__`](https://docs.python.org/3/reference/datamodel.html#object.__getattr__)
- [Python documentation: `__call__`](https://docs.python.org/3/reference/datamodel.html#object.__call__)
## What it does
Checks for uses of multi-character strings in `.strip()`, `.lstrip()`, and
`.rstrip()` calls.

## Why is this bad?
All characters in the call to `.strip()`, `.lstrip()`, or `.rstrip()` are
removed from the leading and trailing ends of the string. If the string
contains multiple characters, the reader may be misled into thinking that
a prefix or suffix is being removed, rather than a set of characters.

In Python 3.9 and later, you can use `str.removeprefix` and
`str.removesuffix` to remove an exact prefix or suffix from a string,
respectively, which should be preferred when possible.

## Known problems
As a heuristic, this rule only flags multi-character strings that contain
duplicate characters. This allows usages like `.strip("xyz")`, which
removes all occurrences of the characters `x`, `y`, and `z` from the
leading and trailing ends of the string, but not `.strip("foo")`.

The use of unique, multi-character strings may be intentional and
consistent with the intent of `.strip()`, `.lstrip()`, or `.rstrip()`,
while the use of duplicate-character strings is very likely to be a
mistake.

## Example
```python
"text.txt".strip(".txt")  # "e"
```

Use instead:
```python
"text.txt".removesuffix(".txt")  # "text"
```

## References
- [Python documentation: `str.strip`](https://docs.python.org/3/library/stdtypes.html#str.strip)
## What it does
Checks for uses of mutable objects as function argument defaults.

## Why is this bad?
Function defaults are evaluated once, when the function is defined.

The same mutable object is then shared across all calls to the function.
If the object is modified, those modifications will persist across calls,
which can lead to unexpected behavior.

Instead, prefer to use immutable data structures, or take `None` as a
default, and initialize a new mutable object inside the function body
for each call.

Arguments with immutable type annotations will be ignored by this rule.
Types outside of the standard library can be marked as immutable with the
[`lint.flake8-bugbear.extend-immutable-calls`] configuration option.

## Known problems
Mutable argument defaults can be used intentionally to cache computation
results. Replacing the default with `None` or an immutable data structure
does not work for such usages. Instead, prefer the `@functools.lru_cache`
decorator from the standard library.

## Example
```python
def add_to_list(item, some_list=[]):
    some_list.append(item)
    return some_list


l1 = add_to_list(0)  # [0]
l2 = add_to_list(1)  # [0, 1]
```

Use instead:
```python
def add_to_list(item, some_list=None):
    if some_list is None:
        some_list = []
    some_list.append(item)
    return some_list


l1 = add_to_list(0)  # [0]
l2 = add_to_list(1)  # [1]
```

## Options
- `lint.flake8-bugbear.extend-immutable-calls`

## Fix safety

This fix is marked as unsafe because it replaces the mutable default with `None`
and initializes it in the function body, which may not be what the user intended,
as described above.

## References
- [Python documentation: Default Argument Values](https://docs.python.org/3/tutorial/controlflow.html#default-argument-values)
## What it does
Checks for unused variables in loops (e.g., `for` and `while` statements).

## Why is this bad?
Defining a variable in a loop statement that is never used can confuse
readers.

```