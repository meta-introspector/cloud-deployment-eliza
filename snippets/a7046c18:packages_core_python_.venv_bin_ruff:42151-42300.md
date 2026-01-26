# a7046c18:packages_core_python_.venv_bin_ruff:42151-42300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42151-42300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
print(a)  # 3
```

## Options

The rule ignores assignments to dummy variables, as specified by:

- `lint.dummy-variable-rgx`
## What it does
Checks for `assert` statements that use a string literal as the first
argument.

## Why is this bad?
An `assert` on a non-empty string literal will always pass, while an
`assert` on an empty string literal will always fail.

## Example
```python
assert "always true"
```
## What it does
Checks for uses of named expressions (e.g., `a := 42`) that can be
replaced by regular assignment statements (e.g., `a = 42`).

## Why is this bad?
While a top-level named expression is syntactically and semantically valid,
it's less clear than a regular assignment statement. Named expressions are
intended to be used in comprehensions and generator expressions, where
assignment statements are not allowed.

## Example
```python
(a := 42)
```

Use instead:
```python
a = 42
```
## What it does
Checks for an exception that is not raised.

## Why is this bad?
It's unnecessary to create an exception without raising it. For example,
`ValueError("...")` on its own will have no effect (unlike
`raise ValueError("...")`) and is likely a mistake.

## Known problems
This rule only detects built-in exceptions, like `ValueError`, and does
not catch user-defined exceptions.

In [preview], this rule will also detect user-defined exceptions, but only
the ones defined in the file being checked.

## Example
```python
ValueError("...")
```

Use instead:
```python
raise ValueError("...")
```

## Fix safety
This rule's fix is marked as unsafe, as converting a useless exception
statement to a `raise` statement will change the program's behavior.

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for comparisons against NaN values.

## Why is this bad?
Comparing against a NaN value can lead to unexpected results. For example,
`float("NaN") == float("NaN")` will return `False` and, in general,
`x == float("NaN")` will always return `False`, even if `x` is `NaN`.

To determine whether a value is `NaN`, use `math.isnan` or `np.isnan`
instead of comparing against `NaN` directly.

## Example
```python
if x == float("NaN"):
    pass
```

Use instead:
```python
import math

if math.isnan(x):
    pass
```
## What it does
Checks for static methods that use `self` or `cls` as their first argument.
This rule also applies to `__new__` methods, which are implicitly static.

## Why is this bad?
[PEP 8] recommends the use of `self` and `cls` as the first arguments for
instance methods and class methods, respectively. Naming the first argument
of a static method as `self` or `cls` can be misleading, as static methods
do not receive an instance or class reference as their first argument.

## Example
```python
class Wolf:
    @staticmethod
    def eat(self):
        pass
```

Use instead:
```python
class Wolf:
    @staticmethod
    def eat(sheep):
        pass
```

## Options

- `lint.pep8-naming.classmethod-decorators`
- `lint.pep8-naming.staticmethod-decorators`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments
## What it does
Checks for a re-defined slot in a subclass.

## Why is this bad?
If a class defines a slot also defined in a base class, the
instance variable defined by the base class slot is inaccessible
(except by retrieving its descriptor directly from the base class).

## Example
```python
class Base:
    __slots__ = ("a", "b")


class Subclass(Base):
    __slots__ = ("a", "d")  # slot "a" redefined
```

Use instead:
```python
class Base:
    __slots__ = ("a", "b")


class Subclass(Base):
```