# a7046c18:packages_core_python_.venv_bin_ruff:25201-25350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25201-25350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:
```python
import logging

logging.basicConfig(format="%(user_id)s - %(message)s", level=logging.INFO)

username = "Maria"

logging.info("Something happened", extra=dict(user_id=username))
```

## Options
- `lint.logger-objects`

## References
- [Python documentation: LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
## What it does
Checks for uses of `logging.error` that pass `exc_info=True`.

## Why is this bad?
Calling `logging.error` with `exc_info=True` is equivalent to calling
`logging.exception`. Using `logging.exception` is more concise, more
readable, and conveys the intent of the logging statement more clearly.

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

try:
    ...
except ValueError:
    logging.error("Exception occurred", exc_info=True)
```

Use instead:
```python
import logging

try:
    ...
except ValueError:
    logging.exception("Exception occurred")
```

## Options
- `lint.logger-objects`

## References
- [Python documentation: `logging.exception`](https://docs.python.org/3/library/logging.html#logging.exception)
- [Python documentation: `exception`](https://docs.python.org/3/library/logging.html#logging.Logger.exception)
- [Python documentation: `logging.error`](https://docs.python.org/3/library/logging.html#logging.error)
- [Python documentation: `error`](https://docs.python.org/3/library/logging.html#logging.Logger.error)
## What it does
Checks for redundant `exc_info` keyword arguments in logging statements.

## Why is this bad?
`exc_info` is `True` by default for `logging.exception`, and `False` by
default for `logging.error`.

Passing `exc_info=True` to `logging.exception` calls is redundant, as is
passing `exc_info=False` to `logging.error` calls.

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

try:
    ...
except ValueError:
    logging.exception("Exception occurred", exc_info=True)
```

Use instead:
```python
import logging

try:
    ...
except ValueError:
    logging.exception("Exception occurred")
```

## Options
- `lint.logger-objects`

## References
- [Python documentation: `logging.exception`](https://docs.python.org/3/library/logging.html#logging.exception)
- [Python documentation: `exception`](https://docs.python.org/3/library/logging.html#logging.Logger.exception)
- [Python documentation: `logging.error`](https://docs.python.org/3/library/logging.html#logging.error)
- [Python documentation: `error`](https://docs.python.org/3/library/logging.html#logging.Logger.error)
## What it does
Checks for packages that are missing an `__init__.py` file.

## Why is this bad?
Python packages are directories that contain a file named `__init__.py`.
The existence of this file indicates that the directory is a Python
package, and so it can be imported the same way a module can be
imported.

Directories that lack an `__init__.py` file can still be imported, but
they're indicative of a special kind of package, known as a "namespace
package" (see: [PEP 420](https://peps.python.org/pep-0420/)).
Namespace packages are less widely used, so a package that lacks an
`__init__.py` file is typically meant to be a regular package, and
the absence of the `__init__.py` file is probably an oversight.

## Options
- `namespace-packages`
## What it does
Checks for unnecessary `pass` statements and ellipsis (`...`) literals in
functions, classes, and other blocks.

## Why is this bad?
In Python, the `pass` statement and ellipsis (`...`) literal serve as
placeholders, allowing for syntactically correct empty code blocks. The
primary purpose of these nodes is to avoid syntax errors in situations
where a statement or expression is syntactically required, but no code
needs to be executed.

If a `pass` or ellipsis is present in a code block that includes at least
one other statement (even, e.g., a docstring), it is unnecessary and should
be removed.
```