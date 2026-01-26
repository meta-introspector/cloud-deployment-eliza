# a7046c18:packages_core_python_.venv_bin_ruff:37951-38100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:37951-38100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
@overload
def factorial(n: int) -> int: ...


@overload
def factorial(n: float) -> float: ...


def factorial(n):
    """Return the factorial of n."""


factorial.__doc__  # "Return the factorial of n."
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [Python documentation: `typing.overload`](https://docs.python.org/3/library/typing.html#typing.overload)
## What it does
Checks for empty docstrings.

## Why is this bad?
An empty docstring is indicative of incomplete documentation. It should either
be removed or replaced with a meaningful docstring.

## Example
```python
def average(values: list[float]) -> float:
    """"""
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
Checks for unused imports.

## Why is this bad?
Unused imports add a performance overhead at runtime, and risk creating
import cycles. They also increase the cognitive load of reading the code.

If an import statement is used to check for the availability or existence
of a module, consider using `importlib.util.find_spec` instead.

If an import statement is used to re-export a symbol as part of a module's
public interface, consider using a "redundant" import alias, which
instructs Ruff (and other tools) to respect the re-export, and avoid
marking it as unused, as in:

```python
from module import member as member
```

Alternatively, you can use `__all__` to declare a symbol as part of the module's
interface, as in:

```python
# __init__.py
import some_module

__all__ = ["some_module"]
```

## Preview
When [preview] is enabled (and certain simplifying assumptions
are met), we analyze all import statements for a given module
when determining whether an import is used, rather than simply
the last of these statements. This can result in both different and
more import statements being marked as unused.

For example, if a module consists of

```python
import a
import a.b
```

then both statements are marked as unused under [preview], whereas
only the second is marked as unused under stable behavior.

As another example, if a module consists of

```python
import a.b
import a

a.b.foo()
```

then a diagnostic will only be emitted for the first line under [preview],
whereas a diagnostic would only be emitted for the second line under
stable behavior.

Note that this behavior is somewhat subjective and is designed
to conform to the developer's intuition rather than Python's actual
execution. To wit, the statement `import a.b` automatically executes
`import a`, so in some sense `import a` is _always_ redundant
in the presence of `import a.b`.


## Fix safety

Fixes to remove unused imports are safe, except in `__init__.py` files.

Applying fixes to `__init__.py` files is currently in preview. The fix offered depends on the
type of the unused import. Ruff will suggest a safe fix to export first-party imports with
either a redundant alias or, if already present in the file, an `__all__` entry. If multiple
`__all__` declarations are present, Ruff will not offer a fix. Ruff will suggest an unsafe fix
to remove third-party and standard library imports -- the fix is unsafe because the module's
interface changes.

See [this FAQ section](https://docs.astral.sh/ruff/faq/#how-does-ruff-determine-which-of-my-imports-are-first-party-third-party-etc)
for more details on how Ruff
determines whether an import is first or third-party.

## Example

```python
import numpy as np  # unused import


def area(radius):
    return 3.14 * radius**2
```

Use instead:

```python
def area(radius):
    return 3.14 * radius**2
```

To check the availability of a module, use `importlib.util.find_spec`:

```python
```