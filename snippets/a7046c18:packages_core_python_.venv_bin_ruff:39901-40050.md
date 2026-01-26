# a7046c18:packages_core_python_.venv_bin_ruff:39901-40050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39901-40050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
The `__init__` method is the constructor for a given Python class,
responsible for initializing, rather than creating, new objects.

The `__init__` method has to return `None`. Returning any value from
an `__init__` method will result in a runtime error.

## Example
```python
class Example:
    def __init__(self):
        return []
```

Use instead:
```python
class Example:
    def __init__(self):
        self.value = []
```

## References
- [CodeQL: `py-explicit-return-in-init`](https://codeql.github.com/codeql-query-help/python/py-explicit-return-in-init/)
## What it does
Checks for variables which are both declared as both `nonlocal` and
`global`.

## Why is this bad?
A `nonlocal` variable is a variable that is defined in the nearest
enclosing scope, but not in the global scope, while a `global` variable is
a variable that is defined in the global scope.

Declaring a variable as both `nonlocal` and `global` is contradictory and
will raise a `SyntaxError`.

## Example
```python
counter = 0


def increment():
    global counter
    nonlocal counter
    counter += 1
```

Use instead:
```python
counter = 0


def increment():
    global counter
    counter += 1
```

## References
- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)
- [Python documentation: The `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#nonlocal)
## What it does
Checks for `continue` statements inside `finally`

## Why is this bad?
`continue` statements were not allowed within `finally` clauses prior to
Python 3.8. Using a `continue` statement within a `finally` clause can
cause a `SyntaxError`.

## Example
```python
while True:
    try:
        pass
    finally:
        continue
```

Use instead:
```python
while True:
    try:
        pass
    except Exception:
        pass
    else:
        continue
```

## Options
- `target-version`
## What it does
Checks for `nonlocal` names without bindings.

## Why is this bad?
`nonlocal` names must be bound to a name in an outer scope.
Violating this rule leads to a `SyntaxError` at runtime.

## Example
```python
def foo():
    def get_bar(self):
        nonlocal bar
        ...
```

Use instead:
```python
def foo():
    bar = 1

    def get_bar(self):
        nonlocal bar
        ...
```

## References
- [Python documentation: The `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#nonlocal)
- [PEP 3104 – Access to Names in Outer Scopes](https://peps.python.org/pep-3104/)
## What it does
Checks for uses of names that are declared as `global` prior to the
relevant `global` declaration.

## Why is this bad?
The `global` declaration applies to the entire scope. Using a name that's
declared as `global` in a given scope prior to the relevant `global`
declaration is a `SyntaxError`.

## Example
```python
counter = 1


def increment():
    print(f"Adding 1 to {counter}")
    global counter
    counter += 1
```

Use instead:
```python
counter = 1


def increment():
    global counter
    print(f"Adding 1 to {counter}")
    counter += 1
```

## References
- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)
## What it does
```