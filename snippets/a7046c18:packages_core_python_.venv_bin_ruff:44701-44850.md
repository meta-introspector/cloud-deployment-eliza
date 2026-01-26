# a7046c18:packages_core_python_.venv_bin_ruff:44701-44850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44701-44850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Fix safety
This fix is marked as unsafe if it removes an unused `sep` keyword argument
that may have side effects. Removing such arguments may change the program's
behavior by skipping the execution of those side effects.

## References
- [Python documentation: `print`](https://docs.python.org/3/library/functions.html#print)
## What it does
Checks for ternary `if` expressions that can be replaced with the `or`
operator.

## Why is this bad?
Ternary `if` expressions are more verbose than `or` expressions while
providing the same functionality.

## Example
```python
z = x if x else y
```

Use instead:
```python
z = x or y
```

## Fix safety
This rule's fix is marked as unsafe in the event that the body of the
`if` expression contains side effects.

For example, `foo` will be called twice in `foo() if foo() else bar()`
(assuming `foo()` returns a truthy value), but only once in
`foo() or bar()`.
## What it does
Checks for consecutive calls to `append`.

## Why is this bad?
Consecutive calls to `append` can be less efficient than batching them into
a single `extend`. Each `append` resizes the list individually, whereas an
`extend` can resize the list once for all elements.

## Known problems
This rule is prone to false negatives due to type inference limitations,
as it will only detect lists that are instantiated as literals or annotated
with a type annotation.

## Example
```python
nums = [1, 2, 3]

nums.append(4)
nums.append(5)
nums.append(6)
```

Use instead:
```python
nums = [1, 2, 3]

nums.extend((4, 5, 6))
```

## References
- [Python documentation: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)
## What it does
Checks for uses of `bin(...)[2:]` (or `hex`, or `oct`) to convert
an integer into a string.

## Why is this bad?
When converting an integer to a baseless binary, hexadecimal, or octal
string, using f-strings is more concise and readable than using the
`bin`, `hex`, or `oct` functions followed by a slice.

## Example
```python
print(bin(1337)[2:])
```

Use instead:
```python
print(f"{1337:b}")
```

## Fix safety
The fix is only marked as safe for integer literals, all other cases
are display-only, as they may change the runtime behaviour of the program
or introduce syntax errors.
## What it does
Checks for lambda expressions and function definitions that can be replaced with a function from
the `operator` module.

## Why is this bad?
The `operator` module provides functions that implement the same functionality as the
corresponding operators. For example, `operator.add` is often equivalent to `lambda x, y: x + y`.
Using the functions from the `operator` module is more concise and communicates the intent of
the code more clearly.

## Example
```python
import functools

nums = [1, 2, 3]
total = functools.reduce(lambda x, y: x + y, nums)
```

Use instead:
```python
import functools
import operator

nums = [1, 2, 3]
total = functools.reduce(operator.add, nums)
```

## Fix safety
The fix offered by this rule is always marked as unsafe. While the changes the fix would make
would rarely break your code, there are two ways in which functions from the `operator` module
differ from user-defined functions. It would be non-trivial for Ruff to detect whether or not
these differences would matter in a specific situation where Ruff is emitting a diagnostic for
this rule.

The first difference is that `operator` functions cannot be called with keyword arguments, but
most user-defined functions can. If an `add` function is defined as `add = lambda x, y: x + y`,
replacing this function with `operator.add` will cause the later call to raise `TypeError` if
the function is later called with keyword arguments, e.g. `add(x=1, y=2)`.

The second difference is that user-defined functions are [descriptors], but this is not true of
the functions defined in the `operator` module. Practically speaking, this means that defining
a function in a class body (either by using a `def` statement or assigning a `lambda` function
to a variable) is a valid way of defining an instance method on that class; monkeypatching a
user-defined function onto a class after the class has been created also has the same effect.
The same is not true of an `operator` function: assigning an `operator` function to a variable
in a class body or monkeypatching one onto a class will not create a valid instance method.
Ruff will refrain from emitting diagnostics for this rule on function definitions in class
bodies; however, it does not currently have sophisticated enough type inference to avoid
emitting this diagnostic if a user-defined function is being monkeypatched onto a class after
the class has been constructed.

[descriptors]: https://docs.python.org/3/howto/descriptor.html
## What it does
Checks for the use of `IOBase.write` in a for loop.

## Why is this bad?
When writing a batch of elements, it's more idiomatic to use a single method call to
`IOBase.writelines`, rather than write elements one by one.

## Example
```python
from pathlib import Path
```