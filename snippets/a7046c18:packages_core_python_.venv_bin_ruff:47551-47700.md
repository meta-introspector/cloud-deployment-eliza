# a7046c18:packages_core_python_.venv_bin_ruff:47551-47700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:47551-47700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
Marking a variable with a leading underscore conveys that it is intentionally unused within the function or method.
When these variables are later referenced in the code, it causes confusion and potential misunderstandings about
the code's intention. If a variable marked as "unused" is subsequently used, it suggests that either the variable
could be given a clearer name, or that the code is accidentally making use of the wrong variable.

Sometimes leading underscores are used to avoid variables shadowing other variables, Python builtins, or Python
keywords. However, [PEP 8] recommends to use trailing underscores for this rather than leading underscores.

Dunder variables are ignored by this rule, as are variables named `_`.
Only local variables in function scopes are flagged by the rule.

## Example
```python
def function():
    _variable = 3
    # important: avoid shadowing the builtin `id()` function!
    _id = 4
    return _variable + _id
```

Use instead:
```python
def function():
    variable = 3
    # important: avoid shadowing the builtin `id()` function!
    id_ = 4
    return variable + id_
```

## Fix availability
The rule's fix is only available for variables that start with leading underscores.
It will also only be available if the "obvious" new name for the variable
would not shadow any other known variables already accessible from the scope
in which the variable is defined.

## Fix safety
This rule's fix is marked as unsafe.

For this rule's fix, Ruff renames the variable and fixes up all known references to
it so they point to the renamed variable. However, some renamings also require other
changes such as different arguments to constructor calls or alterations to comments.
Ruff is aware of some of these cases: `_T = TypeVar("_T")` will be fixed to
`T = TypeVar("T")` if the `_T` binding is flagged by this rule. However, in general,
cases like these are hard to detect and hard to automatically fix.

## Options
- [`lint.dummy-variable-rgx`]

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for classes that have [PEP 695] [type parameter lists]
while also inheriting from `typing.Generic` or `typing_extensions.Generic`.

## Why is this bad?
Such classes cause errors at runtime:

```python
from typing import Generic, TypeVar

U = TypeVar("U")

# TypeError: Cannot inherit from Generic[...] multiple times.
class C[T](Generic[U]): ...
```

## Example

```python
from typing import Generic, ParamSpec, TypeVar, TypeVarTuple

U = TypeVar("U")
P = ParamSpec("P")
Ts = TypeVarTuple("Ts")


class C[T](Generic[U, P, *Ts]): ...
```

Use instead:

```python
class C[T, U, **P, *Ts]: ...
```

## Fix safety
As the fix changes runtime behaviour, it is always marked as unsafe.
Additionally, comments within the fix range will not be preserved.

## References
- [Python documentation: User-defined generic types](https://docs.python.org/3/library/typing.html#user-defined-generic-types)
- [Python documentation: type parameter lists](https://docs.python.org/3/reference/compound_stmts.html#type-params)
- [PEP 695 - Type Parameter Syntax](https://peps.python.org/pep-0695/)

[PEP 695]: https://peps.python.org/pep-0695/
[type parameter lists]: https://docs.python.org/3/reference/compound_stmts.html#type-params
## What it does
Checks for form feed characters preceded by either a space or a tab.

## Why is this bad?
[The language reference][lexical-analysis-indentation] states:

> A formfeed character may be present at the start of the line;
> it will be ignored for the indentation calculations above.
> Formfeed characters occurring elsewhere in the leading whitespace
> have an undefined effect (for instance, they may reset the space count to zero).

## Example

```python
if foo():\n    \fbar()
```

Use instead:

```python
if foo():\n    bar()
```

[lexical-analysis-indentation]: https://docs.python.org/3/reference/lexical_analysis.html#indentation
## What it does

Checks for uses of the `re` module that can be replaced with builtin `str` methods.

## Why is this bad?

Performing checks on strings directly can make the code simpler, may require
less escaping, and will often be faster.

## Example

```python
re.sub("abc", "", s)
```

Use instead:

```python
s.replace("abc", "")
```

## Details

The rule reports the following calls when the first argument to the call is
a plain string literal, and no additional flags are passed:

- `re.sub`
- `re.match`
- `re.search`
- `re.fullmatch`
```