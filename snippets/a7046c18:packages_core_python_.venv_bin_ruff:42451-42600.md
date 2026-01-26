# a7046c18:packages_core_python_.venv_bin_ruff:42451-42600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42451-42600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
The identifiers `self` and `cls` are conventional in Python for the first parameter of instance
methods and class methods, respectively. Assigning new values to these variables can be
confusing for others reading your code; using a different variable name can lead to clearer
code.

## Example

```python
class Version:
    def add(self, other):
        self = self + other
        return self

    @classmethod
    def superclass(cls):
        cls = cls.__mro__[-1]
        return cls
```

Use instead:
```python
class Version:
    def add(self, other):
        new_version = self + other
        return new_version

    @classmethod
    def superclass(cls):
        supercls = cls.__mro__[-1]
        return supercls
```

## Options

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`
## What it does
Checks for `except` clauses that attempt to catch multiple
exceptions with a binary operation (`and` or `or`).

## Why is this bad?
A binary operation will not catch multiple exceptions. Instead, the binary
operation will be evaluated first, and the result of _that_ operation will
be caught (for an `or` operation, this is typically the first exception in
the list). This is almost never the desired behavior.

## Example
```python
try:
    pass
except A or B:
    pass
```

Use instead:
```python
try:
    pass
except (A, B):
    pass
```
## What it does
Check for an invalid `mode` argument in `open` calls.

## Why is this bad?
The `open` function accepts a `mode` argument that specifies how the file
should be opened (e.g., read-only, write-only, append-only, etc.).

Python supports a variety of open modes: `r`, `w`, `a`, and `x`, to control
reading, writing, appending, and creating, respectively, along with
`b` (binary mode), `+` (read and write), and `U` (universal newlines),
the latter of which is only valid alongside `r`. This rule detects both
invalid combinations of modes and invalid characters in the mode string
itself.

## Example
```python
with open("file", "rwx") as f:
    content = f.read()
```

Use instead:

```python
with open("file", "r") as f:
    content = f.read()
```

## References
- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)
## What it does
Check for shallow `os.environ` copies.

## Why is this bad?
`os.environ` is not a `dict` object, but rather, a proxy object. As such, mutating a shallow
copy of `os.environ` will also mutate the original object.

See [BPO 15373] for more information.

## Example
```python
import copy
import os

env = copy.copy(os.environ)
```

Use instead:
```python
import os

env = os.environ.copy()
```

## Fix safety

This rule's fix is marked as unsafe because replacing a shallow copy with a deep copy can lead
to unintended side effects. If the program modifies the shallow copy at some point, changing it
to a deep copy may prevent those modifications from affecting the original data, potentially
altering the program's behavior.

## References
- [Python documentation: `copy` — Shallow and deep copy operations](https://docs.python.org/3/library/copy.html)
- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)

[BPO 15373]: https://bugs.python.org/issue15373
## What it does
Checks for `os.getenv` calls with invalid default values.

## Why is this bad?
If an environment variable is set, `os.getenv` will return its value as
a string. If the environment variable is _not_ set, `os.getenv` will
return `None`, or the default value if one is provided.

If the default value is not a string or `None`, then it will be
inconsistent with the return type of `os.getenv`, which can lead to
confusing behavior.

## Example
```python
import os

int(os.getenv("FOO", 1))
```

Use instead:
```python
import os

```