# a7046c18:packages_core_python_.venv_bin_ruff:22651-22800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22651-22800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
It is unnecessary to use `list()` around a generator expression, since
there are equivalent comprehensions for these types. Using a
comprehension is clearer and more idiomatic.

Further, if the comprehension can be removed entirely, as in the case of
`list(x for x in foo)`, it's better to use `list(foo)` directly, since it's
even more direct.

## Example
```python
list(f(x) for x in foo)
list(x for x in foo)
list((x for x in foo))
```

Use instead:
```python
[f(x) for x in foo]
list(foo)
list(foo)
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary generators that can be rewritten as set
comprehensions (or with `set()` directly).

## Why is this bad?
It is unnecessary to use `set` around a generator expression, since
there are equivalent comprehensions for these types. Using a
comprehension is clearer and more idiomatic.

Further, if the comprehension can be removed entirely, as in the case of
`set(x for x in foo)`, it's better to use `set(foo)` directly, since it's
even more direct.

## Example
```python
set(f(x) for x in foo)
set(x for x in foo)
set((x for x in foo))
```

Use instead:
```python
{f(x) for x in foo}
set(foo)
set(foo)
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary generators that can be rewritten as dict
comprehensions.

## Why is this bad?
It is unnecessary to use `dict()` around a generator expression, since
there are equivalent comprehensions for these types. Using a
comprehension is clearer and more idiomatic.

## Example
```python
dict((x, f(x)) for x in foo)
```

Use instead:
```python
{x: f(x) for x in foo}
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary list comprehensions.

## Why is this bad?
It's unnecessary to use a list comprehension inside a call to `set()`,
since there is an equivalent comprehension for this type.

## Example
```python
set([f(x) for x in foo])
```

Use instead:
```python
{f(x) for x in foo}
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary list comprehensions.

## Why is this bad?
It's unnecessary to use a list comprehension inside a call to `dict()`,
since there is an equivalent comprehension for this type.

## Example
```python
dict([(x, f(x)) for x in foo])
```

Use instead:
```python
{x: f(x) for x in foo}
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for `set()` calls that take unnecessary list or tuple literals
as arguments.

## Why is this bad?
It's unnecessary to use a list or tuple literal within a call to `set()`.
Instead, the expression can be rewritten as a set literal.

## Example
```python
set([1, 2])
set((1, 2))
set([])
```

Use instead:
```python
{1, 2}
{1, 2}
set()
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary list or tuple literals.

## Why is this bad?
It's unnecessary to use a list or tuple literal within a call to `dict()`.
It can be rewritten as a dict literal (`{}`).

```