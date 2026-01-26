# a7046c18:packages_core_python_.venv_bin_ruff:20401-20550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20401-20550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
import os


def insecure_function(arbitrary_user_input: str):
    os.spawnlp(os.P_NOWAIT, "/bin/mycmd", "mycmd", arbitrary_user_input)
```

[S605]: https://docs.astral.sh/ruff/rules/start-process-with-a-shell
## What it does
Checks for the starting of a process with a partial executable path.

## Why is this bad?
Starting a process with a partial executable path can allow attackers to
execute an arbitrary executable by adjusting the `PATH` environment variable.
Consider using a full path to the executable instead.

## Example
```python
import subprocess

subprocess.Popen(["ruff", "check", "file.py"])
```

Use instead:
```python
import subprocess

subprocess.Popen(["/usr/bin/ruff", "check", "file.py"])
```

## References
- [Python documentation: `subprocess.Popen()`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)
- [Common Weakness Enumeration: CWE-426](https://cwe.mitre.org/data/definitions/426.html)
## What it does
Checks for strings that resemble SQL statements involved in some form
string building operation.

## Why is this bad?
SQL injection is a common attack vector for web applications. Directly
interpolating user input into SQL statements should always be avoided.
Instead, favor parameterized queries, in which the SQL statement is
provided separately from its parameters, as supported by `psycopg3`
and other database drivers and ORMs.

## Example
```python
query = "DELETE FROM foo WHERE id = '%s'" % identifier
```

## References
- [B608: Test for SQL injection](https://bandit.readthedocs.io/en/latest/plugins/b608_hardcoded_sql_expressions.html)
- [psycopg3: Server-side binding](https://www.psycopg.org/psycopg3/docs/basic/from_pg2.html#server-side-binding)
## What it does
Checks for possible wildcard injections in calls to `subprocess.Popen()`.

## Why is this bad?
Wildcard injections can lead to unexpected behavior if unintended files are
matched by the wildcard. Consider using a more specific path instead.

## Example
```python
import subprocess

subprocess.Popen(["chmod", "777", "*.py"], shell=True)
```

Use instead:
```python
import subprocess

subprocess.Popen(["chmod", "777", "main.py"], shell=True)
```

## References
- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)
## What it does
Checks for uses of Django's `extra` function where one or more arguments
passed are not literal expressions.

## Why is this bad?
Django's `extra` function can be used to execute arbitrary SQL queries,
which can in turn lead to SQL injection vulnerabilities.

## Example
```python
from django.contrib.auth.models import User

# String interpolation creates a security loophole that could be used
# for SQL injection:
User.objects.all().extra(select={"test": "%secure" % "nos"})
```

Use instead:
```python
from django.contrib.auth.models import User

# SQL injection is impossible if all arguments are literal expressions:
User.objects.all().extra(select={"test": "secure"})
```

## References
- [Django documentation: SQL injection protection](https://docs.djangoproject.com/en/dev/topics/security/#sql-injection-protection)
- [Common Weakness Enumeration: CWE-89](https://cwe.mitre.org/data/definitions/89.html)
## What it does
Checks for uses of Django's `RawSQL` function.

## Why is this bad?
Django's `RawSQL` function can be used to execute arbitrary SQL queries,
which can in turn lead to SQL injection vulnerabilities.

## Example
```python
from django.db.models.expressions import RawSQL
from django.contrib.auth.models import User

User.objects.annotate(val=RawSQL("%s" % input_param, []))
```

## References
- [Django documentation: SQL injection protection](https://docs.djangoproject.com/en/dev/topics/security/#sql-injection-protection)
- [Common Weakness Enumeration: CWE-89](https://cwe.mitre.org/data/definitions/89.html)
## What it does
Checks for insecure `logging.config.listen` calls.

## Why is this bad?
`logging.config.listen` starts a server that listens for logging
configuration requests. This is insecure, as parts of the configuration are
passed to the built-in `eval` function, which can be used to execute
arbitrary code.

## Example
```python
import logging

logging.config.listen(9999)
```

## References
- [Python documentation: `logging.config.listen()`](https://docs.python.org/3/library/logging.config.html#logging.config.listen)
## What it does
Checks for `jinja2` templates that use `autoescape=False`.

## Why is this bad?
`jinja2` templates that use `autoescape=False` are vulnerable to cross-site
scripting (XSS) attacks that allow attackers to execute arbitrary
JavaScript.

```