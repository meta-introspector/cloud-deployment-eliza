# a7046c18:packages_core_python_.venv_bin_ruff:41401-41550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:41401-41550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:
```python
def is_even(number: int) -> bool:
    return number % 2 == 0
```

## Options
- `lint.pylint.max-statements`
## What it does
Checks for too many Boolean expressions in an `if` statement.

By default, this rule allows up to 5 expressions. This can be configured
using the [`lint.pylint.max-bool-expr`] option.

## Why is this bad?
`if` statements with many Boolean expressions are harder to understand
and maintain. Consider assigning the result of the Boolean expression,
or any of its sub-expressions, to a variable.

## Example
```python
if a and b and c and d and e and f and g and h:
    ...
```

## Options
- `lint.pylint.max-bool-expr`
## What it does
Checks for function definitions that include too many positional arguments.

By default, this rule allows up to five arguments, as configured by the
[`lint.pylint.max-positional-args`] option.

## Why is this bad?
Functions with many arguments are harder to understand, maintain, and call.
This is especially true for functions with many positional arguments, as
providing arguments positionally is more error-prone and less clear to
readers than providing arguments by name.

Consider refactoring functions with many arguments into smaller functions
with fewer arguments, using objects to group related arguments, or migrating to
[keyword-only arguments](https://docs.python.org/3/tutorial/controlflow.html#special-parameters).

This rule exempts methods decorated with [`@typing.override`][override].
Changing the signature of a subclass method may cause type checkers to
complain about a violation of the Liskov Substitution Principle if it
means that the method now incompatibly overrides a method defined on a
superclass. Explicitly decorating an overriding method with `@override`
signals to Ruff that the method is intended to override a superclass
method and that a type checker will enforce that it does so; Ruff
therefore knows that it should not enforce rules about methods having
too many arguments.

## Example

```python
def plot(x, y, z, color, mark, add_trendline): ...


plot(1, 2, 3, "r", "*", True)
```

Use instead:

```python
def plot(x, y, z, *, color, mark, add_trendline): ...


plot(1, 2, 3, color="r", mark="*", add_trendline=True)
```

## Options
- `lint.pylint.max-positional-args`

[override]: https://docs.python.org/3/library/typing.html#typing.override
## Removed
This rule is identical to [SIM101] which should be used instead.

## What it does
Checks for repeated `isinstance` calls on the same object.

## Why is this bad?
Repeated `isinstance` calls on the same object can be merged into a
single call.

## Fix safety
This rule's fix is marked as unsafe on Python 3.10 and later, as combining
multiple `isinstance` calls with a binary operator (`|`) will fail at
runtime if any of the operands are themselves tuples.

For example, given `TYPES = (dict, list)`, then
`isinstance(None, TYPES | set | float)` will raise a `TypeError` at runtime,
while `isinstance(None, set | float)` will not.

## Example
```python
def is_number(x):
    return isinstance(x, int) or isinstance(x, float) or isinstance(x, complex)
```

Use instead:
```python
def is_number(x):
    return isinstance(x, (int, float, complex))
```

Or, for Python 3.10 and later:

```python
def is_number(x):
    return isinstance(x, int | float | complex)
```

## Options
- `target-version`

## References
- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)

[SIM101]: https://docs.astral.sh/ruff/rules/duplicate-isinstance-call/
## What it does
Checks for functions or methods with too many nested blocks.

By default, this rule allows up to five nested blocks.
This can be configured using the [`lint.pylint.max-nested-blocks`] option.

## Why is this bad?
Functions or methods with too many nested blocks are harder to understand
and maintain.

## Options
- `lint.pylint.max-nested-blocks`
## What it does
Checks for variables defined in `for`, `try`, `with` statements
that redefine function parameters.

## Why is this bad?
Redefined variables can cause unexpected behavior because of overridden function parameters.
If nested functions are declared, an inner function's body can override an outer function's parameters.

## Example
```python
def show(host_id=10.11):
    for host_id, host in [[12.13, "Venus"], [14.15, "Mars"]]:
        print(host_id, host)
```

Use instead:
```