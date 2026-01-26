# a7046c18:packages_core_python_.venv_bin_ruff:39751-39900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39751-39900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import bár
```

Use instead:
```python
import bar
```

If the module is third-party, use an ASCII-only alias:
```python
import bár as bar
```

[PEP 672]: https://peps.python.org/pep-0672/
## What it does
Checks for import statements that import a private name (a name starting
with an underscore `_`) from another module.

## Why is this bad?
[PEP 8] states that names starting with an underscore are private. Thus,
they are not intended to be used outside of the module in which they are
defined.

Further, as private imports are not considered part of the public API, they
are prone to unexpected changes, especially outside of semantic versioning.

Instead, consider using the public API of the module.

This rule ignores private name imports that are exclusively used in type
annotations. Ideally, types would be public; however, this is not always
possible when using third-party libraries.

## Known problems
Does not ignore private name imports from within the module that defines
the private name if the module is defined with [PEP 420] namespace packages
(i.e., directories that omit the `__init__.py` file). Namespace packages
must be configured via the [`namespace-packages`] setting.

## Example
```python
from foo import _bar
```

## Options
- `namespace-packages`

## References
- [PEP 8: Naming Conventions](https://peps.python.org/pep-0008/#naming-conventions)
- [Semantic Versioning](https://semver.org/)

[PEP 8]: https://peps.python.org/pep-0008/
[PEP 420]: https://peps.python.org/pep-0420/
## What it does
Checks for explicit use of dunder methods, like `__str__` and `__add__`.

## Why is this bad?
Dunder names are not meant to be called explicitly and, in most cases, can
be replaced with builtins or operators.

## Fix safety
This fix is always unsafe. When replacing dunder method calls with operators
or builtins, the behavior can change in the following ways:

1. Types may implement only a subset of related dunder methods. Calling a
   missing dunder method directly returns `NotImplemented`, but using the
   equivalent operator raises a `TypeError`.
   ```python
   class C: pass
   c = C()
   c.__gt__(1)  # before fix: NotImplemented
   c > 1        # after fix: raises TypeError
   ```
2. Instance-assigned dunder methods are ignored by operators and builtins.
   ```python
   class C: pass
   c = C()
   c.__bool__ = lambda: False
   c.__bool__() # before fix: False
   bool(c)      # after fix: True
   ```

3. Even with built-in types, behavior can differ.
   ```python
   (1).__gt__(1.0)  # before fix: NotImplemented
   1 > 1.0          # after fix: False
   ```

## Example
```python
three = (3.0).__str__()
twelve = "1".__add__("2")


def is_greater_than_two(x: int) -> bool:
    return x.__gt__(2)
```

Use instead:
```python
three = str(3.0)
twelve = "1" + "2"


def is_greater_than_two(x: int) -> bool:
    return x > 2
```
## What it does
Checks for unnecessary direct calls to lambda expressions.

## Why is this bad?
Calling a lambda expression directly is unnecessary. The expression can be
executed inline instead to improve readability.

## Example
```python
area = (lambda r: 3.14 * r**2)(radius)
```

Use instead:
```python
area = 3.14 * radius**2
```

## References
- [Python documentation: Lambdas](https://docs.python.org/3/reference/expressions.html#lambda)
## What it does
Checks for `__init__` methods that are turned into generators by the
inclusion of `yield` or `yield from` expressions.

## Why is this bad?
The `__init__` method is the constructor for a given Python class,
responsible for initializing, rather than creating, new objects.

The `__init__` method has to return `None`. By including a `yield` or
`yield from` expression in an `__init__`, the method will return a
generator object when called at runtime, resulting in a runtime error.

## Example
```python
class InitIsGenerator:
    def __init__(self, i):
        yield i
```

## References
- [CodeQL: `py-init-method-is-generator`](https://codeql.github.com/codeql-query-help/python/py-init-method-is-generator/)
## What it does
Checks for `__init__` methods that return values.

## Why is this bad?
```