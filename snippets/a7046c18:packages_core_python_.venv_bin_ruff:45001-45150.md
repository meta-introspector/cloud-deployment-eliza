# a7046c18:packages_core_python_.venv_bin_ruff:45001-45150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:45001-45150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for generator expressions, list and set comprehensions that can
be replaced with `itertools.starmap`.

## Why is this bad?
When unpacking values from iterators to pass them directly to
a function, prefer `itertools.starmap`.

Using `itertools.starmap` is more concise and readable. Furthermore, it is
more efficient than generator expressions, and in some versions of Python,
it is more efficient than comprehensions.

## Known problems
Since Python 3.12, `itertools.starmap` is less efficient than
comprehensions ([#7771]). This is due to [PEP 709], which made
comprehensions faster.

## Example
```python
all(predicate(a, b) for a, b in some_iterable)
```

Use instead:
```python
from itertools import starmap


all(starmap(predicate, some_iterable))
```

## References
- [Python documentation: `itertools.starmap`](https://docs.python.org/3/library/itertools.html#itertools.starmap)

[PEP 709]: https://peps.python.org/pep-0709/
[#7771]: https://github.com/astral-sh/ruff/issues/7771
## What it does
Checks for code that updates a set with the contents of an iterable by
using a `for` loop to call `.add()` or `.discard()` on each element
separately.

## Why is this bad?
When adding or removing a batch of elements to or from a set, it's more
idiomatic to use a single method call rather than adding or removing
elements one by one.

## Example
```python
s = set()

for x in (1, 2, 3):
    s.add(x)

for x in (1, 2, 3):
    s.discard(x)
```

Use instead:
```python
s = set()

s.update((1, 2, 3))
s.difference_update((1, 2, 3))
```

## Fix safety
The fix will be marked as unsafe if applying the fix would delete any comments.
Otherwise, it is marked as safe.

## References
- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)
## What it does
Checks for unbounded slice expressions to copy a list.

## Why is this bad?
The `list.copy` method is more readable and consistent with copying other
types.

## Known problems
This rule is prone to false negatives due to type inference limitations,
as it will only detect lists that are instantiated as literals or annotated
with a type annotation.

## Example
```python
a = [1, 2, 3]
b = a[:]
```

Use instead:
```python
a = [1, 2, 3]
b = a.copy()
```

## References
- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types)
## What it does
Checks for uses of `enumerate` that discard either the index or the value
when iterating over a sequence.

## Why is this bad?
The built-in `enumerate` function is useful when you need both the index and
value of a sequence.

If you only need the index or values of a sequence, you should iterate over
`range(len(...))` or the sequence itself, respectively, instead. This is
more efficient and communicates the intent of the code more clearly.

## Known problems
This rule is prone to false negatives due to type inference limitations;
namely, it will only suggest a fix using the `len` builtin function if the
sequence passed to `enumerate` is an instantiated as a list, set, dict, or
tuple literal, or annotated as such with a type annotation.

The `len` builtin function is not defined for all object types (such as
generators), and so refactoring to use `len` over `enumerate` is not always
safe.

## Example
```python
for index, _ in enumerate(sequence):
    print(index)

for _, value in enumerate(sequence):
    print(value)
```

Use instead:
```python
for index in range(len(sequence)):
    print(index)

for value in sequence:
    print(value)
```

## References
- [Python documentation: `enumerate`](https://docs.python.org/3/library/functions.html#enumerate)
- [Python documentation: `range`](https://docs.python.org/3/library/stdtypes.html#range)
- [Python documentation: `len`](https://docs.python.org/3/library/functions.html#len)
## What it does
Checks for literals that are similar to constants in `math` module.

## Why is this bad?
Hard-coding mathematical constants like π increases code duplication,
reduces readability, and may lead to a lack of precision.

## Example
```python
A = 3.141592 * r**2
```
```