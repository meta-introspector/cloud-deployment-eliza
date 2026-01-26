# a7046c18:packages_core_python_.venv_bin_ruff:43501-43650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43501-43650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import subprocess

subprocess.run(["foo"], universal_newlines=True)
```

Use instead:
```python
import subprocess

subprocess.run(["foo"], text=True)
```

## References
- [Python 3.7 release notes](https://docs.python.org/3/whatsnew/3.7.html#subprocess)
- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)
## What it does
Checks for uses of `subprocess.run` that send `stdout` and `stderr` to a
pipe.

## Why is this bad?
As of Python 3.7, `subprocess.run` has a `capture_output` keyword argument
that can be set to `True` to capture `stdout` and `stderr` outputs. This is
equivalent to setting `stdout` and `stderr` to `subprocess.PIPE`, but is
more explicit and readable.

## Example
```python
import subprocess

subprocess.run(["foo"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
```

Use instead:
```python
import subprocess

subprocess.run(["foo"], capture_output=True)
```

## Fix safety

This rule's fix is marked as unsafe because replacing `stdout=subprocess.PIPE` and
`stderr=subprocess.PIPE` with `capture_output=True` may delete comments attached
to the original arguments.

## References
- [Python 3.7 release notes](https://docs.python.org/3/whatsnew/3.7.html#subprocess)
- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)
## What it does
Checks for uses of the `xml.etree.cElementTree` module.

## Why is this bad?
In Python 3.3, `xml.etree.cElementTree` was deprecated in favor of
`xml.etree.ElementTree`.

## Example
```python
from xml.etree import cElementTree as ET
```

Use instead:
```python
from xml.etree import ElementTree as ET
```

## References
- [Python documentation: `xml.etree.ElementTree`](https://docs.python.org/3/library/xml.etree.elementtree.html)
## What it does
Checks for uses of exceptions that alias `OSError`.

## Why is this bad?
`OSError` is the builtin error type used for exceptions that relate to the
operating system.

In Python 3.3, a variety of other exceptions, like `WindowsError` were
aliased to `OSError`. These aliases remain in place for compatibility with
older versions of Python, but may be removed in future versions.

Prefer using `OSError` directly, as it is more idiomatic and future-proof.

## Example
```python
raise IOError
```

Use instead:
```python
raise OSError
```

## References
- [Python documentation: `OSError`](https://docs.python.org/3/library/exceptions.html#OSError)
## What it does
Checks for uses of the Unicode kind prefix (`u`) in strings.

## Why is this bad?
In Python 3, all strings are Unicode by default. The Unicode kind prefix is
unnecessary and should be removed to avoid confusion.

## Example
```python
u"foo"
```

Use instead:
```python
"foo"
```

## References
- [Python documentation: Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)
## What it does
Checks for imports of the `mock` module that should be replaced with
`unittest.mock`.

## Why is this bad?
Since Python 3.3, `mock` has been a part of the standard library as
`unittest.mock`. The `mock` package is deprecated; use `unittest.mock`
instead.

## Example
```python
import mock
```

Use instead:
```python
from unittest import mock
```

## Options

This rule will not trigger if the `mock` import is required by the `isort` configuration.

- `lint.isort.required-imports`

## References
- [Python documentation: `unittest.mock`](https://docs.python.org/3/library/unittest.mock.html)
- [PyPI: `mock`](https://pypi.org/project/mock/)
## Removed
There's no [evidence](https://github.com/astral-sh/ruff/issues/12754) that generators are
meaningfully faster than list comprehensions when combined with unpacking.

## What it does
Checks for list comprehensions that are immediately unpacked.

## Why is this bad?
There is no reason to use a list comprehension if the result is immediately
unpacked. Instead, use a generator expression, which avoids allocating
an intermediary list.
```