# a7046c18:packages_core_python_.venv_bin_ruff:47851-48000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47851-48000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    print("got it!")
```

Use instead:

```python
print("got it!")
```
## What it does
Checks for non-contextmanager use of `pytest.raises`, `pytest.warns`, and `pytest.deprecated_call`.

## Why is this bad?
The context-manager form is more readable, easier to extend, and supports additional kwargs.

## Example
```python
import pytest


excinfo = pytest.raises(ValueError, int, "hello")
pytest.warns(UserWarning, my_function, arg)
pytest.deprecated_call(my_deprecated_function, arg1, arg2)
```

Use instead:
```python
import pytest


with pytest.raises(ValueError) as excinfo:
    int("hello")
with pytest.warns(UserWarning):
    my_function(arg)
with pytest.deprecated_call():
    my_deprecated_function(arg1, arg2)
```

## References
- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)
- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)
- [`pytest` documentation: `pytest.deprecated_call`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-deprecated-call)
## What it does
Checks for uses of `foo.__dict__.get("__annotations__")` or
`foo.__dict__["__annotations__"]` on Python 3.10+ and Python < 3.10 when
[typing-extensions](https://docs.astral.sh/ruff/settings/#lint_typing-extensions)
is enabled.

## Why is this bad?
Starting with Python 3.14, directly accessing `__annotations__` via
`foo.__dict__.get("__annotations__")` or `foo.__dict__["__annotations__"]`
will only return annotations if the class is defined under
`from __future__ import annotations`.

Therefore, it is better to use dedicated library functions like
`annotationlib.get_annotations` (Python 3.14+), `inspect.get_annotations`
(Python 3.10+), or `typing_extensions.get_annotations` (for Python < 3.10 if
[typing-extensions](https://pypi.org/project/typing-extensions/) is
available).

The benefits of using these functions include:
1.  **Avoiding Undocumented Internals:** They provide a stable, public API,
    unlike direct `__dict__` access which relies on implementation details.
2.  **Forward-Compatibility:** They are designed to handle changes in
    Python's annotation system across versions, ensuring your code remains
    robust (e.g., correctly handling the Python 3.14 behavior mentioned
    above).

See [Python Annotations Best Practices](https://docs.python.org/3.14/howto/annotations.html)
for alternatives.

## Example

```python
foo.__dict__.get("__annotations__", {})
# or
foo.__dict__["__annotations__"]
```

On Python 3.14+, use instead:
```python
import annotationlib

annotationlib.get_annotations(foo)
```

On Python 3.10+, use instead:
```python
import inspect

inspect.get_annotations(foo)
```

On Python < 3.10 with [typing-extensions](https://pypi.org/project/typing-extensions/)
installed, use instead:
```python
import typing_extensions

typing_extensions.get_annotations(foo)
```

## Fix safety

No autofix is currently provided for this rule.

## Fix availability

No autofix is currently provided for this rule.

## References
- [Python Annotations Best Practices](https://docs.python.org/3.14/howto/annotations.html)
## What it does
Checks for standard library functions which take a numeric `mode` argument
where a non-octal integer literal is passed.

## Why is this bad?

Numeric modes are made up of one to four octal digits. Converting a non-octal
integer to octal may not be the mode the author intended.

## Example

```python
os.chmod("foo", 644)
```

Use instead:

```python
os.chmod("foo", 0o644)
```

## Fix safety

There are two categories of fix, the first of which is where it looks like
the author intended to use an octal literal but the `0o` prefix is missing:

```python
os.chmod("foo", 400)
os.chmod("foo", 644)
```

This class of fix changes runtime behaviour. In the first case, `400`
corresponds to `0o620` (`u=rw,g=w,o=`). As this mode is not deemed likely,
it is changed to `0o400` (`u=r,go=`). Similarly, `644` corresponds to
`0o1204` (`u=ws,g=,o=r`) and is changed to `0o644` (`u=rw,go=r`).

The second category is decimal literals which are recognised as likely valid
but in decimal form:

```python
```