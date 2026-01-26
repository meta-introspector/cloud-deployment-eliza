# a7046c18:packages_core_python_.venv_bin_ruff:44401-44550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44401-44550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Checks for use of standalone type variables and parameter specifications in generic classes.

## Why is this bad?

Special type parameter syntax was introduced in Python 3.12 by [PEP 695] for defining generic
classes. This syntax is easier to read and provides cleaner support for generics.

## Known problems

The rule currently skips generic classes nested inside of other functions or classes. It also
skips type parameters with the `default` argument introduced in [PEP 696] and implemented in
Python 3.13.

This rule can only offer a fix if all of the generic types in the class definition are defined
in the current module. For external type parameters, a diagnostic is emitted without a suggested
fix.

Not all type checkers fully support PEP 695 yet, so even valid fixes suggested by this rule may
cause type checking to [fail].

## Fix safety

This fix is marked as unsafe, as [PEP 695] uses inferred variance for type parameters, instead
of the `covariant` and `contravariant` keywords used by `TypeVar` variables. As such, replacing
a `TypeVar` variable with an inline type parameter may change its variance.

## Example

```python
from typing import Generic, TypeVar

T = TypeVar("T")


class GenericClass(Generic[T]):
    var: T
```

Use instead:

```python
class GenericClass[T]:
    var: T
```

## See also

This rule replaces standalone type variables in classes but doesn't remove
the corresponding type variables even if they are unused after the fix. See
[`unused-private-type-var`][PYI018] for a rule to clean up unused
private type variables.

This rule will not rename private type variables to remove leading underscores, even though the
new type parameters are restricted in scope to their associated class. See
[`private-type-parameter`][UP049] for a rule to update these names.

This rule will correctly handle classes with multiple base classes, as long as the single
`Generic` base class is at the end of the argument list, as checked by
[`generic-not-last-base-class`][PYI059]. If a `Generic` base class is
found outside of the last position, a diagnostic is emitted without a suggested fix.

This rule only applies to generic classes and does not include generic functions. See
[`non-pep695-generic-function`][UP047] for the function version.

## Options

- `target-version`

[PEP 695]: https://peps.python.org/pep-0695/
[PEP 696]: https://peps.python.org/pep-0696/
[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/
[PYI059]: https://docs.astral.sh/ruff/rules/generic-not-last-base-class/
[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function/
[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/
[fail]: https://github.com/python/mypy/issues/18507
## What it does

Checks for use of standalone type variables and parameter specifications in generic functions.

## Why is this bad?

Special type parameter syntax was introduced in Python 3.12 by [PEP 695] for defining generic
functions. This syntax is easier to read and provides cleaner support for generics.

## Known problems

The rule currently skips generic functions nested inside of other functions or classes and those
with type parameters containing the `default` argument introduced in [PEP 696] and implemented
in Python 3.13.

Not all type checkers fully support PEP 695 yet, so even valid fixes suggested by this rule may
cause type checking to [fail].

## Fix safety

This fix is marked unsafe, as [PEP 695] uses inferred variance for type parameters, instead of
the `covariant` and `contravariant` keywords used by `TypeVar` variables. As such, replacing a
`TypeVar` variable with an inline type parameter may change its variance.

Additionally, if the rule cannot determine whether a parameter annotation corresponds to a type
variable (e.g. for a type imported from another module), it will not add the type to the generic
type parameter list. This causes the function to have a mix of old-style type variables and
new-style generic type parameters, which will be rejected by type checkers.

## Example

```python
from typing import TypeVar

T = TypeVar("T")


def generic_function(var: T) -> T:
    return var
```

Use instead:

```python
def generic_function[T](var: T) -> T:
    return var
```

## See also

This rule replaces standalone type variables in function signatures but doesn't remove
the corresponding type variables even if they are unused after the fix. See
[`unused-private-type-var`][PYI018] for a rule to clean up unused
private type variables.

This rule will not rename private type variables to remove leading underscores, even though the
new type parameters are restricted in scope to their associated function. See
[`private-type-parameter`][UP049] for a rule to update these names.

This rule only applies to generic functions and does not include generic classes. See
[`non-pep695-generic-class`][UP046] for the class version.

## Options

- `target-version`

[PEP 695]: https://peps.python.org/pep-0695/
[PEP 696]: https://peps.python.org/pep-0696/
[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/
[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class/
[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/
[fail]: https://github.com/python/mypy/issues/18507
## What it does

```