# a7046c18:packages_core_python_.venv_bin_ruff:22201-22350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22201-22350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        raise RuntimeError("...")
    else:
        raise UserWarning("...")
```

Use instead:
```python
try:
    ...
except FileNotFoundError as exc:
    if ...:
        raise RuntimeError("...") from None
    else:
        raise UserWarning("...") from exc
```

## References
- [Python documentation: `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)
## What it does
Checks for `zip` calls without an explicit `strict` parameter when called with two or more iterables, or any starred argument.

## Why is this bad?
By default, if the iterables passed to `zip` are of different lengths, the
resulting iterator will be silently truncated to the length of the shortest
iterable. This can lead to subtle bugs.

Pass `strict=True` to raise a `ValueError` if the iterables are of
non-uniform length. Alternatively, if the iterables are deliberately of
different lengths, pass `strict=False` to make the intention explicit.

## Example
```python
zip(a, b)
```

Use instead:
```python
zip(a, b, strict=True)
```

## Fix safety
This rule's fix is marked as unsafe. While adding `strict=False` preserves
the runtime behavior, it can obscure situations where the iterables are of
unequal length. Ruff prefers to alert users so they can choose the intended
behavior themselves.

## References
- [Python documentation: `zip`](https://docs.python.org/3/library/functions.html#zip)
## What it does
Checks for mutations to an iterable during a loop iteration.

## Why is this bad?
When iterating over an iterable, mutating the iterable can lead to unexpected
behavior, like skipping elements or infinite loops.

## Example
```python
items = [1, 2, 3]

for item in items:
    print(item)

    # Create an infinite loop by appending to the list.
    items.append(item)
```

## References
- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html#typesseq-mutable)
## What it does
Checks for `itertools.batched` calls without an explicit `strict` parameter.

## Why is this bad?
By default, if the length of the iterable is not divisible by
the second argument to `itertools.batched`, the last batch
will be shorter than the rest.

In Python 3.13, a `strict` parameter was added which allows controlling if the batches must be of uniform length.
Pass `strict=True` to raise a `ValueError` if the batches are of non-uniform length.
Otherwise, pass `strict=False` to make the intention explicit.

## Example
```python
import itertools

itertools.batched(iterable, n)
```

Use instead if the batches must be of uniform length:
```python
import itertools

itertools.batched(iterable, n, strict=True)
```

Or if the batches can be of non-uniform length:
```python
import itertools

itertools.batched(iterable, n, strict=False)
```

## Known deviations
Unlike the upstream `B911`, this rule will not report infinite iterators
(e.g., `itertools.cycle(...)`).

## Options
- `target-version`

## References
- [Python documentation: `batched`](https://docs.python.org/3/library/itertools.html#batched)
## What it does
Checks for `map` calls without an explicit `strict` parameter when called with two or more iterables, or any starred argument.

This rule applies to Python 3.14 and later, where `map` accepts a `strict` keyword
argument. For details, see: [What’s New in Python 3.14](https://docs.python.org/dev/whatsnew/3.14.html).

## Why is this bad?
By default, if the iterables passed to `map` are of different lengths, the
resulting iterator will be silently truncated to the length of the shortest
iterable. This can lead to subtle bugs.

Pass `strict=True` to raise a `ValueError` if the iterables are of
non-uniform length. Alternatively, if the iterables are deliberately of
different lengths, pass `strict=False` to make the intention explicit.

## Example
```python
map(f, a, b)
```

Use instead:
```python
map(f, a, b, strict=True)
```

## Fix safety
This rule's fix is marked as unsafe. While adding `strict=False` preserves
the runtime behavior, it can obscure situations where the iterables are of
unequal length. Ruff prefers to alert users so they can choose the intended
behavior themselves.

## References
- [Python documentation: `map`](https://docs.python.org/3/library/functions.html#map)
- [What’s New in Python 3.14](https://docs.python.org/dev/whatsnew/3.14.html)
## What it does
Checks for variable (and function) assignments that use the same names
as builtins.

## Why is this bad?
Reusing a builtin name for the name of a variable increases the
```