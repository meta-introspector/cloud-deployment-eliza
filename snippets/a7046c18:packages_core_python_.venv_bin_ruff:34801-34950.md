# a7046c18:packages_core_python_.venv_bin_ruff:34801-34950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34801-34950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

Use instead:
```python
if foo:
    ...

if not bar:
    ...
```

## Fix safety

This rule's fix is marked as unsafe, as it may alter runtime behavior when
used with libraries that override the `==`/`__eq__` or `!=`/`__ne__` operators.
In these cases, `is`/`is not` may not be equivalent to `==`/`!=`. For more
information, see [this issue].

[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations
[this issue]: https://github.com/astral-sh/ruff/issues/4560
## What it does
Checks for membership tests using `not {element} in {collection}`.

## Why is this bad?
Testing membership with `{element} not in {collection}` is more readable.

## Example
```python
Z = not X in Y
if not X.B in Y:
    pass
```

Use instead:
```python
Z = X not in Y
if X.B not in Y:
    pass
```
## What it does
Checks for identity comparisons using `not {foo} is {bar}`.

## Why is this bad?
According to [PEP8], testing for an object's identity with `is not` is more
readable.

## Example
```python
if not X is Y:
    pass
Z = not X.B is Y
```

Use instead:
```python
if X is not Y:
    pass
Z = X.B is not Y
```

[PEP8]: https://peps.python.org/pep-0008/#programming-recommendations
## What it does
Checks for object type comparisons using `==` and other comparison
operators.

## Why is this bad?
Unlike a direct type comparison, `isinstance` will also check if an object
is an instance of a class or a subclass thereof.

If you want to check for an exact type match, use `is` or `is not`.

## Known problems
When using libraries that override the `==` (`__eq__`) operator (such as NumPy,
Pandas, and SQLAlchemy), this rule may produce false positives, as converting
from `==` to `is` or `is not` will change the behavior of the code.

For example, the following operations are _not_ equivalent:
```python
import numpy as np

np.array([True, False]) == False
# array([False,  True])

np.array([True, False]) is False
# False
```

## Example
```python
if type(obj) == type(1):
    pass

if type(obj) == int:
    pass
```

Use instead:
```python
if isinstance(obj, int):
    pass
```
## What it does
Checks for bare `except` catches in `try`-`except` statements.

## Why is this bad?
A bare `except` catches `BaseException` which includes
`KeyboardInterrupt`, `SystemExit`, `Exception`, and others. Catching
`BaseException` can make it hard to interrupt the program (e.g., with
Ctrl-C) and can disguise other problems.

## Example
```python
try:
    raise KeyboardInterrupt("You probably don't mean to break CTRL-C.")
except:
    print("But a bare `except` will ignore keyboard interrupts.")
```

Use instead:
```python
try:
    do_something_that_might_break()
except MoreSpecificException as e:
    handle_error(e)
```

If you actually need to catch an unknown error, use `Exception` which will
catch regular program errors but not important system exceptions.

```python
def run_a_function(some_other_fn):
    try:
        some_other_fn()
    except Exception as e:
        print(f"How exceptional! {e}")
```

## References
- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)
- [Google Python Style Guide: "Exceptions"](https://google.github.io/styleguide/pyguide.html#24-exceptions)
## What it does
Checks for lambda expressions which are assigned to a variable.

## Why is this bad?
Per PEP 8, you should "Always use a def statement instead of an assignment
statement that binds a lambda expression directly to an identifier."

Using a `def` statement leads to better tracebacks, and the assignment
itself negates the primary benefit of using a `lambda` expression (i.e.,
that it can be embedded inside another expression).
```