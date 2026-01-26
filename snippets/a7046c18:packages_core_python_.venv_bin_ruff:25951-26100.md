# a7046c18:packages_core_python_.venv_bin_ruff:25951-26100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:25951-26100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
def double(x: int) -> int: ...
```

## References
- [Typing documentation - Writing and Maintaining Stub Files](https://typing.python.org/en/latest/guides/writing_stubs.html)
## What it does
Checks for typed function arguments in stubs with complex default values.

## Why is this bad?
Stub (`.pyi`) files exist as "data files" for static analysis tools, and
are not evaluated at runtime. While simple default values may be useful for
some tools that consume stubs, such as IDEs, they are ignored by type
checkers.

Instead of including and reproducing a complex value, use `...` to indicate
that the assignment has a default value, but that the value is "complex" or
varies according to the current platform or Python version. For the
purposes of this rule, any default value counts as "complex" unless it is
a literal `int`, `float`, `complex`, `bytes`, `str`, `bool`, `None`, `...`,
or a simple container literal.

## Example

```pyi
def foo(arg: list[int] = list(range(10_000))) -> None: ...
```

Use instead:

```pyi
def foo(arg: list[int] = ...) -> None: ...
```

## References
- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)
## What it does
Checks for the presence of the `pass` statement in non-empty class bodies
in `.pyi` files.

## Why is this bad?
The `pass` statement is always unnecessary in non-empty class bodies in
stubs.

## Example
```pyi
class MyClass:
    x: int
    pass
```

Use instead:
```pyi
class MyClass:
    x: int
```
## What it does
Removes ellipses (`...`) in otherwise non-empty class bodies.

## Why is this bad?
An ellipsis in a class body is only necessary if the class body is
otherwise empty. If the class body is non-empty, then the ellipsis
is redundant.

## Example
```pyi
class Foo:
    ...
    value: int
```

Use instead:
```pyi
class Foo:
    value: int
```
## What it does
Checks for untyped function arguments in stubs with default values that
are not "simple" /// (i.e., `int`, `float`, `complex`, `bytes`, `str`,
`bool`, `None`, `...`, or simple container literals).

## Why is this bad?
Stub (`.pyi`) files exist to define type hints, and are not evaluated at
runtime. As such, function arguments in stub files should not have default
values, as they are ignored by type checkers.

However, the use of default values may be useful for IDEs and other
consumers of stub files, and so "simple" values may be worth including and
are permitted by this rule.

Instead of including and reproducing a complex value, use `...` to indicate
that the assignment has a default value, but that the value is non-simple
or varies according to the current platform or Python version.

## Example

```pyi
def foo(arg=bar()) -> None: ...
```

Use instead:

```pyi
def foo(arg=...) -> None: ...
```

## References
- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)
## What it does
Checks for assignments in stubs with default values that are not "simple"
(i.e., `int`, `float`, `complex`, `bytes`, `str`, `bool`, `None`, `...`, or
simple container literals).

## Why is this bad?
Stub (`.pyi`) files exist to define type hints, and are not evaluated at
runtime. As such, assignments in stub files should not include values,
as they are ignored by type checkers.

However, the use of such values may be useful for IDEs and other consumers
of stub files, and so "simple" values may be worth including and are
permitted by this rule.

Instead of including and reproducing a complex value, use `...` to indicate
that the assignment has a default value, but that the value is non-simple
or varies according to the current platform or Python version.

## Example
```pyi
foo: str = bar()
```

Use instead:
```pyi
foo: str = ...
```

## References
- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)
## What it does
Checks for duplicate union members.

## Why is this bad?
Duplicate union members are redundant and should be removed.

## Example
```python
foo: str | str
```

Use instead:
```python
```