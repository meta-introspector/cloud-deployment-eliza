# a7046c18:packages_core_python_.venv_bin_ruff:29551-29700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29551-29700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:
```python
bool(a)
```

## Fix safety

This fix is marked as unsafe because it may change the program’s behavior if the condition does not
return a proper Boolean. While the fix will try to wrap non-boolean values in a call to bool,
custom implementations of comparison functions like `__eq__` can avoid the bool call and still
lead to altered behavior. Moreover, the fix may remove comments.

## References
- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)
## What it does
Checks for `if` expressions that can be replaced by negating a given
condition.

## Why is this bad?
`if` expressions that evaluate to `False` for a truthy condition and `True`
for a falsey condition can be replaced with `not` operators, which are more
concise and readable.

## Example
```python
False if a else True
```

Use instead:
```python
not a
```

## References
- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)
## What it does
Checks for `if` expressions that check against a negated condition.

## Why is this bad?
`if` expressions that check against a negated condition are more difficult
to read than `if` expressions that check against the condition directly.

## Example
```python
b if not a else a
```

Use instead:
```python
a if a else b
```

## References
- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)
## What it does
Checks for `and` expressions that include both an expression and its
negation.

## Why is this bad?
An `and` expression that includes both an expression and its negation will
always evaluate to `False`.

## Example
```python
x and not x
```

## References
- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)
## What it does
Checks for `or` expressions that include both an expression and its
negation.

## Why is this bad?
An `or` expression that includes both an expression and its negation will
always evaluate to `True`.

## Example
```python
x or not x
```

## References
- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)
## What it does
Checks for `or` expressions that contain truthy values.

## Why is this bad?
If the expression is used as a condition, it can be replaced in-full with
`True`.

In other cases, the expression can be short-circuited to the first truthy
value.

By using `True` (or the first truthy value), the code is more concise
and easier to understand, since it no longer contains redundant conditions.

## Example
```python
if x or [1] or y:
    pass

a = x or [1] or y
```

Use instead:
```python
if True:
    pass

a = x or [1]
```
## What it does
Checks for `and` expressions that contain falsey values.

## Why is this bad?
If the expression is used as a condition, it can be replaced in-full with
`False`.

In other cases, the expression can be short-circuited to the first falsey
value.

By using `False` (or the first falsey value), the code is more concise
and easier to understand, since it no longer contains redundant conditions.

## Example
```python
if x and [] and y:
    pass

a = x and [] and y
```

Use instead:
```python
if False:
    pass

a = x and []
```
## What it does
Checks for conditions that position a constant on the left-hand side of the
comparison operator, rather than the right-hand side.

## Why is this bad?
These conditions (sometimes referred to as "Yoda conditions") are less
readable than conditions that place the variable on the left-hand side of
the comparison operator.
```