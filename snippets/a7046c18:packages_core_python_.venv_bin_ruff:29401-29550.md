# a7046c18:packages_core_python_.venv_bin_ruff:29401-29550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29401-29550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    return phrases.get(x, "Goodnight")
```
## What it does
Checks for the unnecessary nesting of multiple consecutive context
managers.

## Why is this bad?
In Python 3, a single `with` block can include multiple context
managers.

Combining multiple context managers into a single `with` statement
will minimize the indentation depth of the code, making it more
readable.

The following context managers are exempt when used as standalone
statements:

 - `anyio`.{`CancelScope`, `fail_after`, `move_on_after`}
 - `asyncio`.{`timeout`, `timeout_at`}
 - `trio`.{`fail_after`, `fail_at`, `move_on_after`, `move_on_at`}

## Example
```python
with A() as a:
    with B() as b:
        pass
```

Use instead:
```python
with A() as a, B() as b:
    pass
```

## Options

The rule will consult these two settings when deciding if a fix can be provided:

- `lint.pycodestyle.max-line-length`
- `indent-width`

Lines that would exceed the configured line length will not be fixed automatically.

## References
- [Python documentation: The `with` statement](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement)
## What it does
Checks for key-existence checks against `dict.keys()` calls.

## Why is this bad?
When checking for the existence of a key in a given dictionary, using
`key in dict` is more readable and efficient than `key in dict.keys()`,
while having the same semantics.

## Example
```python
key in foo.keys()
```

Use instead:
```python
key in foo
```

## Fix safety
Given `key in obj.keys()`, `obj` _could_ be a dictionary, or it could be
another type that defines a `.keys()` method. In the latter case, removing
the `.keys()` attribute could lead to a runtime error. The fix is marked
as safe when the type of `obj` is known to be a dictionary; otherwise, it
is marked as unsafe.

## References
- [Python documentation: Mapping Types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
## What it does
Checks for negated `==` operators.

## Why is this bad?
Negated `==` operators are less readable than `!=` operators. When testing
for non-equality, it is more common to use `!=` than `==`.

## Example
```python
not a == b
```

Use instead:
```python
a != b
```

## Fix safety
The fix is marked as unsafe, as it might change the behaviour
if `a` and/or `b` overrides `__eq__`/`__ne__`
in such a manner that they don't return booleans.

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
## What it does
Checks for negated `!=` operators.

## Why is this bad?
Negated `!=` operators are less readable than `==` operators, as they avoid a
double negation.

## Example
```python
not a != b
```

Use instead:
```python
a == b
```

## Fix safety
The fix is marked as unsafe, as it might change the behaviour
if `a` and/or `b` overrides `__ne__`/`__eq__`
in such a manner that they don't return booleans.

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
## What it does
Checks for double negations (i.e., multiple `not` operators).

## Why is this bad?
A double negation is redundant and less readable than omitting the `not`
operators entirely.

## Example
```python
not (not a)
```

Use instead:
```python
a
```

## References
- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)
## What it does
Checks for `if` expressions that can be replaced with `bool()` calls.

## Why is this bad?
`if` expressions that evaluate to `True` for a truthy condition an `False`
for a falsey condition can be replaced with `bool()` calls, which are more
concise and readable.

## Example
```python
True if a else False
```