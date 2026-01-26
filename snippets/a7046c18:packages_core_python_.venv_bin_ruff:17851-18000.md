# a7046c18:packages_core_python_.venv_bin_ruff:17851-18000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:17851-18000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for uses of `sys.version[:1]`.

## Why is this bad?
If the major version number consists of more than one digit, this will
select the first digit of the major version number only (e.g., `"10.0"`
would evaluate to `"1"`). This is likely unintended, and can lead to subtle
bugs in future versions of Python if the version string is used to test
against a specific major version number.

Instead, use `sys.version_info.major` to access the current major version
number.

## Example
```python
import sys

sys.version[:1]  # If using Python 10, this evaluates to "1".
```

Use instead:
```python
import sys

f"{sys.version_info.major}"  # If using Python 10, this evaluates to "10".
```

## References
- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks that function arguments have type annotations.

## Why is this bad?
Type annotations are a good way to document the types of function arguments. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any provided arguments match expectation.

## Example

```python
def foo(x): ...
```

Use instead:

```python
def foo(x: int): ...
```

## Options
- `lint.flake8-annotations.suppress-dummy-args`
## What it does
Checks that function `*args` arguments have type annotations.

## Why is this bad?
Type annotations are a good way to document the types of function arguments. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any provided arguments match expectation.

## Example

```python
def foo(*args): ...
```

Use instead:

```python
def foo(*args: int): ...
```

## Options
- `lint.flake8-annotations.suppress-dummy-args`
## What it does
Checks that function `**kwargs` arguments have type annotations.

## Why is this bad?
Type annotations are a good way to document the types of function arguments. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any provided arguments match expectation.

## Example

```python
def foo(**kwargs): ...
```

Use instead:

```python
def foo(**kwargs: int): ...
```

## Options
- `lint.flake8-annotations.suppress-dummy-args`
## Removed
This rule has been removed because type checkers can infer this type without annotation.

## What it does
Checks that instance method `self` arguments have type annotations.

## Why is this bad?
Type annotations are a good way to document the types of function arguments. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any provided arguments match expectation.

Note that many type checkers will infer the type of `self` automatically, so this
annotation is not strictly necessary.

## Example

```python
class Foo:
    def bar(self): ...
```

Use instead:

```python
class Foo:
    def bar(self: "Foo"): ...
```
## Removed
This rule has been removed because type checkers can infer this type without annotation.

## What it does
Checks that class method `cls` arguments have type annotations.

## Why is this bad?
Type annotations are a good way to document the types of function arguments. They also
help catch bugs, when used alongside a type checker, by ensuring that the types of
any provided arguments match expectation.

Note that many type checkers will infer the type of `cls` automatically, so this
annotation is not strictly necessary.

## Example

```python
class Foo:
    @classmethod
    def bar(cls): ...
```

Use instead:

```python
class Foo:
    @classmethod
```