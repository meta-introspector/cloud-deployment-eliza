# a7046c18:packages_core_python_.venv_bin_ruff:46351-46500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46351-46500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
other types will result in a `TypeError` at runtime and a `SyntaxWarning` at
import time.

## Example
```python
var = [1, 2, 3]["x"]
```

Use instead:
```python
var = [1, 2, 3][0]
```
## What it does
Checks for the use of `sum()` to flatten lists of lists, which has
quadratic complexity.

## Why is this bad?
The use of `sum()` to flatten lists of lists is quadratic in the number of
lists, as `sum()` creates a new list for each element in the summation.

Instead, consider using another method of flattening lists to avoid
quadratic complexity. The following methods are all linear in the number of
lists:

- `functools.reduce(operator.iadd, lists, [])`
- `list(itertools.chain.from_iterable(lists))`
- `[item for sublist in lists for item in sublist]`

When fixing relevant violations, Ruff defaults to the `functools.reduce`
form, which outperforms the other methods in [microbenchmarks].

## Example
```python
lists = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
joined = sum(lists, [])
```

Use instead:
```python
import functools
import operator


lists = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
functools.reduce(operator.iadd, lists, [])
```

## Fix safety

This fix is always marked as unsafe because `sum` uses the `__add__` magic method while
`operator.iadd` uses the `__iadd__` magic method, and these behave differently on lists.
The former requires the right summand to be a list, whereas the latter allows for any iterable.
Therefore, the fix could inadvertently cause code that previously raised an error to silently
succeed. Moreover, the fix could remove comments from the original code.

## References
- [_How Not to Flatten a List of Lists in Python_](https://mathieularose.com/how-not-to-flatten-a-list-of-lists-in-python)
- [_How do I make a flat list out of a list of lists?_](https://stackoverflow.com/questions/952914/how-do-i-make-a-flat-list-out-of-a-list-of-lists/953097#953097)

[microbenchmarks]: https://github.com/astral-sh/ruff/issues/5073#issuecomment-1591836349
## What it does
Checks for named assignment expressions (e.g., `x := 0`) in `assert`
statements.

## Why is this bad?
Named assignment expressions (also known as "walrus operators") are used to
assign a value to a variable as part of a larger expression.

Named assignments are syntactically valid in `assert` statements. However,
when the Python interpreter is run under the `-O` flag, `assert` statements
are not executed. In this case, the named assignment will also be ignored,
which may result in unexpected behavior (e.g., undefined variable
accesses).

## Example
```python
assert (x := 0) == 0
print(x)
```

Use instead:
```python
x = 0
assert x == 0
print(x)
```

The rule avoids flagging named expressions that define variables which are
only referenced from inside `assert` statements; the following will not
trigger the rule:
```python
assert (x := y**2) > 42, f"Expected >42 but got {x}"
```

Nor will this:
```python
assert (x := y**2) > 42
assert x < 1_000_000
```

## References
- [Python documentation: `-O`](https://docs.python.org/3/using/cmdline.html#cmdoption-O)
## What it does
Checks for unnecessary key checks prior to accessing a dictionary.

## Why is this bad?
When working with dictionaries, the `get` can be used to access a value
without having to check if the dictionary contains the relevant key,
returning `None` if the key is not present.

## Example
```python
if "key" in dct and dct["key"]:
    ...
```

Use instead:
```python
if dct.get("key"):
    ...
```
## What it does
Checks for uses of `typing.NoReturn` and `typing.Never` in union types.

## Why is this bad?
`typing.NoReturn` and `typing.Never` are special types, used to indicate
that a function never returns, or that a type has no values.

Including `typing.NoReturn` or `typing.Never` in a union type is redundant,
as, e.g., `typing.Never | T` is equivalent to `T`.

## Example

```python
from typing import Never


def func() -> Never | int: ...
```

Use instead:

```python
def func() -> int: ...
```

## References
- [Python documentation: `typing.Never`](https://docs.python.org/3/library/typing.html#typing.Never)
- [Python documentation: `typing.NoReturn`](https://docs.python.org/3/library/typing.html#typing.NoReturn)
## What it does
```