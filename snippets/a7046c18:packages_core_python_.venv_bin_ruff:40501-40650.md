# a7046c18:packages_core_python_.venv_bin_ruff:40501-40650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40501-40650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Python documentation: Await expression](https://docs.python.org/3/reference/expressions.html#await)
- [PEP 492: Await Expression](https://peps.python.org/pep-0492/#await-expression)

[autoawait]: https://ipython.readthedocs.io/en/stable/interactive/autoawait.html
## What it does
Checks for too many positional arguments for a `logging` format string.

## Why is this bad?
A `TypeError` will be raised if the statement is run.

## Example
```python
import logging

try:
    function()
except Exception as e:
    logging.error("Error occurred: %s", type(e), e)
    raise
```

Use instead:
```python
import logging

try:
    function()
except Exception as e:
    logging.error("%s error occurred: %s", type(e), e)
    raise
```

## Options

- `lint.logger-objects`
## What it does
Checks for too few positional arguments for a `logging` format string.

## Why is this bad?
A `TypeError` will be raised if the statement is run.

## Example
```python
import logging

try:
    function()
except Exception as e:
    logging.error("%s error occurred: %s", e)
    raise
```

Use instead:
```python
import logging

try:
    function()
except Exception as e:
    logging.error("%s error occurred: %s", type(e), e)
    raise
```

## Options

- `lint.logger-objects`
## What it does
Checks for unsupported format types in format strings.

## Why is this bad?
An invalid format string character will result in an error at runtime.

## Example
```python
# `z` is not a valid format type.
print("%z" % "1")

print("{:z}".format("1"))
```
## What it does
Checks for mismatched argument types in "old-style" format strings.

## Why is this bad?
The format string is not checked at compile time, so it is easy to
introduce bugs by mistyping the format string.

## Example
```python
print("%d" % "1")
```

Use instead:
```python
print("%d" % 1)
```
## What it does
Checks duplicate characters in `str.strip` calls.

## Why is this bad?
All characters in `str.strip` calls are removed from both the leading and
trailing ends of the string. Including duplicate characters in the call
is redundant and often indicative of a mistake.

In Python 3.9 and later, you can use `str.removeprefix` and
`str.removesuffix` to remove an exact prefix or suffix from a string,
respectively, which should be preferred when possible.

## Example
```python
# Evaluates to "foo".
"bar foo baz".strip("bar baz ")
```

Use instead:
```python
# Evaluates to "foo".
"bar foo baz".strip("abrz ")  # "foo"
```

Or:
```python
# Evaluates to "foo".
"bar foo baz".removeprefix("bar ").removesuffix(" baz")
```

## Options
- `target-version`

## References
- [Python documentation: `str.strip`](https://docs.python.org/3/library/stdtypes.html?highlight=strip#str.strip)
## What it does
Checks for `os.getenv` calls with an invalid `key` argument.

## Why is this bad?
`os.getenv` only supports strings as the first argument (`key`).

If the provided argument is not a string, `os.getenv` will throw a
`TypeError` at runtime.

## Example
```python
import os

os.getenv(1)
```

Use instead:
```python
import os

```