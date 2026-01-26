# a7046c18:packages_core_python_.venv_bin_ruff:18901-19050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18901-19050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
The `try`-`except`-`pass` pattern suppresses all exceptions. Suppressing
exceptions may hide errors that could otherwise reveal unexpected behavior,
security vulnerabilities, or malicious activity. Instead, consider logging
the exception.

## Example
```python
try:
    ...
except Exception:
    pass
```

Use instead:
```python
import logging

try:
    ...
except Exception as exc:
    logging.exception("Exception occurred")
```

## Options
- `lint.flake8-bandit.check-typed-exception`

## References
- [Common Weakness Enumeration: CWE-703](https://cwe.mitre.org/data/definitions/703.html)
- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)
## What it does
Checks for uses of the `try`-`except`-`continue` pattern.

## Why is this bad?
The `try`-`except`-`continue` pattern suppresses all exceptions.
Suppressing exceptions may hide errors that could otherwise reveal
unexpected behavior, security vulnerabilities, or malicious activity.
Instead, consider logging the exception.

## Example
```python
import logging

while predicate:
    try:
        ...
    except Exception:
        continue
```

Use instead:
```python
import logging

while predicate:
    try:
        ...
    except Exception as exc:
        logging.exception("Error occurred")
```

## Options
- `lint.flake8-bandit.check-typed-exception`

## References
- [Common Weakness Enumeration: CWE-703](https://cwe.mitre.org/data/definitions/703.html)
- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)
## What it does
Checks for uses of the Python `requests` or `httpx` module that omit the
`timeout` parameter.

## Why is this bad?
The `timeout` parameter is used to set the maximum time to wait for a
response from the server. By omitting the `timeout` parameter, the program
may hang indefinitely while awaiting a response.

## Example
```python
import requests

requests.get("https://www.example.com/")
```

Use instead:
```python
import requests

requests.get("https://www.example.com/", timeout=10)
```

## References
- [Requests documentation: Timeouts](https://requests.readthedocs.io/en/latest/user/advanced/#timeouts)
- [httpx documentation: Timeouts](https://www.python-httpx.org/advanced/timeouts/)
## What it does
Checks for uses of `debug=True` in Flask.

## Why is this bad?
Enabling debug mode shows an interactive debugger in the browser if an
error occurs, and allows running arbitrary Python code from the browser.
This could leak sensitive information, or allow an attacker to run
arbitrary code.

## Example
```python
from flask import Flask

app = Flask()

app.run(debug=True)
```

Use instead:
```python
import os

from flask import Flask

app = Flask()

app.run(debug=os.environ["ENV"] == "dev")
```

## References
- [Flask documentation: Debug Mode](https://flask.palletsprojects.com/en/latest/quickstart/#debug-mode)
## What it does
Checks for uses of `tarfile.extractall`.

## Why is this bad?

Extracting archives from untrusted sources without prior inspection is
a security risk, as maliciously crafted archives may contain files that
will be written outside of the target directory. For example, the archive
could include files with absolute paths (e.g., `/etc/passwd`), or relative
paths with parent directory references (e.g., `../etc/passwd`).

On Python 3.12 and later, use `filter='data'` to prevent the most dangerous
security issues (see: [PEP 706]). On earlier versions, set the `members`
argument to a trusted subset of the archive's members.

## Example
```python
import tarfile
import tempfile

tar = tarfile.open(filename)
tar.extractall(path=tempfile.mkdtemp())
tar.close()
```

## References
- [Common Weakness Enumeration: CWE-22](https://cwe.mitre.org/data/definitions/22.html)
```