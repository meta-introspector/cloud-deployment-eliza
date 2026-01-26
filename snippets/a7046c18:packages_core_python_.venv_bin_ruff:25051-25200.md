# a7046c18:packages_core_python_.venv_bin_ruff:25051-25200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25051-25200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)
- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)
## What it does
Checks for uses of f-strings to format logging messages.

## Why is this bad?
The `logging` module provides a mechanism for passing additional values to
be logged using the `extra` keyword argument. This is more consistent, more
efficient, and less error-prone than formatting the string directly.

Using f-strings to format a logging message requires that Python eagerly
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

logging.info(f"{user} - Something happened")
```

Use instead:
```python
import logging

logging.basicConfig(format="%(user_id)s - %(message)s", level=logging.INFO)

user = "Maria"

logging.info("Something happened", extra=dict(user_id=user))
```

Or:
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
Checks for uses of `logging.warn` and `logging.Logger.warn`.

## Why is this bad?
`logging.warn` and `logging.Logger.warn` are deprecated in favor of
`logging.warning` and `logging.Logger.warning`, which are functionally
equivalent.

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

logging.warn("Something happened")
```

Use instead:
```python
import logging

logging.warning("Something happened")
```

## Options
- `lint.logger-objects`

## References
- [Python documentation: `logging.warning`](https://docs.python.org/3/library/logging.html#logging.warning)
- [Python documentation: `logging.Logger.warning`](https://docs.python.org/3/library/logging.html#logging.Logger.warning)
## What it does
Checks for `extra` keywords in logging statements that clash with
`LogRecord` attributes.

## Why is this bad?
The `logging` module provides a mechanism for passing additional values to
be logged using the `extra` keyword argument. These values are then passed
to the `LogRecord` constructor.

Providing a value via `extra` that clashes with one of the attributes of
the `LogRecord` constructor will raise a `KeyError` when the `LogRecord` is
constructed.

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

logging.basicConfig(format="%(name) - %(message)s", level=logging.INFO)

username = "Maria"

logging.info("Something happened", extra=dict(name=username))
```