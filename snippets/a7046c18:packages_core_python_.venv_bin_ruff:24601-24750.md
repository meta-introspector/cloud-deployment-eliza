# a7046c18:packages_core_python_.venv_bin_ruff:24601-24750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:24601-24750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
from pandas import Series
```

Use instead:
```python
import pandas as pd

pd.Series
```

## Options
- `lint.flake8-import-conventions.banned-from`
## What it does
Checks for direct instantiation of `logging.Logger`, as opposed to using
`logging.getLogger()`.

## Why is this bad?
The [Logger Objects] documentation states that:

> Note that Loggers should NEVER be instantiated directly, but always
> through the module-level function `logging.getLogger(name)`.

If a logger is directly instantiated, it won't be added to the logger
tree, and will bypass all configuration. Messages logged to it will
only be sent to the "handler of last resort", skipping any filtering
or formatting.

## Example
```python
import logging

logger = logging.Logger(__name__)
```

Use instead:
```python
import logging

logger = logging.getLogger(__name__)
```

## Fix safety
This fix is always unsafe, as changing from `Logger` to `getLogger`
changes program behavior by will adding the logger to the logging tree.

[Logger Objects]: https://docs.python.org/3/library/logging.html#logger-objects
## What it does
Checks for any usage of `__cached__` and `__file__` as an argument to
`logging.getLogger()`.

## Why is this bad?
The [logging documentation] recommends this pattern:

```python
logging.getLogger(__name__)
```

Here, `__name__` is the fully qualified module name, such as `foo.bar`,
which is the intended format for logger names.

This rule detects probably-mistaken usage of similar module-level dunder constants:

* `__cached__` - the pathname of the module's compiled version, such as `foo/__pycache__/bar.cpython-311.pyc`.
* `__file__` - the pathname of the module, such as `foo/bar.py`.

## Example
```python
import logging

logger = logging.getLogger(__file__)
```

Use instead:
```python
import logging

logger = logging.getLogger(__name__)
```

## Fix safety
This fix is always unsafe, as changing the arguments to `getLogger` can change the
received logger object, and thus program behavior.

[logging documentation]: https://docs.python.org/3/library/logging.html#logger-objects
## What it does
Checks for `.exception()` logging calls outside of exception handlers.

## Why is this bad?
[The documentation] states:
> This function should only be called from an exception handler.

Calling `.exception()` outside of an exception handler
attaches `None` as exception information, leading to confusing messages:

```pycon
>>> logging.exception("example")
ERROR:root:example
NoneType: None
```

## Example

```python
import logging

logging.exception("Foobar")
```

Use instead:

```python
import logging

logging.error("Foobar")
```

## Fix safety
The fix, if available, will always be marked as unsafe, as it changes runtime behavior.

## Options

- `lint.logger-objects`

[The documentation]: https://docs.python.org/3/library/logging.html#logging.exception
## What it does
Checks for uses of `logging.exception()` with `exc_info` set to `False`.

## Why is this bad?
The `logging.exception()` method captures the exception automatically, but
accepts an optional `exc_info` argument to override this behavior. Setting
`exc_info` to `False` disables the automatic capture of the exception and
stack trace.

Instead of setting `exc_info` to `False`, prefer `logging.error()`, which
has equivalent behavior to `logging.exception()` with `exc_info` set to
`False`, but is clearer in intent.

## Example
```python
logging.exception("...", exc_info=False)
```

Use instead:
```python
logging.error("...")
```

## Options

- `lint.logger-objects`
```