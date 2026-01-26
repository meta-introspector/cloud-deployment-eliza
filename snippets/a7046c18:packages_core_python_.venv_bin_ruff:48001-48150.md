# a7046c18:packages_core_python_.venv_bin_ruff:48001-48150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:48001-48150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
os.chmod("foo", 256)
os.chmod("foo", 493)
```

`256` corresponds to `0o400` (`u=r,go=`) and `493` corresponds to `0o755`
(`u=rwx,go=rx`). Both of these fixes keep runtime behavior unchanged. If the
original code really intended to use `0o256` (`u=w,g=rx,o=rw`) instead of
`256`, this fix should not be accepted.

As a special case, zero is allowed to omit the `0o` prefix unless it has
multiple digits:

```python
os.chmod("foo", 0)  # Ok
os.chmod("foo", 0o000)  # Ok
os.chmod("foo", 000)  # Lint emitted and fix suggested
```

Ruff will suggest a safe fix for multi-digit zeros to add the `0o` prefix.

## Fix availability

A fix is only available if the integer literal matches a set of common modes.
## What it does
Checks for eager string conversion of arguments to `logging` calls.

## Why is this bad?
Arguments to `logging` calls will be formatted as strings automatically, so it
is unnecessary and less efficient to eagerly format the arguments before passing
them in.

## Known problems

This rule detects uses of the `logging` module via a heuristic.
Specifically, it matches against:

- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).
- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).
- Objects whose name starts with `log` or ends with `logger` or `logging`,
  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).
- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be
  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,
  when [`lint.logger-objects`] is set to `["module.logger"]`).

## Example
```python
import logging

logging.basicConfig(format="%(message)s", level=logging.INFO)

user = "Maria"

logging.info("%s - Something happened", str(user))
```

Use instead:
```python
import logging

logging.basicConfig(format="%(message)s", level=logging.INFO)

user = "Maria"

logging.info("%s - Something happened", user)
```

## Options
- `lint.logger-objects`

## References
- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)
- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)
## What it does
Detects class `@property` methods that does not have a `return` statement.

## Why is this bad?
Property methods are expected to return a computed value, a missing return in a property usually indicates an implementation mistake.

## Example
```python
class User:
    @property
    def full_name(self):
        f"{self.first_name} {self.last_name}"
```

Use instead:
```python
class User:
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
```

## References
- [Python documentation: The property class](https://docs.python.org/3/library/functions.html#property)
## What it does

Detects the presence of code in `__init__.py` files.

## Why is this bad?

`__init__.py` files are often empty or only contain simple code to modify a module's API. As
such, it's easy to overlook them and their possible side effects when debugging.

## Example

Instead of defining `MyClass` directly in `__init__.py`:

```python
"""My module docstring."""


class MyClass:
    def my_method(self): ...
```

move the definition to another file, import it, and include it in `__all__`:

```python
"""My module docstring."""

from submodule import MyClass

__all__ = ["MyClass"]
```

Code in `__init__.py` files is also run at import time and can cause surprising slowdowns. To
disallow any code in `__init__.py` files, you can enable the
[`lint.ruff.strictly-empty-init-modules`] setting. In this case:

```python
from submodule import MyClass

__all__ = ["MyClass"]
```

the only fix is entirely emptying the file:

```python
```

## Details

In non-strict mode, this rule allows several common patterns in `__init__.py` files:

- Imports
- Assignments to `__all__`, `__path__`, `__version__`, and `__author__`
- Module-level and attribute docstrings
- `if TYPE_CHECKING` blocks
```