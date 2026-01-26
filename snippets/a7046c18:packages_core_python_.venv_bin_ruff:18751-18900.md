# a7046c18:packages_core_python_.venv_bin_ruff:18751-18900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18751-18900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
import os

os.chmod("/etc/secrets.txt", 0o600)  # rw-------
```

## References
- [Python documentation: `os.chmod`](https://docs.python.org/3/library/os.html#os.chmod)
- [Python documentation: `stat`](https://docs.python.org/3/library/stat.html)
- [Common Weakness Enumeration: CWE-732](https://cwe.mitre.org/data/definitions/732.html)
## What it does
Checks for hardcoded bindings to all network interfaces (`0.0.0.0`).

## Why is this bad?
Binding to all network interfaces is insecure as it allows access from
unintended interfaces, which may be poorly secured or unauthorized.

Instead, bind to specific interfaces.

## Example
```python
ALLOWED_HOSTS = ["0.0.0.0"]
```

Use instead:
```python
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
```

## References
- [Common Weakness Enumeration: CWE-200](https://cwe.mitre.org/data/definitions/200.html)
## What it does
Checks for potential uses of hardcoded passwords in strings.

## Why is this bad?
Including a hardcoded password in source code is a security risk, as an
attacker could discover the password and use it to gain unauthorized
access.

Instead, store passwords and other secrets in configuration files,
environment variables, or other sources that are excluded from version
control.

## Example
```python
SECRET_KEY = "hunter2"
```

Use instead:
```python
import os

SECRET_KEY = os.environ["SECRET_KEY"]
```

## References
- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)
## What it does
Checks for potential uses of hardcoded passwords in function calls.

## Why is this bad?
Including a hardcoded password in source code is a security risk, as an
attacker could discover the password and use it to gain unauthorized
access.

Instead, store passwords and other secrets in configuration files,
environment variables, or other sources that are excluded from version
control.

## Example
```python
connect_to_server(password="hunter2")
```

Use instead:
```python
import os

connect_to_server(password=os.environ["PASSWORD"])
```

## References
- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)
## What it does
Checks for potential uses of hardcoded passwords in function argument
defaults.

## Why is this bad?
Including a hardcoded password in source code is a security risk, as an
attacker could discover the password and use it to gain unauthorized
access.

Instead, store passwords and other secrets in configuration files,
environment variables, or other sources that are excluded from version
control.

## Example

```python
def connect_to_server(password="hunter2"): ...
```

Use instead:

```python
import os


def connect_to_server(password=os.environ["PASSWORD"]): ...
```

## References
- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)
## What it does
Checks for the use of hardcoded temporary file or directory paths.

## Why is this bad?
The use of hardcoded paths for temporary files can be insecure. If an
attacker discovers the location of a hardcoded path, they can replace the
contents of the file or directory with a malicious payload.

Other programs may also read or write contents to these hardcoded paths,
causing unexpected behavior.

## Example
```python
with open("/tmp/foo.txt", "w") as file:
    ...
```

Use instead:
```python
import tempfile

with tempfile.NamedTemporaryFile() as file:
    ...
```

## Options
- `lint.flake8-bandit.hardcoded-tmp-directory`
- `lint.flake8-bandit.hardcoded-tmp-directory-extend`

## References
- [Common Weakness Enumeration: CWE-377](https://cwe.mitre.org/data/definitions/377.html)
- [Common Weakness Enumeration: CWE-379](https://cwe.mitre.org/data/definitions/379.html)
- [Python documentation: `tempfile`](https://docs.python.org/3/library/tempfile.html)
## What it does
Checks for uses of the `try`-`except`-`pass` pattern.

## Why is this bad?
```