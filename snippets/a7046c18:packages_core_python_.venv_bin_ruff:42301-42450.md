# a7046c18:packages_core_python_.venv_bin_ruff:42301-42450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42301-42450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    __slots__ = "d"
```
## What it does
Detects attempts to use `super` without parentheses.

## Why is this bad?
The [`super()` callable](https://docs.python.org/3/library/functions.html#super)
can be used inside method definitions to create a proxy object that
delegates attribute access to a superclass of the current class. Attempting
to access attributes on `super` itself, however, instead of the object
returned by a call to `super()`, will raise `AttributeError`.

## Example
```python
class Animal:
    @staticmethod
    def speak():
        return "This animal says something."


class Dog(Animal):
    @staticmethod
    def speak():
        original_speak = super.speak()  # ERROR: `super.speak()`
        return f"{original_speak} But as a dog, it barks!"
```

Use instead:
```python
class Animal:
    @staticmethod
    def speak():
        return "This animal says something."


class Dog(Animal):
    @staticmethod
    def speak():
        original_speak = super().speak()  # Correct: `super().speak()`
        return f"{original_speak} But as a dog, it barks!"
```

## Options

This rule applies to regular, static, and class methods. You can customize how Ruff categorizes
methods with the following options:

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`
## What it does
Checks for import statements that import the current module.

## Why is this bad?
Importing a module from itself is a circular dependency and results
in an `ImportError` exception.

## Example

```python
# file: this_file.py
from this_file import foo


def foo(): ...
```
## What it does
Checks for `global` variables that are not assigned a value in the current
scope.

## Why is this bad?
The `global` keyword allows an inner scope to modify a variable declared
in the outer scope. If the variable is not modified within the inner scope,
there is no need to use `global`.

## Example
```python
DEBUG = True


def foo():
    global DEBUG
    if DEBUG:
        print("foo() called")
    ...
```

Use instead:
```python
DEBUG = True


def foo():
    if DEBUG:
        print("foo() called")
    ...
```

## References
- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)
## What it does
Checks for the use of `global` statements to update identifiers.

## Why is this bad?
Pylint discourages the use of `global` variables as global mutable
state is a common source of bugs and confusing behavior.

## Example
```python
var = 1


def foo():
    global var  # [global-statement]
    var = 10
    print(var)


foo()
print(var)
```

Use instead:
```python
var = 1


def foo():
    var = 10
    print(var)
    return var


var = foo()
print(var)
```
## What it does
Checks for uses of the `global` keyword at the module level.

## Why is this bad?
The `global` keyword is used within functions to indicate that a name
refers to a global variable, rather than a local variable.

At the module level, all names are global by default, so the `global`
keyword is redundant.
## What it does
Checks for assignment of `self` and `cls` in instance and class methods respectively.

This check also applies to `__new__` even though this is technically
a static method.

```