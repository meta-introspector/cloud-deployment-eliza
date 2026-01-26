# a7046c18:packages_core_python_.venv_bin_ruff:28951-29100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28951-29100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
This rule ignores accesses on dunder methods (e.g., `__init__`) and sunder
methods (e.g., `_missing_`).

## Example
```python
class Class:
    def __init__(self):
        self._private_member = "..."


var = Class()
print(var._private_member)
```

Use instead:
```python
class Class:
    def __init__(self):
        self.public_member = "..."


var = Class()
print(var.public_member)
```

## Options
- `lint.flake8-self.ignore-names`

## References
- [_What is the meaning of single or double underscores before an object name?_](https://stackoverflow.com/questions/1301346/what-is-the-meaning-of-single-and-double-underscore-before-an-object-name)
## What it does
Checks for multiple `isinstance` calls on the same target.

## Why is this bad?
To check if an object is an instance of any one of multiple types
or classes, it is unnecessary to use multiple `isinstance` calls, as
the second argument of the `isinstance` built-in function accepts a
tuple of types and classes.

Using a single `isinstance` call implements the same behavior with more
concise code and clearer intent.

## Example
```python
if isinstance(obj, int) or isinstance(obj, float):
    pass
```

Use instead:
```python
if isinstance(obj, (int, float)):
    pass
```

## References
- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)
## What it does
Checks for nested `if` statements that can be collapsed into a single `if`
statement.

## Why is this bad?
Nesting `if` statements leads to deeper indentation and makes code harder to
read. Instead, combine the conditions into a single `if` statement with an
`and` operator.

## Example
```python
if foo:
    if bar:
        ...
```

Use instead:
```python
if foo and bar:
    ...
```

## Options

The rule will consult these two settings when deciding if a fix can be provided:

- `lint.pycodestyle.max-line-length`
- `indent-width`

Lines that would exceed the configured line length will not be fixed automatically.

## References
- [Python documentation: The `if` statement](https://docs.python.org/3/reference/compound_stmts.html#the-if-statement)
- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)
## What it does
Checks for `if` statements that can be replaced with `bool`.

## Why is this bad?
`if` statements that return `True` for a truthy condition and `False` for
a falsy condition can be replaced with boolean casts.

## Example
Given:
```python
def foo(x: int) -> bool:
    if x > 0:
        return True
    else:
        return False
```

Use instead:
```python
def foo(x: int) -> bool:
    return x > 0
```

Or, given:
```python
def foo(x: int) -> bool:
    if x > 0:
        return True
    return False
```

Use instead:
```python
def foo(x: int) -> bool:
    return x > 0
```

## Fix safety

This fix is marked as unsafe because it may change the program’s behavior if the condition does not
return a proper Boolean. While the fix will try to wrap non-boolean values in a call to bool,
custom implementations of comparison functions like `__eq__` can avoid the bool call and still
lead to altered behavior.

## References
- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)
## What it does
Checks for `try`-`except`-`pass` blocks that can be replaced with the
`contextlib.suppress` context manager.

## Why is this bad?
Using `contextlib.suppress` is more concise and directly communicates the
intent of the code: to suppress a given exception.

Note that `contextlib.suppress` is slower than using `try`-`except`-`pass`
directly. For performance-critical code, consider retaining the
`try`-`except`-`pass` pattern.

## Example
```python
```