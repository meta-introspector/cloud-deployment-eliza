# a7046c18:packages_core_python_.venv_bin_ruff:38701-38850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:38701-38850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
foo = {
    bar: 1,
    baz: 2,
}
foo[baz]  # 2
```

## Fix safety

This rule's fix is marked as unsafe because removing a repeated dictionary key
may delete comments that are attached to the removed key-value pair. This can also change
the program's behavior if the value expressions have side effects.

## References
- [Python documentation: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
## What it does
Checks for the use of too many expressions in starred assignment statements.

## Why is this bad?
In assignment statements, starred expressions can be used to unpack iterables.

In Python 3, no more than `1 << 8` assignments are allowed before a starred
expression, and no more than `1 << 24` expressions are allowed after a starred
expression.

## References
- [PEP 3132 – Extended Iterable Unpacking](https://peps.python.org/pep-3132/)
## What it does
Checks for the use of multiple starred expressions in assignment statements.

## Why is this bad?
In assignment statements, starred expressions can be used to unpack iterables.
Including more than one starred expression on the left-hand-side of an
assignment will cause a `SyntaxError`, as it is unclear which expression
should receive the remaining values.

## Example
```python
*foo, *bar, baz = (1, 2, 3)
```

## References
- [PEP 3132 – Extended Iterable Unpacking](https://peps.python.org/pep-3132/)
## What it does
Checks for `assert` statements that use non-empty tuples as test
conditions.

## Why is this bad?
Non-empty tuples are always `True`, so an `assert` statement with a
non-empty tuple as its test condition will always pass. This is likely a
mistake.

## Example
```python
assert (some_condition,)
```

Use instead:
```python
assert some_condition
```

## References
- [Python documentation: The `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
## What it does
Checks for `is` and `is not` comparisons against literals, like integers,
strings, or lists.

## Why is this bad?
The `is` and `is not` comparators operate on identity, in that they check
whether two objects are the same object. If the objects are not the same
object, the comparison will always be `False`. Using `is` and `is not` with
constant literals often works "by accident", but are not guaranteed to produce
the expected result.

As of Python 3.8, using `is` and `is not` with constant literals will produce
a `SyntaxWarning`.

This rule will also flag `is` and `is not` comparisons against non-constant
literals, like lists, sets, and dictionaries. While such comparisons will
not raise a `SyntaxWarning`, they are still likely to be incorrect, as they
will compare the identities of the objects instead of their values, which
will always evaluate to `False`.

Instead, use `==` and `!=` to compare literals, which will compare the
values of the objects instead of their identities.

## Example
```python
x = 200
if x is 200:
    print("It's 200!")
```

Use instead:
```python
x = 200
if x == 200:
    print("It's 200!")
```

## References
- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)
- [Python documentation: Value comparisons](https://docs.python.org/3/reference/expressions.html#value-comparisons)
- [_Why does Python log a SyntaxWarning for ‘is’ with literals?_ by Adam Johnson](https://adamj.eu/tech/2020/01/21/why-does-python-3-8-syntaxwarning-for-is-literal/)
## What it does
Checks for `print` statements that use the `>>` syntax.

## Why is this bad?
In Python 2, the `print` statement can be used with the `>>` syntax to
print to a file-like object. This `print >> sys.stderr` syntax no
longer exists in Python 3, where `print` is only a function, not a
statement.

Instead, use the `file` keyword argument to the `print` function, the
`sys.stderr.write` function, or the `logging` module.

## Example
```python
from __future__ import print_function
import sys

print >> sys.stderr, "Hello, world!"
```

Use instead:
```python
print("Hello, world!", file=sys.stderr)
```

Or:
```python
import sys

sys.stderr.write("Hello, world!\n")
```

Or:
```python
import logging

logging.error("Hello, world!")
```

## References
- [Python documentation: `print`](https://docs.python.org/3/library/functions.html#print)
## What it does
Checks for `if` statements that use non-empty tuples as test conditions.

```