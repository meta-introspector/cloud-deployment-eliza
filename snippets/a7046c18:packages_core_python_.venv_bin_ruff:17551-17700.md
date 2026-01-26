# a7046c18:packages_core_python_.venv_bin_ruff:17551-17700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:17551-17700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
async def read_thing(query: str): ...
```

Use instead:

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/things/{thing_id}")
async def read_thing(thing_id: int, query: str): ...
```

## Fix safety
This rule's fix is marked as unsafe, as modifying a function signature can
change the behavior of the code.
## What it does
Checks for uses of `sys.version[:3]`.

## Why is this bad?
If the current major or minor version consists of multiple digits,
`sys.version[:3]` will truncate the version number (e.g., `"3.10"` would
become `"3.1"`). This is likely unintended, and can lead to subtle bugs if
the version string is used to test against a specific Python version.

Instead, use `sys.version_info` to access the current major and minor
version numbers as a tuple, which can be compared to other tuples
without issue.

## Example
```python
import sys

sys.version[:3]  # Evaluates to "3.1" on Python 3.10.
```

Use instead:
```python
import sys

sys.version_info[:2]  # Evaluates to (3, 10) on Python 3.10.
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for uses of `sys.version[2]`.

## Why is this bad?
If the current major or minor version consists of multiple digits,
`sys.version[2]` will select the first digit of the minor number only
(e.g., `"3.10"` would evaluate to `"1"`). This is likely unintended, and
can lead to subtle bugs if the version is used to test against a minor
version number.

Instead, use `sys.version_info.minor` to access the current minor version
number.

## Example
```python
import sys

sys.version[2]  # Evaluates to "1" on Python 3.10.
```

Use instead:
```python
import sys

f"{sys.version_info.minor}"  # Evaluates to "10" on Python 3.10.
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for comparisons that test `sys.version` against string literals,
such that the comparison will evaluate to `False` on Python 3.10 or later.

## Why is this bad?
Comparing `sys.version` to a string is error-prone and may cause subtle
bugs, as the comparison will be performed lexicographically, not
semantically. For example, `sys.version > "3.9"` will evaluate to `False`
when using Python 3.10, as `"3.10"` is lexicographically "less" than
`"3.9"`.

Instead, use `sys.version_info` to access the current major and minor
version numbers as a tuple, which can be compared to other tuples
without issue.

## Example
```python
import sys

sys.version > "3.9"  # `False` on Python 3.10.
```

Use instead:
```python
import sys

sys.version_info > (3, 9)  # `True` on Python 3.10.
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for equality comparisons against the major version returned by
`sys.version_info` (e.g., `sys.version_info[0] == 3` or `sys.version_info[0] != 3`).

## Why is this bad?
Using `sys.version_info[0] == 3` to verify that the major version is
Python 3 or greater will fail if the major version number is ever
incremented (e.g., to Python 4). This is likely unintended, as code
that uses this comparison is likely intended to be run on Python 2,
but would now run on Python 4 too. Similarly, using `sys.version_info[0] != 3`
to check for Python 2 will also fail if the major version number is
incremented.

Instead, use `>=` to check if the major version number is 3 or greater,
or `<` to check if the major version number is less than 3, to future-proof
the code.

## Example
```python
import sys

if sys.version_info[0] == 3:
    ...
else:
    print("Python 2")  # This will be printed on Python 4.
```

Use instead:
```python
import sys

if sys.version_info >= (3,):
    ...
else:
    print("Python 2")  # This will not be printed on Python 4.
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
```