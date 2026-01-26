# a7046c18:packages_core_python_.venv_bin_ruff:32251-32400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32251-32400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- `lint.isort.required-imports`
## What it does
Checks for functions with a high `McCabe` complexity.

## Why is this bad?
The `McCabe` complexity of a function is a measure of the complexity of
the control flow graph of the function. It is calculated by adding
one to the number of decision points in the function. A decision
point is a place in the code where the program has a choice of two
or more paths to follow.

Functions with a high complexity are hard to understand and maintain.

## Example
```python
def foo(a, b, c):
    if a:
        if b:
            if c:
                return 1
            else:
                return 2
        else:
            return 3
    else:
        return 4
```

Use instead:
```python
def foo(a, b, c):
    if not a:
        return 4
    if not b:
        return 3
    if not c:
        return 2
    return 1
```

## Options
- `lint.mccabe.max-complexity`
## What it does
Checks for deprecated NumPy type aliases.

## Why is this bad?
NumPy's `np.int` has long been an alias of the builtin `int`; the same
is true of `np.float` and others. These aliases exist primarily
for historic reasons, and have been a cause of frequent confusion
for newcomers.

These aliases were deprecated in 1.20, and removed in 1.24.
Note, however, that `np.bool` and `np.long` were reintroduced in 2.0 with
different semantics, and are thus omitted from this rule.

## Example
```python
import numpy as np

np.int
```

Use instead:
```python
int
```
## What it does
Checks for the use of legacy `np.random` function calls.

## Why is this bad?
According to the NumPy documentation's [Legacy Random Generation]:

> The `RandomState` provides access to legacy generators... This class
> should only be used if it is essential to have randoms that are
> identical to what would have been produced by previous versions of
> NumPy.

The members exposed directly on the `random` module are convenience
functions that alias to methods on a global singleton `RandomState`
instance. NumPy recommends using a dedicated `Generator` instance
rather than the random variate generation methods exposed directly on
the `random` module, as the new `Generator` is both faster and has
better statistical properties.

See the documentation on [Random Sampling] and [NEP 19] for further
details.

## Example
```python
import numpy as np

np.random.seed(1337)
np.random.normal()
```

Use instead:
```python
rng = np.random.default_rng(1337)
rng.normal()
```

[Legacy Random Generation]: https://numpy.org/doc/stable/reference/random/legacy.html#legacy
[Random Sampling]: https://numpy.org/doc/stable/reference/random/index.html#random-quick-start
[NEP 19]: https://numpy.org/neps/nep-0019-rng-policy.html
## What it does
Checks for uses of deprecated NumPy functions.

## Why is this bad?
When NumPy functions are deprecated, they are usually replaced with
newer, more efficient versions, or with functions that are more
consistent with the rest of the NumPy API.

Prefer newer APIs over deprecated ones.

## Example
```python
import numpy as np

np.alltrue([True, False])
```

Use instead:
```python
import numpy as np

np.all([True, False])
```
## What it does
Checks for uses of NumPy functions and constants that were removed from
the main namespace in NumPy 2.0.

## Why is this bad?
NumPy 2.0 includes an overhaul of NumPy's Python API, intended to remove
redundant aliases and routines, and establish unambiguous mechanisms for
accessing constants, dtypes, and functions.

As part of this overhaul, a variety of deprecated NumPy functions and
constants were removed from the main namespace.

The majority of these functions and constants can be automatically replaced
by other members of the NumPy API or by equivalents from the Python
standard library. With the exception of renaming `numpy.byte_bounds` to
`numpy.lib.array_utils.byte_bounds`, all such replacements are backwards
compatible with earlier versions of NumPy.

This rule flags all uses of removed members, along with automatic fixes for
any backwards-compatible replacements.

## Example
```python
```