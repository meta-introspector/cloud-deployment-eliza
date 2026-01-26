# a7046c18:packages_core_python_.venv_bin_ruff:32401-32550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32401-32550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import numpy as np

arr1 = [np.Infinity, np.NaN, np.nan, np.PINF, np.inf]
arr2 = [np.float_(1.5), np.float64(5.1)]
np.round_(arr2)
```

Use instead:
```python
import numpy as np

arr1 = [np.inf, np.nan, np.nan, np.inf, np.inf]
arr2 = [np.float64(1.5), np.float64(5.1)]
np.round(arr2)
```
## What it does
Checks for class names that do not follow the `CamelCase` convention.

## Why is this bad?
[PEP 8] recommends the use of the `CapWords` (or `CamelCase`) convention
for class names:

> Class names should normally use the `CapWords` convention.
>
> The naming convention for functions may be used instead in cases where the interface is
> documented and used primarily as a callable.
>
> Note that there is a separate convention for builtin names: most builtin names are single
> words (or two words run together), with the `CapWords` convention used only for exception
> names and builtin constants.

## Example
```python
class my_class:
    pass
```

Use instead:
```python
class MyClass:
    pass
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#class-names
## What it does
Checks for functions names that do not follow the `snake_case` naming
convention.

## Why is this bad?
[PEP 8] recommends that function names follow `snake_case`:

> Function names should be lowercase, with words separated by underscores as necessary to
> improve readability. mixedCase is allowed only in contexts where that’s already the
> prevailing style (e.g. threading.py), to retain backwards compatibility.

Names can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]
or [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,
to ignore all functions starting with `test_` from this rule, set the
[`lint.pep8-naming.extend-ignore-names`] option to `["test_*"]`.

This rule exempts methods decorated with [`@typing.override`][override].
Explicitly decorating a method with `@override` signals to Ruff that the method is intended
to override a superclass method, and that a type checker will enforce that it does so. Ruff
therefore knows that it should not enforce naming conventions on such methods.

## Example
```python
def myFunction():
    pass
```

Use instead:
```python
def my_function():
    pass
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-variable-names
[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for argument names that do not follow the `snake_case` convention.

## Why is this bad?
[PEP 8] recommends that function names should be lower case and separated
by underscores (also known as `snake_case`).

> Function names should be lowercase, with words separated by underscores
> as necessary to improve readability.
>
> Variable names follow the same convention as function names.
>
> mixedCase is allowed only in contexts where that’s already the
> prevailing style (e.g. threading.py), to retain backwards compatibility.

Methods decorated with [`@typing.override`][override] are ignored.

## Example
```python
def my_function(A, myArg):
    pass
```

Use instead:
```python
def my_function(a, my_arg):
    pass
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments
[preview]: https://docs.astral.sh/ruff/preview/

[override]: https://docs.python.org/3/library/typing.html#typing.override
## What it does
Checks for class methods that use a name other than `cls` for their
first argument.

The method `__new__` is exempted from this
check and the corresponding violation is caught by
[`bad-staticmethod-argument`][PLW0211].

## Why is this bad?
[PEP 8] recommends the use of `cls` as the first argument for all class
methods:

> Always use `cls` for the first argument to class methods.
>
> If a function argument’s name clashes with a reserved keyword, it is generally better to
> append a single trailing underscore rather than use an abbreviation or spelling corruption.
> Thus `class_` is better than `clss`. (Perhaps better is to avoid such clashes by using a synonym.)

Names can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]
or [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,
to allow the use of `klass` as the first argument to class methods, set
the [`lint.pep8-naming.extend-ignore-names`] option to `["klass"]`.

## Example

```python
```