# a7046c18:packages_core_python_.venv_bin_ruff:22801-22950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22801-22950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Example
```python
dict([(1, 2), (3, 4)])
dict(((1, 2), (3, 4)))
dict([])
```

Use instead:
```python
{1: 2, 3: 4}
{1: 2, 3: 4}
{}
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary `dict()`, `list()` or `tuple()` calls that can be
rewritten as empty literals.

## Why is this bad?
It's unnecessary to call, e.g., `dict()` as opposed to using an empty
literal (`{}`). The former is slower because the name `dict` must be
looked up in the global scope in case it has been rebound.

## Example
```python
dict()
dict(a=1, b=2)
list()
tuple()
```

Use instead:
```python
{}
{"a": 1, "b": 2}
[]
()
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.

## Options
- `lint.flake8-comprehensions.allow-dict-calls-with-keyword-arguments`
## What it does
Checks for `tuple` calls that take unnecessary list or tuple literals as
arguments. In [preview], this also includes unnecessary list comprehensions
within tuple calls.

## Why is this bad?
It's unnecessary to use a list or tuple literal within a `tuple()` call,
since there is a literal syntax for these types.

If a list literal was passed, then it should be rewritten as a `tuple`
literal. Otherwise, if a tuple literal was passed, then the outer call
to `tuple()` should be removed.

In [preview], this rule also checks for list comprehensions within `tuple()`
calls. If a list comprehension is found, it should be rewritten as a
generator expression.

## Example
```python
tuple([1, 2])
tuple((1, 2))
tuple([x for x in range(10)])
```

Use instead:
```python
(1, 2)
(1, 2)
tuple(x for x in range(10))
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for `list()` calls that take unnecessary list or tuple literals as
arguments.

## Why is this bad?
It's unnecessary to use a list or tuple literal within a `list()` call,
since there is a literal syntax for these types.

If a list literal is passed in, then the outer call to `list()` should be
removed. Otherwise, if a tuple literal is passed in, then it should be
rewritten as a list literal.

## Example
```python
list([1, 2])
list((1, 2))
```

Use instead:
```python
[1, 2]
[1, 2]
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary `list()` calls around list comprehensions.

## Why is this bad?
It is redundant to use a `list()` call around a list comprehension.

## Example
```python
list([f(x) for x in foo])
```

Use instead
```python
[f(x) for x in foo]
```

## Fix safety
This rule's fix is marked as unsafe, as it may occasionally drop comments
when rewriting the call. In most cases, though, comments will be preserved.
## What it does
Checks for unnecessary `list()` or `reversed()` calls around `sorted()`
calls.

## Why is this bad?
It is unnecessary to use `list()` around `sorted()`, as the latter already
returns a list.

It is also unnecessary to use `reversed()` around `sorted()`, as the latter
has a `reverse` argument that can be used in lieu of an additional
`reversed()` call.

In both cases, it's clearer and more efficient to avoid the redundant call.

## Example
```python
reversed(sorted(iterable))
```

Use instead:
```