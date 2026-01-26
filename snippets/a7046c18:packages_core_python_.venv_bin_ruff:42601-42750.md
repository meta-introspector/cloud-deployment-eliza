# a7046c18:packages_core_python_.venv_bin_ruff:42601-42750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42601-42750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
int(os.getenv("FOO", "1"))
```
## What it does
Checks for uses of `subprocess.Popen` with a `preexec_fn` argument.

## Why is this bad?
The `preexec_fn` argument is unsafe within threads as it can lead to
deadlocks. Furthermore, `preexec_fn` is [targeted for deprecation].

Instead, consider using task-specific arguments such as `env`,
`start_new_session`, and `process_group`. These are not prone to deadlocks
and are more explicit.

## Example
```python
import os, subprocess

subprocess.Popen(foo, preexec_fn=os.setsid)
subprocess.Popen(bar, preexec_fn=os.setpgid(0, 0))
```

Use instead:
```python
import subprocess

subprocess.Popen(foo, start_new_session=True)
subprocess.Popen(bar, process_group=0)  # Introduced in Python 3.11
```

## References
- [Python documentation: `subprocess.Popen`](https://docs.python.org/3/library/subprocess.html#popen-constructor)
- [Why `preexec_fn` in `subprocess.Popen` may lead to deadlock?](https://discuss.python.org/t/why-preexec-fn-in-subprocess-popen-may-lead-to-deadlock/16908/2)

[targeted for deprecation]: https://github.com/python/cpython/issues/82616
## What it does
Checks for uses of `subprocess.run` without an explicit `check` argument.

## Why is this bad?
By default, `subprocess.run` does not check the return code of the process
it runs. This can lead to silent failures.

Instead, consider using `check=True` to raise an exception if the process
fails, or set `check=False` explicitly to mark the behavior as intentional.

## Example
```python
import subprocess

subprocess.run(["ls", "nonexistent"])  # No exception raised.
```

Use instead:
```python
import subprocess

subprocess.run(["ls", "nonexistent"], check=True)  # Raises exception.
```

Or:
```python
import subprocess

subprocess.run(["ls", "nonexistent"], check=False)  # Explicitly no check.
```

## Fix safety

This rule's fix is marked as display-only because it's not clear whether the
potential exception was meant to be ignored by setting `check=False` or if
the author simply forgot to include `check=True`. The fix adds
`check=False`, making the existing behavior explicit but possibly masking
the original intention.

## References
- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)
## What it does
Checks for uses of `open` and related calls without an explicit `encoding`
argument.

## Why is this bad?
Using `open` in text mode without an explicit encoding can lead to
non-portable code, with differing behavior across platforms. While readers
may assume that UTF-8 is the default encoding, in reality, the default
is locale-specific.

Instead, consider using the `encoding` parameter to enforce a specific
encoding. [PEP 597] recommends the use of `encoding="utf-8"` as a default,
and suggests that it may become the default in future versions of Python.

If a locale-specific encoding is intended, use `encoding="locale"`  on
Python 3.10 and later, or `locale.getpreferredencoding()` on earlier versions,
to make the encoding explicit.

## Fix safety
This fix is always unsafe and may change the program's behavior. It forces
`encoding="utf-8"` as the default, regardless of the platform’s actual default
encoding, which may cause `UnicodeDecodeError` on non-UTF-8 systems.
```python
with open("test.txt") as f:
    print(f.read()) # before fix (on UTF-8 systems): 你好，世界！
with open("test.txt", encoding="utf-8") as f:
    print(f.read()) # after fix (on Windows): UnicodeDecodeError
```

## Example
```python
open("file.txt")
```

Use instead:
```python
open("file.txt", encoding="utf-8")
```

## References
- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)

[PEP 597]: https://peps.python.org/pep-0597/
## What it does
Checks for classes that implement `__eq__` but not `__hash__`.

## Why is this bad?
A class that implements `__eq__` but not `__hash__` will have its hash
method implicitly set to `None`, regardless of if a superclass defines
`__hash__`. This will cause the class to be unhashable, which will in turn
cause issues when using instances of the class as keys in a dictionary or
members of a set.

## Example

```python
class Person:
    def __init__(self):
        self.name = "monty"

    def __eq__(self, other):
        return isinstance(other, Person) and other.name == self.name
```

Use instead:

```python
class Person:
    def __init__(self):
        self.name = "monty"

    def __eq__(self, other):
        return isinstance(other, Person) and other.name == self.name

    def __hash__(self):
```