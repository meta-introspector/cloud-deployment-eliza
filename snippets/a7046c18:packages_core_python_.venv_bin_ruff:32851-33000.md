# a7046c18:packages_core_python_.venv_bin_ruff:32851-33000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32851-33000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
[PEP 8] recommends that global variable names should be lower case and
separated by underscores (also known as `snake_case`).

> ### Global Variable Names
> (Let’s hope that these variables are meant for use inside one module
> only.) The conventions are about the same as those for functions.
>
> Modules that are designed for use via `from M import *` should use the
> `__all__` mechanism to prevent exporting globals, or use the older
> convention of prefixing such globals with an underscore (which you might
> want to do to indicate these globals are “module non-public”).
>
> ### Function and Variable Names
> Function names should be lowercase, with words separated by underscores
> as necessary to improve readability.
>
> Variable names follow the same convention as function names.
>
> mixedCase is allowed only in contexts where that’s already the prevailing
> style (e.g. threading.py), to retain backwards compatibility.

## Example
```python
myVariable = "hello"
another_variable = "world"
yet_anotherVariable = "foo"
```

Use instead:
```python
my_variable = "hello"
another_variable = "world"
yet_another_variable = "foo"
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#global-variable-names
## What it does
Checks for `CamelCase` imports that are aliased as acronyms.

## Why is this bad?
[PEP 8] recommends naming conventions for classes, functions,
constants, and more. The use of inconsistent naming styles between
import and alias names may lead readers to expect an import to be of
another type (e.g., confuse a Python class with a constant).

Import aliases should thus follow the same naming style as the member
being imported.

Note that this rule is distinct from `camelcase-imported-as-constant`
to accommodate selective enforcement.

Also note that import aliases following an import convention according to the
[`lint.flake8-import-conventions.aliases`] option are allowed.

## Example
```python
from example import MyClassName as MCN
```

Use instead:
```python
from example import MyClassName
```

## Options
- `lint.flake8-import-conventions.aliases`
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for custom exception definitions that omit the `Error` suffix.

## Why is this bad?
The `Error` suffix is recommended by [PEP 8]:

> Because exceptions should be classes, the class naming convention
> applies here. However, you should use the suffix `"Error"` on your
> exception names (if the exception actually is an error).

## Example

```python
class Validation(Exception): ...
```

Use instead:

```python
class ValidationError(Exception): ...
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#exception-names
## What it does
Checks for module names that do not follow the `snake_case` naming
convention or are otherwise invalid.

## Why is this bad?
[PEP 8] recommends the use of the `snake_case` naming convention for
module names:

> Modules should have short, all-lowercase names. Underscores can be used in the
> module name if it improves readability. Python packages should also have short,
> all-lowercase names, although the use of underscores is discouraged.
>
> When an extension module written in C or C++ has an accompanying Python module that
> provides a higher level (e.g. more object-oriented) interface, the C/C++ module has
> a leading underscore (e.g. `_socket`).

Further, in order for Python modules to be importable, they must be valid
identifiers. As such, they cannot start with a digit, or collide with hard
keywords, like `import` or `class`.

## Example
- Instead of `example-module-name` or `example module name`, use `example_module_name`.
- Instead of `ExampleModule`, use `example_module`.

## Options

- `lint.pep8-naming.ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#package-and-module-names
## What it does
Checks for `inplace=True` usages in `pandas` function and method
calls.

## Why is this bad?
Using `inplace=True` encourages mutation rather than immutable data,
which is harder to reason about and may cause bugs. It also removes the
ability to use the method chaining style for `pandas` operations.

Further, in many cases, `inplace=True` does not provide a performance
benefit, as `pandas` will often copy `DataFrames` in the background.

## Example
```python
df.sort_values("col1", inplace=True)
```

Use instead:
```python
```