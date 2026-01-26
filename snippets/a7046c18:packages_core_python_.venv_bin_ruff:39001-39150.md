# a7046c18:packages_core_python_.venv_bin_ruff:39001-39150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39001-39150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
import foo
import bar
import foo  # Redefinition of unused `foo` from line 1
```

Use instead:
```python
import foo
import bar
```

## Options

This rule ignores dummy variables, as determined by:

- `lint.dummy-variable-rgx`
## What it does
Checks for uses of undefined names.

## Why is this bad?
An undefined name is likely to raise `NameError` at runtime.

## Example
```python
def double():
    return n * 2  # raises `NameError` if `n` is undefined when `double` is called
```

Use instead:
```python
def double(n):
    return n * 2
```

## Options
- [`target-version`]: Can be used to configure which symbols Ruff will understand
  as being available in the `builtins` namespace.

## References
- [Python documentation: Naming and binding](https://docs.python.org/3/reference/executionmodel.html#naming-and-binding)
## What it does
Checks for undefined names in `__all__`.

## Why is this bad?
In Python, the `__all__` variable is used to define the names that are
exported when a module is imported as a wildcard (e.g.,
`from foo import *`). The names in `__all__` must be defined in the module,
but are included as strings.

Including an undefined name in `__all__` is likely to raise `NameError` at
runtime, when the module is imported.

In [preview], this rule will flag undefined names in `__init__.py` file,
even if those names implicitly refer to other modules in the package. Users
that rely on implicit exports should disable this rule in `__init__.py`
files via [`lint.per-file-ignores`].

## Example
```python
from foo import bar


__all__ = ["bar", "baz"]  # undefined name `baz` in `__all__`
```

Use instead:
```python
from foo import bar, baz


__all__ = ["bar", "baz"]
```

## References
- [Python documentation: `__all__`](https://docs.python.org/3/tutorial/modules.html#importing-from-a-package)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for undefined local variables.

## Why is this bad?
Referencing a local variable before it has been assigned will raise
an `UnboundLocalError` at runtime.

## Example
```python
x = 1


def foo():
    x += 1
```

Use instead:
```python
x = 1


def foo():
    global x
    x += 1
```
## What it does
Checks for the presence of unused variables in function scopes.

## Why is this bad?
A variable that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

## Example
```python
def foo():
    x = 1
    y = 2
    return x
```

Use instead:
```python
def foo():
    x = 1
    return x
```

## Fix safety

This rule's fix is marked as unsafe because removing an unused variable assignment may
delete comments that are attached to the assignment.

## See also

This rule does not apply to bindings in unpacked assignments (e.g. `x, y = 1, 2`). See
[`unused-unpacked-variable`][RUF059] for this case.

## Options
- `lint.dummy-variable-rgx`

[RUF059]: https://docs.astral.sh/ruff/rules/unused-unpacked-variable/
## What it does
Checks for local variables that are annotated but never used.

## Why is this bad?
Annotations are used to provide type hints to static type checkers. If a
```