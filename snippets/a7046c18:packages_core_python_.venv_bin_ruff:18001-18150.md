# a7046c18:packages_core_python_.venv_bin_ruff:18001-18150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:18001-18150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    def bar(cls: Type["Foo"]): ...
```
## What it does
Checks that public functions and methods have return type annotations.

## Why is this bad?
Type annotations are a good way to document the return types of functions. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any returned values, and the types expected by callers, match expectation.

## Example
```python
def add(a, b):
    return a + b
```

Use instead:
```python
def add(a: int, b: int) -> int:
    return a + b
```

## Availability

Because this rule relies on the third-party `typing_extensions` module for some Python versions,
its diagnostic will not be emitted, and no fix will be offered, if `typing_extensions` imports
have been disabled by the [`lint.typing-extensions`] linter option.

## Options

- `lint.typing-extensions`
## What it does
Checks that private functions and methods have return type annotations.

## Why is this bad?
Type annotations are a good way to document the return types of functions. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any returned values, and the types expected by callers, match expectation.

## Example
```python
def _add(a, b):
    return a + b
```

Use instead:
```python
def _add(a: int, b: int) -> int:
    return a + b
```

## Availability

Because this rule relies on the third-party `typing_extensions` module for some Python versions,
its diagnostic will not be emitted, and no fix will be offered, if `typing_extensions` imports
have been disabled by the [`lint.typing-extensions`] linter option.

## Options

- `lint.typing-extensions`
## What it does
Checks that "special" methods, like `__init__`, `__new__`, and `__call__`, have
return type annotations.

## Why is this bad?
Type annotations are a good way to document the return types of functions. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any returned values, and the types expected by callers, match expectation.

Note that type checkers often allow you to omit the return type annotation for
`__init__` methods, as long as at least one argument has a type annotation. To
opt in to this behavior, use the `mypy-init-return` setting in your `pyproject.toml`
or `ruff.toml` file:

```toml
[tool.ruff.lint.flake8-annotations]
mypy-init-return = true
```

## Example
```python
class Foo:
    def __init__(self, x: int):
        self.x = x
```

Use instead:
```python
class Foo:
    def __init__(self, x: int) -> None:
        self.x = x
```

## Options

- `lint.flake8-annotations.mypy-init-return`
## What it does
Checks that static methods have return type annotations.

## Why is this bad?
Type annotations are a good way to document the return types of functions. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any returned values, and the types expected by callers, match expectation.

## Example
```python
class Foo:
    @staticmethod
    def bar():
        return 1
```

Use instead:
```python
class Foo:
    @staticmethod
    def bar() -> int:
        return 1
```

## Options

- `lint.flake8-annotations.suppress-none-returning`
## What it does
Checks that class methods have return type annotations.

## Why is this bad?
Type annotations are a good way to document the return types of functions. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any returned values, and the types expected by callers, match expectation.

## Example
```python
class Foo:
    @classmethod
    def bar(cls):
        return 1
```

Use instead:
```python
class Foo:
    @classmethod
    def bar(cls) -> int:
        return 1
```

## Options

- `lint.flake8-annotations.suppress-none-returning`
```