# a7046c18:packages_core_python_.venv_bin_ruff:22351-22500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22351-22500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
difficulty of reading and maintaining the code, and can cause
non-obvious errors, as readers may mistake the variable for the
builtin and vice versa.

Builtins can be marked as exceptions to this rule via the
[`lint.flake8-builtins.ignorelist`] configuration option.

## Example
```python
def find_max(list_of_lists):
    max = 0
    for flat_list in list_of_lists:
        for value in flat_list:
            max = max(max, value)  # TypeError: 'int' object is not callable
    return max
```

Use instead:
```python
def find_max(list_of_lists):
    result = 0
    for flat_list in list_of_lists:
        for value in flat_list:
            result = max(result, value)
    return result
```

## Options
- `lint.flake8-builtins.ignorelist`

## References
- [_Why is it a bad idea to name a variable `id` in Python?_](https://stackoverflow.com/questions/77552/id-is-a-bad-variable-name-in-python)
## What it does
Checks for function arguments that use the same names as builtins.

## Why is this bad?
Reusing a builtin name for the name of an argument increases the
difficulty of reading and maintaining the code, and can cause
non-obvious errors, as readers may mistake the argument for the
builtin and vice versa.

Function definitions decorated with [`@override`][override] or
[`@overload`][overload] are exempt from this rule by default.
Builtins can be marked as exceptions to this rule via the
[`lint.flake8-builtins.ignorelist`] configuration option.

## Example
```python
def remove_duplicates(list, list2):
    result = set()
    for value in list:
        result.add(value)
    for value in list2:
        result.add(value)
    return list(result)  # TypeError: 'list' object is not callable
```

Use instead:
```python
def remove_duplicates(list1, list2):
    result = set()
    for value in list1:
        result.add(value)
    for value in list2:
        result.add(value)
    return list(result)
```

## Options
- `lint.flake8-builtins.ignorelist`

## References
- [_Is it bad practice to use a built-in function name as an attribute or method identifier?_](https://stackoverflow.com/questions/9109333/is-it-bad-practice-to-use-a-built-in-function-name-as-an-attribute-or-method-ide)
- [_Why is it a bad idea to name a variable `id` in Python?_](https://stackoverflow.com/questions/77552/id-is-a-bad-variable-name-in-python)

[override]: https://docs.python.org/3/library/typing.html#typing.override
[overload]: https://docs.python.org/3/library/typing.html#typing.overload
## What it does
Checks for class attributes and methods that use the same names as
Python builtins.

## Why is this bad?
Reusing a builtin name for the name of an attribute increases the
difficulty of reading and maintaining the code, and can cause
non-obvious errors, as readers may mistake the attribute for the
builtin and vice versa.

Since methods and class attributes typically cannot be referenced directly
from outside the class scope, this rule only applies to those methods
and attributes that both shadow a builtin _and_ are referenced from within
the class scope, as in the following example, where the `list[int]` return
type annotation resolves to the `list` method, rather than the builtin:

```python
class Class:
    @staticmethod
    def list() -> None:
        pass

    @staticmethod
    def repeat(value: int, times: int) -> list[int]:
        return [value] * times
```

Builtins can be marked as exceptions to this rule via the
[`lint.flake8-builtins.ignorelist`] configuration option, or
converted to the appropriate dunder method. Methods decorated with
`@typing.override` or `@typing_extensions.override` are also
ignored.

## Example
```python
class Class:
    @staticmethod
    def list() -> None:
        pass

    @staticmethod
    def repeat(value: int, times: int) -> list[int]:
        return [value] * times
```

## Options
- `lint.flake8-builtins.ignorelist`
## What it does
Checks for imports that use the same names as builtins.

## Why is this bad?
Reusing a builtin for the name of an import increases the difficulty
of reading and maintaining the code, and can cause non-obvious errors,
as readers may mistake the variable for the builtin and vice versa.

Builtins can be marked as exceptions to this rule via the
[`lint.flake8-builtins.ignorelist`] configuration option.

## Example
```python
from rich import print

print("Some message")
```

Use instead:
```python
from rich import print as rich_print

rich_print("Some message")
```

or:
```