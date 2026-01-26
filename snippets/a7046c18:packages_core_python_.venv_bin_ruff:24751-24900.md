# a7046c18:packages_core_python_.venv_bin_ruff:24751-24900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:24751-24900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for uses of `logging.WARN`.

## Why is this bad?
The `logging.WARN` constant is an undocumented alias for `logging.WARNING`.

Although it’s not explicitly deprecated, `logging.WARN` is not mentioned
in the `logging` documentation. Prefer `logging.WARNING` instead.

## Example
```python
import logging


logging.basicConfig(level=logging.WARN)
```

Use instead:
```python
import logging


logging.basicConfig(level=logging.WARNING)
```
## What it does
Checks for logging calls with `exc_info=` outside exception handlers.

## Why is this bad?
Using `exc_info=True` outside of an exception handler
attaches `None` as the exception information, leading to confusing messages:

```pycon
>>> logging.warning("Uh oh", exc_info=True)
WARNING:root:Uh oh
NoneType: None
```

## Example

```python
import logging


logging.warning("Foobar", exc_info=True)
```

Use instead:

```python
import logging


logging.warning("Foobar")
```

## Fix safety
The fix is always marked as unsafe, as it changes runtime behavior.

## Options

- `lint.logger-objects`
## What it does
Checks for usages of the following `logging` top-level functions:
`debug`, `info`, `warn`, `warning`, `error`, `critical`, `log`, `exception`.

## Why is this bad?
Using the root logger causes the messages to have no source information,
making them less useful for debugging.

## Example
```python
import logging

logging.info("Foobar")
```

Use instead:
```python
import logging

logger = logging.getLogger(__name__)
logger.info("Foobar")
```
## What it does
Checks for uses of `str.format` to format logging messages.

## Why is this bad?
The `logging` module provides a mechanism for passing additional values to
be logged using the `extra` keyword argument. This is more consistent, more
efficient, and less error-prone than formatting the string directly.

Using `str.format` to format a logging message requires that Python eagerly
format the string, even if the logging statement is never executed (e.g.,
if the log level is above the level of the logging statement), whereas
using the `extra` keyword argument defers formatting until required.

Additionally, the use of `extra` will ensure that the values are made
available to all handlers, which can then be configured to log the values
in a consistent manner.

As an alternative to `extra`, passing values as arguments to the logging
method can also be used to defer string formatting until required.

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

logging.info("{} - Something happened".format(user))
```

Use instead:
```python
import logging

logging.basicConfig(format="%(user_id)s - %(message)s", level=logging.INFO)

user = "Maria"

logging.info("Something happened", extra={"user_id": user})
```

Or:
```python
import logging

logging.basicConfig(format="%(message)s", level=logging.INFO)

user = "Maria"

logging.info("%s - Something happened", user)
```

## Options
```