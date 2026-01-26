# a7046c18:packages_core_python_.venv_bin_ruff:40951-41100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:40951-41100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example

```python
class Foo:
    def bar(cls): ...

    bar = classmethod(bar)
```

Use instead:

```python
class Foo:
    @classmethod
    def bar(cls): ...
```
## What it does
Checks for the use of a staticmethod being made without the decorator.

## Why is this bad?
When it comes to consistency and readability, it's preferred to use the decorator.

## Example

```python
class Foo:
    def bar(arg1, arg2): ...

    bar = staticmethod(bar)
```

Use instead:

```python
class Foo:
    @staticmethod
    def bar(arg1, arg2): ...
```
## What it does
Checks for property definitions that accept function parameters.

## Why is this bad?
Properties cannot be called with parameters.

If you need to pass parameters to a property, create a method with the
desired parameters and call that method instead.

## Example

```python
class Cat:
    @property
    def purr(self, volume): ...
```

Use instead:

```python
class Cat:
    @property
    def purr(self): ...

    def purr_volume(self, volume): ...
```

## Options

- `lint.pydocstyle.property-decorators`

## References
- [Python documentation: `property`](https://docs.python.org/3/library/functions.html#property)
## What it does
Checks for submodule imports that are aliased to the submodule name.

## Why is this bad?
Using the `from` keyword to import the submodule is more concise and
readable.

## Example
```python
import concurrent.futures as futures
```

Use instead:
```python
from concurrent import futures
```

## Options

This rule will not trigger on imports required by the `isort` configuration.

- `lint.isort.required-imports`

## References
- [Python documentation: Submodules](https://docs.python.org/3/reference/import.html#submodules)
## What it does
Checks for classes with too many public methods

By default, this rule allows up to 20 public methods, as configured by
the [`lint.pylint.max-public-methods`] option.

## Why is this bad?
Classes with many public methods are harder to understand
and maintain.

Instead, consider refactoring the class into separate classes.

## Example
Assuming that `lint.pylint.max-public-methods` is set to 5:
```python
class Linter:
    def __init__(self):
        pass

    def pylint(self):
        pass

    def pylint_settings(self):
        pass

    def flake8(self):
        pass

    def flake8_settings(self):
        pass

    def pydocstyle(self):
        pass

    def pydocstyle_settings(self):
        pass
```

Use instead:
```python
class Linter:
    def __init__(self):
        self.pylint = Pylint()
        self.flake8 = Flake8()
        self.pydocstyle = Pydocstyle()

    def lint(self):
        pass


class Pylint:
    def lint(self):
        pass
```