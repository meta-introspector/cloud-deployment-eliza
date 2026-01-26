# a7046c18:packages_core_python_.venv_bin_ruff:17701-17850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:17701-17850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for uses of `six.PY3`.

## Why is this bad?
`six.PY3` will evaluate to `False` on Python 4 and greater. This is likely
unintended, and may cause code intended to run on Python 2 to run on Python 4
too.

Instead, use `not six.PY2` to validate that the current Python major version is
_not_ equal to 2, to future-proof the code.

## Example
```python
import six

six.PY3  # `False` on Python 4.
```

Use instead:
```python
import six

not six.PY2  # `True` on Python 4.
```

## References
- [PyPI: `six`](https://pypi.org/project/six/)
- [Six documentation: `six.PY2`](https://six.readthedocs.io/#six.PY2)
- [Six documentation: `six.PY3`](https://six.readthedocs.io/#six.PY3)
## What it does
Checks for comparisons that test `sys.version_info[1]` against an integer.

## Why is this bad?
Comparisons based on the current minor version number alone can cause
subtle bugs and would likely lead to unintended effects if the Python
major version number were ever incremented (e.g., to Python 4).

Instead, compare `sys.version_info` to a tuple, including the major and
minor version numbers, to future-proof the code.

## Example
```python
import sys

if sys.version_info[1] < 7:
    print("Python 3.6 or earlier.")  # This will be printed on Python 4.0.
```

Use instead:
```python
import sys

if sys.version_info < (3, 7):
    print("Python 3.6 or earlier.")
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for comparisons that test `sys.version_info.minor` against an integer.

## Why is this bad?
Comparisons based on the current minor version number alone can cause
subtle bugs and would likely lead to unintended effects if the Python
major version number were ever incremented (e.g., to Python 4).

Instead, compare `sys.version_info` to a tuple, including the major and
minor version numbers, to future-proof the code.

## Example
```python
import sys

if sys.version_info.minor < 7:
    print("Python 3.6 or earlier.")  # This will be printed on Python 4.0.
```

Use instead:
```python
import sys

if sys.version_info < (3, 7):
    print("Python 3.6 or earlier.")
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for uses of `sys.version[0]`.

## Why is this bad?
If the current major or minor version consists of multiple digits,
`sys.version[0]` will select the first digit of the major version number
only (e.g., `"10.2"` would evaluate to `"1"`). This is likely unintended,
and can lead to subtle bugs if the version string is used to test against a
major version number.

Instead, use `sys.version_info.major` to access the current major version
number.

## Example
```python
import sys

sys.version[0]  # If using Python 10, this evaluates to "1".
```

Use instead:
```python
import sys

f"{sys.version_info.major}"  # If using Python 10, this evaluates to "10".
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for comparisons that test `sys.version` against string literals,
such that the comparison would fail if the major version number were
ever incremented to Python 10 or higher.

## Why is this bad?
Comparing `sys.version` to a string is error-prone and may cause subtle
bugs, as the comparison will be performed lexicographically, not
semantically.

Instead, use `sys.version_info` to access the current major and minor
version numbers as a tuple, which can be compared to other tuples
without issue.

## Example
```python
import sys

sys.version >= "3"  # `False` on Python 10.
```

Use instead:
```python
import sys

sys.version_info >= (3,)  # `True` on Python 10.
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
```