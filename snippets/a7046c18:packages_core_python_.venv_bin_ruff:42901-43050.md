# a7046c18:packages_core_python_.venv_bin_ruff:42901-43050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:42901-43050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
minimum = min(1, 2, min(3, 4, 5))
maximum = max(1, 2, max(3, 4, 5))
diff = maximum - minimum
```

Use instead:

```python
minimum = min(1, 2, 3, 4, 5)
maximum = max(1, 2, 3, 4, 5)
diff = maximum - minimum
```

## Known issues

The resulting code may be slower and use more memory, especially for nested iterables. For
example, this code:

```python
iterable = range(3)
min(1, min(iterable))
```

will be fixed to:

```python
iterable = range(3)
min(1, *iterable)
```

At least on current versions of CPython, this allocates a collection for the whole iterable
before calling `min` and could cause performance regressions, at least for large iterables.

## Fix safety

This fix is always unsafe and may change the program's behavior for types without full
equivalence relations, such as float comparisons involving `NaN`.

```python
print(min(2.0, min(float("nan"), 1.0)))  # before fix: 2.0
print(min(2.0, float("nan"), 1.0))  # after fix: 1.0

print(max(1.0, max(float("nan"), 2.0)))  # before fix: 1.0
print(max(1.0, float("nan"), 2.0))  # after fix: 2.0
```

The fix will also remove any comments within the outer call.

## References
- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)
- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)
## What it does
Checks for the use of `__metaclass__ = type` in class definitions.

## Why is this bad?
Since Python 3, `__metaclass__ = type` is implied and can thus be omitted.

## Example

```python
class Foo:
    __metaclass__ = type
```

Use instead:

```python
class Foo: ...
```

## References
- [PEP 3115 – Metaclasses in Python 3000](https://peps.python.org/pep-3115/)
## What it does
Checks for uses of `type` that take a primitive as an argument.

## Why is this bad?
`type()` returns the type of a given object. A type of a primitive can
always be known in advance and accessed directly, which is more concise
and explicit than using `type()`.

## Example
```python
type(1)
```

Use instead:
```python
int
```

## References
- [Python documentation: `type()`](https://docs.python.org/3/library/functions.html#type)
- [Python documentation: Built-in types](https://docs.python.org/3/library/stdtypes.html)
## What it does
Checks for classes that inherit from `object`.

## Why is this bad?
Since Python 3, all classes inherit from `object` by default, so `object` can
be omitted from the list of base classes.

## Example

```python
class Foo(object): ...
```

Use instead:

```python
class Foo: ...
```

## Fix safety
This fix is unsafe if it would cause comments to be deleted.

## References
- [PEP 3115 – Metaclasses in Python 3000](https://peps.python.org/pep-3115/)
## What it does
Checks for uses of deprecated methods from the `unittest` module.

## Why is this bad?
The `unittest` module has deprecated aliases for some of its methods.
The deprecated aliases were removed in Python 3.12. Instead of aliases,
use their non-deprecated counterparts.

## Example
```python
from unittest import TestCase


class SomeTest(TestCase):
    def test_something(self):
        self.assertEquals(1, 1)
```

Use instead:
```python
from unittest import TestCase


class SomeTest(TestCase):
    def test_something(self):
        self.assertEqual(1, 1)
```

## References
- [Python 3.11 documentation: Deprecated aliases](https://docs.python.org/3.11/library/unittest.html#deprecated-aliases)
## What it does
Checks for the use of generics that can be replaced with standard library
```