# a7046c18:packages_core_python_.venv_bin_ruff:48151-48300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:48151-48300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [PEP-562] module-level `__getattr__` and `__dir__` functions

## Options

- [`lint.ruff.strictly-empty-init-modules`]

## References

- [`flake8-empty-init-modules`](https://github.com/samueljsb/flake8-empty-init-modules/)

[PEP-562]: https://peps.python.org/pep-0562/
## What it does
Checks for `noqa` directives that are no longer applicable.

## Why is this bad?
A `noqa` directive that no longer matches any diagnostic violations is
likely included by mistake, and should be removed to avoid confusion.

## Example
```python
import foo  # noqa: F401


def bar():
    foo.bar()
```

Use instead:
```python
import foo


def bar():
    foo.bar()
```

## Options
- `lint.external`

## References
- [Ruff error suppression](https://docs.astral.sh/ruff/linter/#error-suppression)
## What it does
Checks for `noqa` directives that use redirected rule codes.

## Why is this bad?
When one of Ruff's rule codes has been redirected, the implication is that the rule has
been deprecated in favor of another rule or code. To keep your codebase
consistent and up-to-date, prefer the canonical rule code over the deprecated
code.

## Example
```python
x = eval(command)  # noqa: PGH001
```

Use instead:
```python
x = eval(command)  # noqa: S307
```
## What it does
Checks for `noqa` codes that are invalid.

## Why is this bad?
Invalid rule codes serve no purpose and may indicate outdated code suppressions.

## Example
```python
import os  # noqa: XYZ999
```

Use instead:
```python
import os
```

Or if there are still valid codes needed:
```python
import os  # noqa: E402
```

## Options
- `lint.external`
## What it does
Checks for invalid suppression comments

## Why is this bad?
Invalid suppression comments are ignored by Ruff, and should either
be fixed or removed to avoid confusion.

## Example
```python
ruff: disable  # missing codes
```

Use instead:
```python
# ruff: disable[E501]
```

Or delete the invalid suppression comment.

## References
- [Ruff error suppression](https://docs.astral.sh/ruff/linter/#error-suppression)
## What it does
Checks for unmatched range suppression comments

## Why is this bad?
Unmatched range suppression comments can inadvertently suppress violations
over larger sections of code than intended, particularly at module scope.

## Example
```python
def foo():
    # ruff: disable[E501]  # unmatched
    REALLY_LONG_VALUES = [...]

    print(REALLY_LONG_VALUES)
```

Use instead:
```python
def foo():
    # ruff: disable[E501]
    REALLY_LONG_VALUES = [...]
    # ruff: enable[E501]

    print(REALLY_LONG_VALUES)
```

## References
- [Ruff error suppression](https://docs.astral.sh/ruff/linter/#error-suppression)
## What it does
Checks for any pyproject.toml that does not conform to the schema from the relevant PEPs.

## Why is this bad?
Your project may contain invalid metadata or configuration without you noticing

## Example
```toml
[project]
name = "crab"
version = "1.0.0"
authors = ["Ferris the Crab <ferris@example.org>"]
```

Use instead:
```toml
[project]
name = "crab"
version = "1.0.0"
```