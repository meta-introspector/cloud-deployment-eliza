# a7046c18:packages_core_python_.venv_bin_ruff:32551-32700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32551-32700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
class Example:
    @classmethod
    def function(self, data): ...
```

Use instead:

```python
class Example:
    @classmethod
    def function(cls, data): ...
```

## Fix safety
This rule's fix is marked as unsafe, as renaming a method parameter
can change the behavior of the program.

## Options
- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments
[PLW0211]: https://docs.astral.sh/ruff/rules/bad-staticmethod-argument/
## What it does
Checks for instance methods that use a name other than `self` for their
first argument.

## Why is this bad?
[PEP 8] recommends the use of `self` as first argument for all instance
methods:

> Always use self for the first argument to instance methods.
>
> If a function argument’s name clashes with a reserved keyword, it is generally better to
> append a single trailing underscore rather than use an abbreviation or spelling corruption.
> Thus `class_` is better than `clss`. (Perhaps better is to avoid such clashes by using a synonym.)

Names can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]
or [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,
to allow the use of `this` as the first argument to instance methods, set
the [`lint.pep8-naming.extend-ignore-names`] option to `["this"]`.

## Example

```python
class Example:
    def function(cls, data): ...
```

Use instead:

```python
class Example:
    def function(self, data): ...
```

## Fix safety
This rule's fix is marked as unsafe, as renaming a method parameter
can change the behavior of the program.

## Options
- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments
## What it does
Checks for the use of non-lowercase variable names in functions.

## Why is this bad?
[PEP 8] recommends that all function variables use lowercase names:

> Function names should be lowercase, with words separated by underscores as necessary to
> improve readability. Variable names follow the same convention as function names. mixedCase
> is allowed only in contexts where that's already the prevailing style (e.g. threading.py),
> to retain backwards compatibility.

## Example
```python
def my_function(a):
    B = a + 3
    return B
```

Use instead:
```python
def my_function(a):
    b = a + 3
    return b
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-variable-names
## What it does
Checks for functions with "dunder" names (that is, names with two
leading and trailing underscores) that are not documented.

## Why is this bad?
[PEP 8] recommends that only documented "dunder" methods are used:

> ..."magic" objects or attributes that live in user-controlled
> namespaces. E.g. `__init__`, `__import__` or `__file__`. Never invent
> such names; only use them as documented.

## Example
```python
def __my_function__():
    pass
```

Use instead:
```python
def my_function():
    pass
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for constant imports that are aliased to non-constant-style
names.

## Why is this bad?
[PEP 8] recommends naming conventions for classes, functions,
constants, and more. The use of inconsistent naming styles between
import and alias names may lead readers to expect an import to be of
another type (e.g., confuse a Python class with a constant).

Import aliases should thus follow the same naming style as the member
being imported.

## Example
```python
from example import CONSTANT_VALUE as ConstantValue
```

Use instead:
```python
from example import CONSTANT_VALUE
```

```