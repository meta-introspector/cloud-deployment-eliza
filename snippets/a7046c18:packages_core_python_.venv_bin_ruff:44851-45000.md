# a7046c18:packages_core_python_.venv_bin_ruff:44851-45000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44851-45000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

with Path("file").open("w") as f:
    for line in lines:
        f.write(line)

with Path("file").open("wb") as f_b:
    for line_b in lines_b:
        f_b.write(line_b.encode())
```

Use instead:
```python
from pathlib import Path

with Path("file").open("w") as f:
    f.writelines(lines)

with Path("file").open("wb") as f_b:
    f_b.writelines(line_b.encode() for line_b in lines_b)
```

## Fix safety
This fix is marked as unsafe if it would cause comments to be deleted.

## References
- [Python documentation: `io.IOBase.writelines`](https://docs.python.org/3/library/io.html#io.IOBase.writelines)
## What it does
Checks for uses of `readlines()` when iterating over a file line-by-line.

## Why is this bad?
Rather than iterating over all lines in a file by calling `readlines()`,
it's more convenient and performant to iterate over the file object
directly.

## Example
```python
with open("file.txt") as fp:
    for line in fp.readlines():
        ...
```

Use instead:
```python
with open("file.txt") as fp:
    for line in fp:
        ...
```

## Fix safety
This rule's fix is marked as unsafe if there's comments in the
`readlines()` call, as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
with open("file.txt") as fp:
    for line in (  # comment
        fp.readlines()  # comment
    ):
        ...
```

## References
- [Python documentation: `io.IOBase.readlines`](https://docs.python.org/3/library/io.html#io.IOBase.readlines)
## What it does
Checks for `del` statements that delete the entire slice of a list or
dictionary.

## Why is this bad?
It is faster and more succinct to remove all items via the `clear()`
method.

## Known problems
This rule is prone to false negatives due to type inference limitations,
as it will only detect lists and dictionaries that are instantiated as
literals or annotated with a type annotation.

## Example
```python
names = {"key": "value"}
nums = [1, 2, 3]

del names[:]
del nums[:]
```

Use instead:
```python
names = {"key": "value"}
nums = [1, 2, 3]

names.clear()
nums.clear()
```

## References
- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html?highlight=list#mutable-sequence-types)
- [Python documentation: `dict.clear()`](https://docs.python.org/3/library/stdtypes.html?highlight=list#dict.clear)
## What it does
Checks for uses of `set.remove` that can be replaced with `set.discard`.

## Why is this bad?
If an element should be removed from a set if it is present, it is more
succinct and idiomatic to use `discard`.

## Known problems
This rule is prone to false negatives due to type inference limitations,
as it will only detect sets that are instantiated as literals or annotated
with a type annotation.

## Example
```python
nums = {123, 456}

if 123 in nums:
    nums.remove(123)
```

Use instead:
```python
nums = {123, 456}

nums.discard(123)
```

## References
- [Python documentation: `set.discard()`](https://docs.python.org/3/library/stdtypes.html?highlight=list#frozenset.discard)
## What it does
Checks for `if` expressions that can be replaced with `min()` or `max()`
calls.

## Why is this bad?
An `if` expression that selects the lesser or greater of two
sub-expressions can be replaced with a `min()` or `max()` call
respectively. When possible, prefer `min()` and `max()`, as they're more
concise and readable than the equivalent `if` expression.

## Example
```python
highest_score = score1 if score1 > score2 else score2
```

Use instead:
```python
highest_score = max(score2, score1)
```

## References
- [Python documentation: `min`](https://docs.python.org/3.11/library/functions.html#min)
- [Python documentation: `max`](https://docs.python.org/3.11/library/functions.html#max)
## What it does
```