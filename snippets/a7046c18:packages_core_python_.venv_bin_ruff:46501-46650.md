# a7046c18:packages_core_python_.venv_bin_ruff:46501-46650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46501-46650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for chained operators where adding parentheses could improve the
clarity of the code.

## Why is this bad?
`and` always binds more tightly than `or` when chaining the two together,
but this can be hard to remember (and sometimes surprising).
Adding parentheses in these situations can greatly improve code readability,
with no change to semantics or performance.

For example:
```python
a, b, c = 1, 0, 2
x = a or b and c

d, e, f = 0, 1, 2
y = d and e or f
```

Use instead:
```python
a, b, c = 1, 0, 2
x = a or (b and c)

d, e, f = 0, 1, 2
y = (d and e) or f
```
## What it does
Checks for `__all__` definitions that are not ordered
according to an "isort-style" sort.

An isort-style sort orders items first according to their casing:
SCREAMING_SNAKE_CASE names (conventionally used for global constants)
come first, followed by CamelCase names (conventionally used for
classes), followed by anything else. Within each category,
a [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order)
is used to order the elements.

## Why is this bad?
Consistency is good. Use a common convention for `__all__` to make your
code more readable and idiomatic.

## Example
```python
import sys

__all__ = [
    "b",
    "c",
    "a",
]

if sys.platform == "win32":
    __all__ += ["z", "y"]
```

Use instead:
```python
import sys

__all__ = [
    "a",
    "b",
    "c",
]

if sys.platform == "win32":
    __all__ += ["y", "z"]
```

## Fix safety
This rule's fix is marked as unsafe if there are any comments that take up
a whole line by themselves inside the `__all__` definition, for example:
```py
__all__ = [
    # eggy things
    "duck_eggs",
    "chicken_eggs",
    # hammy things
    "country_ham",
    "parma_ham",
]
```

This is a common pattern used to delimit categories within a module's API,
but it would be out of the scope of this rule to attempt to maintain these
categories when alphabetically sorting the items of `__all__`.

The fix is also marked as unsafe if there are more than two `__all__` items
on a single line and that line also has a trailing comment, since here it
is impossible to accurately gauge which item the comment should be moved
with when sorting `__all__`:
```py
__all__ = [
    "a", "c", "e",  # a comment
    "b", "d", "f",  # a second  comment
]
```

Other than this, the rule's fix is marked as always being safe, in that
it should very rarely alter the semantics of any Python code.
However, note that (although it's rare) the value of `__all__`
could be read by code elsewhere that depends on the exact
iteration order of the items in `__all__`, in which case this
rule's fix could theoretically cause breakage.
## What it does
Checks for `__slots__` definitions that are not ordered according to a
[natural sort](https://en.wikipedia.org/wiki/Natural_sort_order).

## Why is this bad?
Consistency is good. Use a common convention for this special variable
to make your code more readable and idiomatic.

## Example
```python
class Dog:
    __slots__ = "name", "breed"
```

Use instead:
```python
class Dog:
    __slots__ = "breed", "name"
```

## Fix safety
This rule's fix is marked as unsafe in three situations.

Firstly, the fix is unsafe if there are any comments that take up
a whole line by themselves inside the `__slots__` definition, for example:
```py
class Foo:
    __slots__ = [
        # eggy things
        "duck_eggs",
        "chicken_eggs",
        # hammy things
        "country_ham",
        "parma_ham",
    ]
```

This is a common pattern used to delimit categories within a class's slots,
but it would be out of the scope of this rule to attempt to maintain these
categories when applying a natural sort to the items of `__slots__`.

Secondly, the fix is also marked as unsafe if there are more than two
`__slots__` items on a single line and that line also has a trailing
comment, since here it is impossible to accurately gauge which item the
comment should be moved with when sorting `__slots__`:
```py
```