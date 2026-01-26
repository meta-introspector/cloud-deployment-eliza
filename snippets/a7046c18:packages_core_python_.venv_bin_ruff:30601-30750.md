# a7046c18:packages_core_python_.venv_bin_ruff:30601-30750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30601-30750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for the presence of unused arguments in function definitions.

## Why is this bad?
An argument that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

## Example
```python
def foo(bar, baz):
    return bar * 2
```

Use instead:
```python
def foo(bar):
    return bar * 2
```

## Options
- `lint.dummy-variable-rgx`
## What it does
Checks for the presence of unused arguments in instance method definitions.

## Why is this bad?
An argument that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

This rule exempts methods decorated with [`@typing.override`][override].
Removing a parameter from a subclass method (or changing a parameter's
name) may cause type checkers to complain about a violation of the Liskov
Substitution Principle if it means that the method now incompatibly
overrides a method defined on a superclass. Explicitly decorating an
overriding method with `@override` signals to Ruff that the method is
intended to override a superclass method and that a type checker will
enforce that it does so; Ruff therefore knows that it should not enforce
rules about unused arguments on such methods.

## Example
```python
class Class:
    def foo(self, arg1, arg2):
        print(arg1)
```

Use instead:
```python
class Class:
    def foo(self, arg1):
        print(arg1)
```

## Options
- `lint.dummy-variable-rgx`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for the presence of unused arguments in class method definitions.

## Why is this bad?
An argument that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

This rule exempts methods decorated with [`@typing.override`][override].
Removing a parameter from a subclass method (or changing a parameter's
name) may cause type checkers to complain about a violation of the Liskov
Substitution Principle if it means that the method now incompatibly
overrides a method defined on a superclass. Explicitly decorating an
overriding method with `@override` signals to Ruff that the method is
intended to override a superclass method and that a type checker will
enforce that it does so; Ruff therefore knows that it should not enforce
rules about unused arguments on such methods.

## Example
```python
class Class:
    @classmethod
    def foo(cls, arg1, arg2):
        print(arg1)
```

Use instead:
```python
class Class:
    @classmethod
    def foo(cls, arg1):
        print(arg1)
```

## Options
- `lint.dummy-variable-rgx`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for the presence of unused arguments in static method definitions.

## Why is this bad?
An argument that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

This rule exempts methods decorated with [`@typing.override`][override].
Removing a parameter from a subclass method (or changing a parameter's
name) may cause type checkers to complain about a violation of the Liskov
Substitution Principle if it means that the method now incompatibly
overrides a method defined on a superclass. Explicitly decorating an
overriding method with `@override` signals to Ruff that the method is
intended to override a superclass method, and that a type checker will
enforce that it does so; Ruff therefore knows that it should not enforce
rules about unused arguments on such methods.

## Example
```python
class Class:
    @staticmethod
    def foo(arg1, arg2):
        print(arg1)
```

Use instead:
```python
class Class:
    @staticmethod
    def foo(arg1):
        print(arg1)
```

## Options
- `lint.dummy-variable-rgx`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for the presence of unused arguments in lambda expression
definitions.

## Why is this bad?
```