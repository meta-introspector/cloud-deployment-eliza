# a7046c18:packages_core_python_.venv_bin_ruff:33301-33450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33301-33450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

cats_df = pd.read_csv("cats.csv")
dogs_df = pd.read_csv("dogs.csv")
rabbits_df = pd.read_csv("rabbits.csv")
pets_df = cats_df.merge(dogs_df).merge(rabbits_df)
```

## References
- [Pandas documentation: `merge`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html#pandas.DataFrame.merge)
- [Pandas documentation: `pd.merge`](https://pandas.pydata.org/docs/reference/api/pandas.merge.html#pandas.merge)
## What it does
Check for uses of `.nunique()` to check if a Pandas Series is constant
(i.e., contains only one unique value).

## Why is this bad?
`.nunique()` is computationally inefficient for checking if a Series is
constant.

Consider, for example, a Series of length `n` that consists of increasing
integer values (e.g., 1, 2, 3, 4). The `.nunique()` method will iterate
over the entire Series to count the number of unique values. But in this
case, we can detect that the Series is non-constant after visiting the
first two values, which are non-equal.

In general, `.nunique()` requires iterating over the entire Series, while a
more efficient approach allows short-circuiting the operation as soon as a
non-equal value is found.

Instead of calling `.nunique()`, convert the Series to a NumPy array, and
check if all values in the array are equal to the first observed value.

## Example
```python
import pandas as pd

data = pd.Series(range(1000))
if data.nunique() <= 1:
    print("Series is constant")
```

Use instead:
```python
import pandas as pd

data = pd.Series(range(1000))
array = data.to_numpy()
if array.shape[0] == 0 or (array[0] == array).all():
    print("Series is constant")
```

## References
- [Pandas Cookbook: "Constant Series"](https://pandas.pydata.org/docs/user_guide/cookbook.html#constant-series)
- [Pandas documentation: `nunique`](https://pandas.pydata.org/docs/reference/api/pandas.Series.nunique.html)
## Removed

This rule has been removed as it's highly opinionated and overly strict in most cases.

## What it does
Checks for assignments to the variable `df`.

## Why is this bad?
Although `df` is a common variable name for a Pandas `DataFrame`, it's not a
great variable name for production code, as it's non-descriptive and
prone to name conflicts.

Instead, use a more descriptive variable name.

## Example
```python
import pandas as pd

df = pd.read_csv("animals.csv")
```

Use instead:
```python
import pandas as pd

animals = pd.read_csv("animals.csv")
```
## What it does
Checks for explicit casts to `list` on for-loop iterables.

## Why is this bad?
Using a `list()` call to eagerly iterate over an already-iterable type
(like a tuple, list, or set) is inefficient, as it forces Python to create
a new list unnecessarily.

Removing the `list()` call will not change the behavior of the code, but
may improve performance.

Note that, as with all `perflint` rules, this is only intended as a
micro-optimization, and will have a negligible impact on performance in
most cases.

## Example
```python
items = (1, 2, 3)
for i in list(items):
    print(i)
```

Use instead:
```python
items = (1, 2, 3)
for i in items:
    print(i)
```

## Fix safety
This rule's fix is marked as unsafe if there's comments in the
`list()` call, as comments may be removed.

For example, the fix would be marked as unsafe in the following case:
```python
items = (1, 2, 3)
for i in list(  # comment
    items
):
    print(i)
```
## What it does
Checks for uses of `dict.items()` that discard either the key or the value
when iterating over the dictionary.

## Why is this bad?
If you only need the keys or values of a dictionary, you should use
`dict.keys()` or `dict.values()` respectively, instead of `dict.items()`.
These specialized methods are more efficient than `dict.items()`, as they
avoid allocating tuples for every item in the dictionary. They also
communicate the intent of the code more clearly.

Note that, as with all `perflint` rules, this is only intended as a
micro-optimization, and will have a negligible impact on performance in
most cases.

## Example
```python
obj = {"a": 1, "b": 2}
for key, value in obj.items():
    print(value)
```

Use instead:
```python
obj = {"a": 1, "b": 2}
for value in obj.values():
    print(value)
```

```