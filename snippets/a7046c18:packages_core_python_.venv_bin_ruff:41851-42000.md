# a7046c18:packages_core_python_.venv_bin_ruff:41851-42000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41851-42000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
def apply_discount(price: float) -> float:
    if price <= MAX_DISCOUNT:
        return price / 2
    else:
        return price
```

## Options
- `lint.pylint.allow-magic-value-types`

[PEP 8]: https://peps.python.org/pep-0008/#constants
## What it does
Checks for a # symbol appearing on a line not followed by an actual comment.

## Why is this bad?
Empty comments don't provide any clarity to the code, and just add clutter.
Either add a comment or delete the empty comment.

## Example
```python
class Foo:  #
    pass
```

Use instead:
```python
class Foo:
    pass
```

## References
- [Pylint documentation](https://pylint.pycqa.org/en/latest/user_guide/messages/refactor/empty-comment.html)
## What it does
Checks for `else` blocks that consist of a single `if` statement.

## Why is this bad?
If an `else` block contains a single `if` statement, it can be collapsed
into an `elif`, thus reducing the indentation level.

## Example
```python
def check_sign(value: int) -> None:
    if value > 0:
        print("Number is positive.")
    else:
        if value < 0:
            print("Number is negative.")
        else:
            print("Number is zero.")
```

Use instead:
```python
def check_sign(value: int) -> None:
    if value > 0:
        print("Number is positive.")
    elif value < 0:
        print("Number is negative.")
    else:
        print("Number is zero.")
```

## References
- [Python documentation: `if` Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
## What it does
Checks for assignments that can be replaced with augmented assignment
statements.

## Why is this bad?
If the right-hand side of an assignment statement consists of a binary
operation in which one operand is the same as the assignment target,
it can be rewritten as an augmented assignment. For example, `x = x + 1`
can be rewritten as `x += 1`.

When performing such an operation, an augmented assignment is more concise
and idiomatic.

## Known problems
In some cases, this rule will not detect assignments in which the target
is on the right-hand side of a binary operation (e.g., `x = y + x`, as
opposed to `x = x + y`), as such operations are not commutative for
certain data types, like strings.

For example, `x = "prefix-" + x` is not equivalent to `x += "prefix-"`,
while `x = 1 + x` is equivalent to `x += 1`.

If the type of the left-hand side cannot be trivially inferred, the rule
will ignore the assignment.

## Example
```python
x = x + 1
```

Use instead:
```python
x += 1
```

## Fix safety
This rule's fix is marked as unsafe, as augmented assignments have
different semantics when the target is a mutable data type, like a list or
dictionary.

For example, consider the following:

```python
foo = [1]
bar = foo
foo = foo + [2]
assert (foo, bar) == ([1, 2], [1])
```

If the assignment is replaced with an augmented assignment, the update
operation will apply to both `foo` and `bar`, as they refer to the same
object:

```python
foo = [1]
bar = foo
foo += [2]
assert (foo, bar) == ([1, 2], [1, 2])
```
## What it does
Checks for membership tests on `list` and `tuple` literals.

## Why is this bad?
When testing for membership in a static sequence, prefer a `set` literal
over a `list` or `tuple`, as Python optimizes `set` membership tests.

## Example
```python
1 in [1, 2, 3]
```

Use instead:
```python
1 in {1, 2, 3}
```

## Fix safety
This rule's fix is marked as unsafe, as the use of a `set` literal will
error at runtime if either the element being tested for membership (the
left-hand side) or any element of the sequence (the right-hand side)
is unhashable (like lists or dictionaries). While Ruff will attempt to
infer the hashability of both sides and skip the fix when it can determine
that either side is unhashable, it may not always be able to do so.

## References
- [What’s New In Python 3.2](https://docs.python.org/3/whatsnew/3.2.html#optimizations)
```