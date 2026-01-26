# a7046c18:packages_core_python_.venv_bin_ruff:22951-23100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22951-23100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
sorted(iterable, reverse=True)
```

## Fix safety
This rule's fix is marked as unsafe for `reversed()` cases, as `reversed()`
and `reverse=True` will yield different results in the event of custom sort
keys or equality functions. Specifically, `reversed()` will reverse the order
of the collection, while `sorted()` with `reverse=True` will perform a stable
reverse sort, which will preserve the order of elements that compare as
equal.

The fix is marked as safe for `list()` cases, as removing `list()` around
`sorted()` does not change the behavior.
## What it does
Checks for unnecessary `list()`, `reversed()`, `set()`, `sorted()`, and
`tuple()` call within `list()`, `set()`, `sorted()`, and `tuple()` calls.

## Why is this bad?
It's unnecessary to double-cast or double-process iterables by wrapping
the listed functions within an additional `list()`, `set()`, `sorted()`, or
`tuple()` call. Doing so is redundant and can be confusing for readers.

## Example
```python
list(tuple(iterable))
```

Use instead:
```python
list(iterable)
```

This rule applies to a variety of functions, including `list()`, `reversed()`,
`set()`, `sorted()`, and `tuple()`. For example:

- Instead of `list(list(iterable))`, use `list(iterable)`.
- Instead of `list(tuple(iterable))`, use `list(iterable)`.
- Instead of `tuple(list(iterable))`, use `tuple(iterable)`.
- Instead of `tuple(tuple(iterable))`, use `tuple(iterable)`.
- Instead of `set(set(iterable))`, use `set(iterable)`.
- Instead of `set(list(iterable))`, use `set(iterable)`.
- Instead of `set(tuple(iterable))`, use `set(iterable)`.
- Instead of `set(sorted(iterable))`, use `set(iterable)`.
- Instead of `set(reversed(iterable))`, use `set(iterable)`.
- Instead of `sorted(list(iterable))`, use `sorted(iterable)`.
- Instead of `sorted(tuple(iterable))`, use `sorted(iterable)`.
- Instead of `sorted(sorted(iterable))`, use `sorted(iterable)`.
- Instead of `sorted(reversed(iterable))`, use `sorted(iterable)`.

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary subscript reversal of iterable.

## Why is this bad?
It's unnecessary to reverse the order of an iterable when passing it
into `reversed()`, `set()` or `sorted()` functions as they will change
the order of the elements again.

## Example
```python
sorted(iterable[::-1])
set(iterable[::-1])
reversed(iterable[::-1])
```

Use instead:
```python
sorted(iterable)
set(iterable)
iterable
```
## What it does
Checks for unnecessary dict, list, and set comprehension.

## Why is this bad?
It's unnecessary to use a dict/list/set comprehension to build a data structure if the
elements are unchanged. Wrap the iterable with `dict()`, `list()`, or `set()` instead.

## Example
```python
{a: b for a, b in iterable}
[x for x in iterable]
{x for x in iterable}
```

Use instead:
```python
dict(iterable)
list(iterable)
set(iterable)
```

## Known problems

This rule may produce false positives for dictionary comprehensions that iterate over a mapping.
The dict constructor behaves differently depending on if it receives a sequence (e.g., a
list) or a mapping (e.g., a dict). When a comprehension iterates over the keys of a mapping,
replacing it with a `dict()` constructor call will give a different result.

For example:

```pycon
>>> d1 = {(1, 2): 3, (4, 5): 6}
>>> {x: y for x, y in d1}  # Iterates over the keys of a mapping
{1: 2, 4: 5}
>>> dict(d1)               # Ruff's incorrect suggested fix
{(1, 2): 3, (4, 5): 6}
>>> dict(d1.keys())        # Correct fix
{1: 2, 4: 5}
```

When the comprehension iterates over a sequence, Ruff's suggested fix is correct. However, Ruff
cannot consistently infer if the iterable type is a sequence or a mapping and cannot suggest
the correct fix for mappings.

## Fix safety
Due to the known problem with dictionary comprehensions, this fix is marked as unsafe.

Additionally, this fix may drop comments when rewriting the comprehension.
## What it does
Checks for unnecessary `map()` calls with lambda functions.

## Why is this bad?
Using `map(func, iterable)` when `func` is a lambda is slower than
using a generator expression or a comprehension, as the latter approach
avoids the function call overhead, in addition to being more readable.

This rule also applies to `map()` calls within `list()`, `set()`, and
`dict()` calls. For example:

- Instead of `list(map(lambda num: num * 2, nums))`, use
  `[num * 2 for num in nums]`.
- Instead of `set(map(lambda num: num % 2 == 0, nums))`, use
  `{num % 2 == 0 for num in nums}`.
- Instead of `dict(map(lambda v: (v, v ** 2), values))`, use
  `{v: v ** 2 for v in values}`.

## Example
```python
map(lambda x: x + 1, iterable)
```

Use instead:
```python
(x + 1 for x in iterable)
```

```