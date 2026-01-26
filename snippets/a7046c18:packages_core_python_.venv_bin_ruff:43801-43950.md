# a7046c18:packages_core_python_.venv_bin_ruff:43801-43950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43801-43950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
f"{'Hello'}, {'World'}"  # "Hello, World"
```

## Fix safety

In cases where the format string contains a single generic format specifier
(e.g. `%s`), and the right-hand side is an ambiguous expression,
we cannot offer a safe fix.

For example, given:

```python
"%s" % val
```

`val` could be a single-element tuple, _or_ a single value (not
contained in a tuple). Both of these would resolve to the same
formatted string when using `printf`-style formatting, but
resolve differently when using f-strings:

```python
val = 1
print("%s" % val)  # "1"
print("{}".format(val))  # "1"

val = (1,)
print("%s" % val)  # "1"
print("{}".format(val))  # "(1,)"
```

## References
- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#old-string-formatting)
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `str.format` calls that can be replaced with f-strings.

## Why is this bad?
f-strings are more readable and generally preferred over `str.format`
calls.

## Example
```python
"{}".format(foo)
```

Use instead:
```python
f"{foo}"
```

## References
- [Python documentation: f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
## What it does
Checks for uses of `functools.lru_cache` that set `maxsize=None`.

## Why is this bad?
Since Python 3.9, `functools.cache` can be used as a drop-in replacement
for `functools.lru_cache(maxsize=None)`. When possible, prefer
`functools.cache` as it is more readable and idiomatic.

## Example

```python
import functools


@functools.lru_cache(maxsize=None)
def foo(): ...
```

Use instead:

```python
import functools


@functools.cache
def foo(): ...
```

## Options
- `target-version`

## References
- [Python documentation: `@functools.cache`](https://docs.python.org/3/library/functools.html#functools.cache)
## What it does
Checks for extraneous parentheses.

## Why is this bad?
Extraneous parentheses are redundant, and can be removed to improve
readability while retaining identical semantics.

## Example
```python
print(("Hello, world"))
```

Use instead:
```python
print("Hello, world")
```
## What it does
Checks for uses of deprecated imports based on the minimum supported
Python version.

## Why is this bad?
Deprecated imports may be removed in future versions of Python, and
should be replaced with their new equivalents.

Note that, in some cases, it may be preferable to continue importing
members from `typing_extensions` even after they're added to the Python
standard library, as `typing_extensions` can backport bugfixes and
optimizations from later Python versions. This rule thus avoids flagging
imports from `typing_extensions` in such cases.

## Example
```python
from collections import Sequence
```

Use instead:
```python
from collections.abc import Sequence
```
## What it does
Checks for conditional blocks gated on `sys.version_info` comparisons
that are outdated for the minimum supported Python version.

## Why is this bad?
In Python, code can be conditionally executed based on the active
Python version by comparing against the `sys.version_info` tuple.

If a code block is only executed for Python versions older than the
minimum supported version, it should be removed.

## Example
```python
import sys

if sys.version_info < (3, 0):
    print("py2")
else:
    print("py3")
```

Use instead:
```python
print("py3")
```
```