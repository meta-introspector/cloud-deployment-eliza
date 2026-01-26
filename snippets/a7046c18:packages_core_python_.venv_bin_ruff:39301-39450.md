# a7046c18:packages_core_python_.venv_bin_ruff:39301-39450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39301-39450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
from .base import *  # noqa: F403
```

## Fix safety
This rule will attempt to fix blanket `noqa` annotations that appear to
be unintentional. For example, given `# noqa F401`, the rule will suggest
inserting a colon, as in `# noqa: F401`.

While modifying `noqa` comments is generally safe, doing so may introduce
additional diagnostics.

## References
- [Ruff documentation](https://docs.astral.sh/ruff/configuration/#error-suppression)
## What it does
Checks for common mistakes when using mock objects.

## Why is this bad?
The `mock` module exposes an assertion API that can be used to verify that
mock objects undergo expected interactions. This rule checks for common
mistakes when using this API.

For example, it checks for mock attribute accesses that should be replaced
with mock method calls.

## Example
```python
my_mock.assert_called
```

Use instead:
```python
my_mock.assert_called()
```
## What it does
Checks for type names that do not match the variance of their associated
type parameter.

## Why is this bad?
[PEP 484] recommends the use of the `_co` and `_contra` suffixes for
covariant and contravariant type parameters, respectively (while invariant
type parameters should not have any such suffix).

## Example
```python
from typing import TypeVar

T = TypeVar("T", covariant=True)
U = TypeVar("U", contravariant=True)
V_co = TypeVar("V_co")
```

Use instead:
```python
from typing import TypeVar

T_co = TypeVar("T_co", covariant=True)
U_contra = TypeVar("U_contra", contravariant=True)
V = TypeVar("V")
```

## References
- [Python documentation: `typing` — Support for type hints](https://docs.python.org/3/library/typing.html)
- [PEP 483 – The Theory of Type Hints: Covariance and Contravariance](https://peps.python.org/pep-0483/#covariance-and-contravariance)
- [PEP 484 – Type Hints: Covariance and contravariance](https://peps.python.org/pep-0484/#covariance-and-contravariance)

[PEP 484]: https://peps.python.org/pep-0484/
## What it does
Checks for `TypeVar` and `ParamSpec` definitions in which the type is
both covariant and contravariant.

## Why is this bad?
By default, Python's generic types are invariant, but can be marked as
either covariant or contravariant via the `covariant` and `contravariant`
keyword arguments. While the API does allow you to mark a type as both
covariant and contravariant, this is not supported by the type system,
and should be avoided.

Instead, change the variance of the type to be either covariant,
contravariant, or invariant. If you want to describe both covariance and
contravariance, consider using two separate type parameters.

For context: an "invariant" generic type only accepts values that exactly
match the type parameter; for example, `list[Dog]` accepts only `list[Dog]`,
not `list[Animal]` (superclass) or `list[Bulldog]` (subclass). This is
the default behavior for Python's generic types.

A "covariant" generic type accepts subclasses of the type parameter; for
example, `Sequence[Animal]` accepts `Sequence[Dog]`. A "contravariant"
generic type accepts superclasses of the type parameter; for example,
`Callable[Dog]` accepts `Callable[Animal]`.

## Example
```python
from typing import TypeVar

T = TypeVar("T", covariant=True, contravariant=True)
```

Use instead:
```python
from typing import TypeVar

T_co = TypeVar("T_co", covariant=True)
T_contra = TypeVar("T_contra", contravariant=True)
```

## References
- [Python documentation: `typing` — Support for type hints](https://docs.python.org/3/library/typing.html)
- [PEP 483 – The Theory of Type Hints: Covariance and Contravariance](https://peps.python.org/pep-0483/#covariance-and-contravariance)
- [PEP 484 – Type Hints: Covariance and contravariance](https://peps.python.org/pep-0484/#covariance-and-contravariance)
## What it does
Checks for `TypeVar`, `TypeVarTuple`, `ParamSpec`, and `NewType`
definitions in which the name of the type parameter does not match the name
of the variable to which it is assigned.

## Why is this bad?
When defining a `TypeVar` or a related type parameter, Python allows you to
provide a name for the type parameter. According to [PEP 484], the name
provided to the `TypeVar` constructor must be equal to the name of the
variable to which it is assigned.

## Example
```python
from typing import TypeVar

T = TypeVar("U")
```

Use instead:
```python
from typing import TypeVar

T = TypeVar("T")
```

## References
- [Python documentation: `typing` — Support for type hints](https://docs.python.org/3/library/typing.html)
- [PEP 484 – Type Hints: Generics](https://peps.python.org/pep-0484/#generics)

[PEP 484]:https://peps.python.org/pep-0484/#generics
## What it does
Checks for single strings assigned to `__slots__`.

## Why is this bad?
In Python, the `__slots__` attribute allows you to explicitly define the
attributes (instance variables) that a class can have. By default, Python
uses a dictionary to store an object's attributes, which incurs some memory
overhead. However, when `__slots__` is defined, Python uses a more compact
internal structure to store the object's attributes, resulting in memory
savings.
```