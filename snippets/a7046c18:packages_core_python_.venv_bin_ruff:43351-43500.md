# a7046c18:packages_core_python_.venv_bin_ruff:43351-43500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43351-43500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Use instead:
```python
from typing import NamedTuple


class Foo(NamedTuple):
    a: int
    b: str
```

## Fix safety
This rule's fix is marked as unsafe if there are any comments within the
range of the `NamedTuple` definition, as these will be dropped by the
autofix.

## References
- [Python documentation: `typing.NamedTuple`](https://docs.python.org/3/library/typing.html#typing.NamedTuple)
## What it does
Checks for redundant `open` mode arguments.

## Why is this bad?
Redundant `open` mode arguments are unnecessary and should be removed to
avoid confusion.

## Example
```python
with open("foo.txt", "r") as f:
    ...
```

Use instead:
```python
with open("foo.txt") as f:
    ...
```

## References
- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)
## What it does
Checks for uses of `datetime.timezone.utc`.

## Why is this bad?
As of Python 3.11, `datetime.UTC` is an alias for `datetime.timezone.utc`.
The alias is more readable and generally preferred over the full path.

## Example
```python
import datetime

datetime.timezone.utc
```

Use instead:
```python
import datetime

datetime.UTC
```

## Options
- `target-version`

## References
- [Python documentation: `datetime.UTC`](https://docs.python.org/3/library/datetime.html#datetime.UTC)
## What it does
Checks for unnecessary calls to `str`, `bytes`, `int`, `float`, and `bool`.

## Why is this bad?
The mentioned constructors can be replaced with their respective literal
forms, which are more readable and idiomatic.

## Example
```python
str("foo")
```

Use instead:
```python
"foo"
```

## Fix safety
The fix is marked as unsafe if it might remove comments.

## References
- [Python documentation: `str`](https://docs.python.org/3/library/stdtypes.html#str)
- [Python documentation: `bytes`](https://docs.python.org/3/library/stdtypes.html#bytes)
- [Python documentation: `int`](https://docs.python.org/3/library/functions.html#int)
- [Python documentation: `float`](https://docs.python.org/3/library/functions.html#float)
- [Python documentation: `bool`](https://docs.python.org/3/library/functions.html#bool)
## What it does
Checks for uses of `typing.Text`.

In preview mode, also checks for `typing_extensions.Text`.

## Why is this bad?
`typing.Text` is an alias for `str`, and only exists for Python 2
compatibility. As of Python 3.11, `typing.Text` is deprecated. Use `str`
instead.

## Example
```python
from typing import Text

foo: Text = "bar"
```

Use instead:
```python
foo: str = "bar"
```

## References
- [Python documentation: `typing.Text`](https://docs.python.org/3/library/typing.html#typing.Text)
## What it does
Checks for uses of `io.open`.

## Why is this bad?
In Python 3, `io.open` is an alias for `open`. Prefer using `open` directly,
as it is more idiomatic.

## Example
```python
import io

with io.open("file.txt") as f:
    ...
```

Use instead:
```python
with open("file.txt") as f:
    ...
```

## References
- [Python documentation: `io.open`](https://docs.python.org/3/library/io.html#io.open)
## What it does
Checks for uses of `subprocess.run` that set the `universal_newlines`
keyword argument.

## Why is this bad?
As of Python 3.7, the `universal_newlines` keyword argument has been
renamed to `text`, and now exists for backwards compatibility. The
`universal_newlines` keyword argument may be removed in a future version of
Python. Prefer `text`, which is more explicit and readable.

## Example
```python
```