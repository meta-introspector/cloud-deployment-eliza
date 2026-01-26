# a7046c18:packages_core_python_.venv_bin_ruff:46801-46950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46801-46950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
Suppression comments that do not actually prevent formatting could cause unintended changes
when the formatter is run.

## Example
In the following example, all suppression comments would cause
a rule violation.

```python
def decorator():
    pass


@decorator
# fmt: off
def example():
    if True:
        # fmt: skip
        expression = [
            # fmt: off
            1,
            2,
        ]
        # yapf: disable
    # fmt: on
    # yapf: enable
```

## Fix safety

This fix is always marked as unsafe because it deletes the invalid suppression comment,
rather than trying to move it to a valid position, which the user more likely intended.
## What it does
Checks for functions declared `async` that do not await or otherwise use features requiring the
function to be declared `async`.

## Why is this bad?
Declaring a function `async` when it's not is usually a mistake, and will artificially limit the
contexts where that function may be called. In some cases, labeling a function `async` is
semantically meaningful (e.g. with the trio library).

## Example
```python
async def foo():
    bar()
```

Use instead:
```python
def foo():
    bar()
```
## What it does
Checks for uses of `assert expression, print(message)`.

## Why is this bad?
If an `assert x, y` assertion fails, the Python interpreter raises an
`AssertionError`, and the evaluated value of `y` is used as the contents of
that assertion error. The `print` function always returns `None`, however,
so the evaluated value of a call to `print` will always be `None`.

Using a `print` call in this context will therefore output the message to
`stdout`, before raising an empty `AssertionError(None)`. Instead, remove
the `print` and pass the message directly as the second expression,
allowing `stderr` to capture the message in a well-formatted context.

## Example
```python
assert False, print("This is a message")
```

Use instead:
```python
assert False, "This is a message"
```

## Fix safety
This rule's fix is marked as unsafe, as changing the second expression
will result in a different `AssertionError` message being raised, as well as
a change in `stdout` output.

## References
- [Python documentation: `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)
## What it does
Checks for consistent style regarding whether nonempty tuples in subscripts
are parenthesized.

The exact nature of this violation depends on the setting
[`lint.ruff.parenthesize-tuple-in-subscript`]. By default, the use of
parentheses is considered a violation.

This rule is not applied inside "typing contexts" (type annotations,
type aliases and subscripted class bases), as these have their own specific
conventions around them.

## Why is this bad?
It is good to be consistent and, depending on the codebase, one or the other
convention may be preferred.

## Example

```python
directions = {(0, 1): "North", (1, 0): "East", (0, -1): "South", (-1, 0): "West"}
directions[(0, 1)]
```

Use instead (with default setting):

```python
directions = {(0, 1): "North", (1, 0): "East", (0, -1): "South", (-1, 0): "West"}
directions[0, 1]
```

## Options
- `lint.ruff.parenthesize-tuple-in-subscript`
## What it does
Checks for `Decimal` calls passing a float literal.

## Why is this bad?
Float literals have limited precision that can lead to unexpected results.
The `Decimal` class is designed to handle numbers with fixed-point precision,
so a string literal should be used instead.

## Example

```python
num = Decimal(1.2345)
```

Use instead:
```python
num = Decimal("1.2345")
```

## Fix safety
This rule's fix is marked as unsafe because it changes the underlying value
of the `Decimal` instance that is constructed. This can lead to unexpected
behavior if your program relies on the previous value (whether deliberately or not).
## What it does
Checks for `__post_init__` dataclass methods with parameter defaults.

## Why is this bad?
Adding a default value to a parameter in a `__post_init__` method has no
impact on whether the parameter will have a default value in the dataclass's
generated `__init__` method. To create an init-only dataclass parameter with
a default value, you should use an `InitVar` field in the dataclass's class
body and give that `InitVar` field a default value.

As the [documentation] states:

```