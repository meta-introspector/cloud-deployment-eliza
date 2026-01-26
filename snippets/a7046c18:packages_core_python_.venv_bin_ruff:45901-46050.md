# a7046c18:packages_core_python_.venv_bin_ruff:45901-46050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45901-46050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
foo()  # noqa  # "o" is Latin (`U+006F`)
```

## Options
- `lint.allowed-confusables`

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of the `+` operator to concatenate collections.

## Why is this bad?
In Python, the `+` operator can be used to concatenate collections (e.g.,
`x + y` to concatenate the lists `x` and `y`).

However, collections can be concatenated more efficiently using the
unpacking operator (e.g., `[*x, *y]` to concatenate `x` and `y`).

Prefer the unpacking operator to concatenate collections, as it is more
readable and flexible. The `*` operator can unpack any iterable, whereas
 `+` operates only on particular sequences which, in many cases, must be of
the same type.

## Example
```python
foo = [2, 3, 4]
bar = [1] + foo + [5, 6]
```

Use instead:
```python
foo = [2, 3, 4]
bar = [1, *foo, 5, 6]
```

## Fix safety

The fix is always marked as unsafe because the `+` operator uses the `__add__` magic method and
`*`-unpacking uses the `__iter__` magic method. Both of these could have custom
implementations, causing the fix to change program behaviour.

## References
- [PEP 448 – Additional Unpacking Generalizations](https://peps.python.org/pep-0448/)
- [Python documentation: Sequence Types — `list`, `tuple`, `range`](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)
## What it does
Checks for `asyncio.create_task` and `asyncio.ensure_future` calls
that do not store a reference to the returned result.

## Why is this bad?
Per the `asyncio` documentation, the event loop only retains a weak
reference to tasks. If the task returned by `asyncio.create_task` and
`asyncio.ensure_future` is not stored in a variable, or a collection,
or otherwise referenced, it may be garbage collected at any time. This
can lead to unexpected and inconsistent behavior, as your tasks may or
may not run to completion.

## Example
```python
import asyncio

for i in range(10):
    # This creates a weak reference to the task, which may be garbage
    # collected at any time.
    asyncio.create_task(some_coro(param=i))
```

Use instead:
```python
import asyncio

background_tasks = set()

for i in range(10):
    task = asyncio.create_task(some_coro(param=i))

    # Add task to the set. This creates a strong reference.
    background_tasks.add(task)

    # To prevent keeping references to finished tasks forever,
    # make each task remove its own reference from the set after
    # completion:
    task.add_done_callback(background_tasks.discard)
```

## References
- [_The Heisenbug lurking in your async code_](https://textual.textualize.io/blog/2023/02/11/the-heisenbug-lurking-in-your-async-code/)
- [The Python Standard Library](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)
## What it does
Checks for use of `zip()` to iterate over successive pairs of elements.

## Why is this bad?
When iterating over successive pairs of elements, prefer
`itertools.pairwise()` over `zip()`.

`itertools.pairwise()` is more readable and conveys the intent of the code
more clearly.

## Example
```python
letters = "ABCD"
zip(letters, letters[1:])  # ("A", "B"), ("B", "C"), ("C", "D")
```

Use instead:
```python
from itertools import pairwise

letters = "ABCD"
pairwise(letters)  # ("A", "B"), ("B", "C"), ("C", "D")
```

## Fix safety

The fix is always marked unsafe because it assumes that slicing an object
(e.g., `obj[1:]`) produces a value with the same type and iteration behavior
as the original object, which is not guaranteed for user-defined types that
override `__getitem__` without properly handling slices. Moreover, the fix
could delete comments.

## References
- [Python documentation: `itertools.pairwise`](https://docs.python.org/3/library/itertools.html#itertools.pairwise)
## What it does
Checks for mutable default values in dataclass attributes.

## Why is this bad?
Mutable default values share state across all instances of the dataclass.
This can lead to bugs when the attributes are changed in one instance, as
those changes will unexpectedly affect all other instances.

Instead of sharing mutable defaults, use the `field(default_factory=...)`
pattern.

If the default value is intended to be mutable, it must be annotated with
`typing.ClassVar`; otherwise, a `ValueError` will be raised.

## Example
```python
from dataclasses import dataclass


@dataclass
class A:
    # A list without a `default_factory` or `ClassVar` annotation
    # will raise a `ValueError`.
    mutable_default: list[int] = []
```

Use instead:
```python
from dataclasses import dataclass, field
```