# a7046c18:packages_core_python_.venv_bin_ruff:39151-39300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39151-39300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
variable is annotated but never used, the annotation is unnecessary.

## Example
```python
def foo():
    bar: int
```

## Options

This rule ignores dummy variables, as determined by:

- `lint.dummy-variable-rgx`

## References
- [PEP 484 – Type Hints](https://peps.python.org/pep-0484/)
## What it does
Checks for `raise` statements that raise `NotImplemented`.

## Why is this bad?
`NotImplemented` is an exception used by binary special methods to indicate
that an operation is not implemented with respect to a particular type.

`NotImplemented` should not be raised directly. Instead, raise
`NotImplementedError`, which is used to indicate that the method is
abstract or not implemented in the derived class.

## Example
```python
class Foo:
    def bar(self):
        raise NotImplemented
```

Use instead:
```python
class Foo:
    def bar(self):
        raise NotImplementedError
```

## References
- [Python documentation: `NotImplemented`](https://docs.python.org/3/library/constants.html#NotImplemented)
- [Python documentation: `NotImplementedError`](https://docs.python.org/3/library/exceptions.html#NotImplementedError)
## Removed
This rule is identical to [S307] which should be used instead.

## What it does
Checks for uses of the builtin `eval()` function.

## Why is this bad?
The `eval()` function is insecure as it enables arbitrary code execution.

## Example
```python
def foo():
    x = eval(input("Enter a number: "))
    ...
```

Use instead:
```python
def foo():
    x = input("Enter a number: ")
    ...
```

## References
- [Python documentation: `eval`](https://docs.python.org/3/library/functions.html#eval)
- [_Eval really is dangerous_ by Ned Batchelder](https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html)

[S307]: https://docs.astral.sh/ruff/rules/suspicious-eval-usage/
## Removed
This rule is identical to [G010] which should be used instead.

## What it does
Check for usages of the deprecated `warn` method from the `logging` module.

## Why is this bad?
The `warn` method is deprecated. Use `warning` instead.

## Example
```python
import logging


def foo():
    logging.warn("Something happened")
```

Use instead:
```python
import logging


def foo():
    logging.warning("Something happened")
```

## References
- [Python documentation: `logger.Logger.warning`](https://docs.python.org/3/library/logging.html#logging.Logger.warning)

[G010]: https://docs.astral.sh/ruff/rules/logging-warn/
## What it does
Check for `type: ignore` annotations that suppress all type warnings, as
opposed to targeting specific type warnings.

## Why is this bad?
Suppressing all warnings can hide issues in the code.

Blanket `type: ignore` annotations are also more difficult to interpret and
maintain, as the annotation does not clarify which warnings are intended
to be suppressed.

## Example
```python
from foo import secrets  # type: ignore
```

Use instead:
```python
from foo import secrets  # type: ignore[attr-defined]
```

## References
Mypy supports a [built-in setting](https://mypy.readthedocs.io/en/stable/error_code_list2.html#check-that-type-ignore-include-an-error-code-ignore-without-code)
to enforce that all `type: ignore` annotations include an error code, akin
to enabling this rule:
```toml
[tool.mypy]
enable_error_code = ["ignore-without-code"]
```
## What it does
Check for `noqa` annotations that suppress all diagnostics, as opposed to
targeting specific diagnostics.

## Why is this bad?
Suppressing all diagnostics can hide issues in the code.

Blanket `noqa` annotations are also more difficult to interpret and
maintain, as the annotation does not clarify which diagnostics are intended
to be suppressed.

## Example
```python
from .base import *  # noqa
```

Use instead:
```python
```