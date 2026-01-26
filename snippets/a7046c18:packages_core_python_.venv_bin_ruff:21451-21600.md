# a7046c18:packages_core_python_.venv_bin_ruff:21451-21600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:21451-21600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
raise "foo"
```

Use instead:
```python
raise Exception("foo")
```

## References
- [Python documentation: `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)
## What it does
Checks for `assertRaises` and `pytest.raises` context managers that catch
`Exception` or `BaseException`.

## Why is this bad?
These forms catch every `Exception`, which can lead to tests passing even
if, e.g., the code under consideration raises a `SyntaxError` or
`IndentationError`.

Either assert for a more specific exception (builtin or custom), or use
`assertRaisesRegex` or `pytest.raises(..., match=<REGEX>)` respectively.

## Example
```python
self.assertRaises(Exception, foo)
```

Use instead:
```python
self.assertRaises(SomeSpecificException, foo)
```
## What it does
Checks for useless expressions.

## Why is this bad?
Useless expressions have no effect on the program, and are often included
by mistake. Assign a useless expression to a variable, or remove it
entirely.

## Example
```python
1 + 1
```

Use instead:
```python
foo = 1 + 1
```

## Notebook behavior
For Jupyter Notebooks, this rule is not applied to the last top-level expression in a cell.
This is because it's common to have a notebook cell that ends with an expression,
which will result in the `repr` of the evaluated expression being printed as the cell's output.

## Known problems
This rule ignores expression types that are commonly used for their side
effects, such as function calls.

However, if a seemingly useless expression (like an attribute access) is
needed to trigger a side effect, consider assigning it to an anonymous
variable, to indicate that the return value is intentionally ignored.

For example, given:
```python
with errors.ExceptionRaisedContext():
    obj.attribute
```

Use instead:
```python
with errors.ExceptionRaisedContext():
    _ = obj.attribute
```
## What it does
Checks for uses of the `functools.lru_cache` and `functools.cache`
decorators on methods.

## Why is this bad?
Using the `functools.lru_cache` and `functools.cache` decorators on methods
can lead to memory leaks, as the global cache will retain a reference to
the instance, preventing it from being garbage collected.

Instead, refactor the method to depend only on its arguments and not on the
instance of the class, or use the `@lru_cache` decorator on a function
outside of the class.

This rule ignores instance methods on enumeration classes, as enum members
are singletons.

## Example
```python
from functools import lru_cache


def square(x: int) -> int:
    return x * x


class Number:
    value: int

    @lru_cache
    def squared(self):
        return square(self.value)
```

Use instead:
```python
from functools import lru_cache


@lru_cache
def square(x: int) -> int:
    return x * x


class Number:
    value: int

    def squared(self):
        return square(self.value)
```

## Options

This rule only applies to regular methods, not static or class methods. You can customize how
Ruff categorizes methods with the following options:

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`

## References
- [Python documentation: `functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache)
- [Python documentation: `functools.cache`](https://docs.python.org/3/library/functools.html#functools.cache)
- [don't lru_cache methods!](https://www.youtube.com/watch?v=sVjtp6tGo0g)
## What it does
Checks for loop control variables that override the loop iterable.

## Why is this bad?
Loop control variables should not override the loop iterable, as this can
lead to confusing behavior.

Instead, use a distinct variable name for any loop control variables.

## Example
```python
items = [1, 2, 3]
```