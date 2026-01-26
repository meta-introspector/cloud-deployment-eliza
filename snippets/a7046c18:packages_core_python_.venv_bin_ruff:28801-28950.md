# a7046c18:packages_core_python_.venv_bin_ruff:28801-28950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28801-28950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
def foo(bar):
    if not bar:
        return 1
```

Use instead:
```python
def foo(bar):
    if not bar:
        return 1
    return None
```
## What it does
Checks for variable assignments that immediately precede a `return` of the
assigned variable.

## Why is this bad?
The variable assignment is not necessary, as the value can be returned
directly.

## Example
```python
def foo():
    bar = 1
    return bar
```

Use instead:
```python
def foo():
    return 1
```
## What it does
Checks for `else` statements with a `return` statement in the preceding
`if` block.

## Why is this bad?
The `else` statement is not needed as the `return` statement will always
break out of the enclosing function. Removing the `else` will reduce
nesting and make the code more readable.

## Example
```python
def foo(bar, baz):
    if bar:
        return 1
    else:
        return baz
```

Use instead:
```python
def foo(bar, baz):
    if bar:
        return 1
    return baz
```
## What it does
Checks for `else` statements with a `raise` statement in the preceding `if`
block.

## Why is this bad?
The `else` statement is not needed as the `raise` statement will always
break out of the current scope. Removing the `else` will reduce nesting
and make the code more readable.

## Example
```python
def foo(bar, baz):
    if bar == "Specific Error":
        raise Exception(bar)
    else:
        raise Exception(baz)
```

Use instead:
```python
def foo(bar, baz):
    if bar == "Specific Error":
        raise Exception(bar)
    raise Exception(baz)
```
## What it does
Checks for `else` statements with a `continue` statement in the preceding
`if` block.

## Why is this bad?
The `else` statement is not needed, as the `continue` statement will always
continue onto the next iteration of a loop. Removing the `else` will reduce
nesting and make the code more readable.

## Example
```python
def foo(bar, baz):
    for i in bar:
        if i < baz:
            continue
        else:
            x = 0
```

Use instead:
```python
def foo(bar, baz):
    for i in bar:
        if i < baz:
            continue
        x = 0
```
## What it does
Checks for `else` statements with a `break` statement in the preceding `if`
block.

## Why is this bad?
The `else` statement is not needed, as the `break` statement will always
break out of the loop. Removing the `else` will reduce nesting and make the
code more readable.

## Example
```python
def foo(bar, baz):
    for i in bar:
        if i > baz:
            break
        else:
            x = 0
```

Use instead:
```python
def foo(bar, baz):
    for i in bar:
        if i > baz:
            break
        x = 0
```
## What it does
Checks for accesses on "private" class members.

## Why is this bad?
In Python, the convention is such that class members that are prefixed
with a single underscore, or prefixed but not suffixed with a double
underscore, are considered private and intended for internal use.

Using such "private" members is considered a misuse of the class, as
there are no guarantees that the member will be present in future
versions, that it will have the same type, or that it will have the same
behavior. Instead, use the class's public interface.

```