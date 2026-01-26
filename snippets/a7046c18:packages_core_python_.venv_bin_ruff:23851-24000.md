# a7046c18:packages_core_python_.venv_bin_ruff:23851-24000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23851-24000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
from django.db.models.signals import post_save


@receiver(post_save, sender=MyModel)
@transaction.atomic
def my_handler(sender, instance, created, **kwargs):
    pass
```
## What it does
Checks for the use of string literals in exception constructors.

## Why is this bad?
Python includes the `raise` in the default traceback (and formatters
like Rich and IPython do too).

By using a string literal, the error message will be duplicated in the
traceback, which can make the traceback less readable.

## Example
Given:
```python
raise RuntimeError("'Some value' is incorrect")
```

Python will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 2, in <module>
    raise RuntimeError("'Some value' is incorrect")
RuntimeError: 'Some value' is incorrect
```

Instead, assign the string to a variable:
```python
msg = "'Some value' is incorrect"
raise RuntimeError(msg)
```

Which will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 3, in <module>
    raise RuntimeError(msg)
RuntimeError: 'Some value' is incorrect
```

## Options

- `lint.flake8-errmsg.max-string-length`
## What it does
Checks for the use of f-strings in exception constructors.

## Why is this bad?
Python includes the `raise` in the default traceback (and formatters
like Rich and IPython do too).

By using an f-string, the error message will be duplicated in the
traceback, which can make the traceback less readable.

## Example
Given:
```python
sub = "Some value"
raise RuntimeError(f"{sub!r} is incorrect")
```

Python will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 2, in <module>
    raise RuntimeError(f"{sub!r} is incorrect")
RuntimeError: 'Some value' is incorrect
```

Instead, assign the string to a variable:
```python
sub = "Some value"
msg = f"{sub!r} is incorrect"
raise RuntimeError(msg)
```

Which will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 3, in <module>
    raise RuntimeError(msg)
RuntimeError: 'Some value' is incorrect
```
## What it does
Checks for the use of `.format` calls on string literals in exception
constructors.

## Why is this bad?
Python includes the `raise` in the default traceback (and formatters
like Rich and IPython do too).

By using a `.format` call, the error message will be duplicated in the
traceback, which can make the traceback less readable.

## Example
Given:
```python
sub = "Some value"
raise RuntimeError("'{}' is incorrect".format(sub))
```

Python will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 2, in <module>
    raise RuntimeError("'{}' is incorrect".format(sub))
RuntimeError: 'Some value' is incorrect
```

Instead, assign the string to a variable:
```python
sub = "Some value"
msg = "'{}' is incorrect".format(sub)
raise RuntimeError(msg)
```

Which will produce a traceback like:
```console
Traceback (most recent call last):
  File "tmp.py", line 3, in <module>
    raise RuntimeError(msg)
RuntimeError: 'Some value' is incorrect
```
## What it does
Checks for a shebang directive in a file that is not executable.

## Why is this bad?
In Python, a shebang (also known as a hashbang) is the first line of a
script, which specifies the interpreter that should be used to run the
script.

The presence of a shebang suggests that a file is intended to be
executable. If a file contains a shebang but is not executable, then the
shebang is misleading, or the file is missing the executable bit.

If the file is meant to be executable, add the executable bit to the file
(e.g., `chmod +x __main__.py` or `git update-index --chmod=+x __main__.py`).

Otherwise, remove the shebang.

A file is considered executable if it has the executable bit set (i.e., its
permissions mode intersects with `0o111`). As such, _this rule is only
available on Unix-like systems_, and is not enforced on Windows or WSL.

## Example
```