# a7046c18:packages_core_python_.venv_bin_ruff:32701-32850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32701-32850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Note
Identifiers consisting of a single uppercase character are ambiguous under
the rules of [PEP 8], which specifies `CamelCase` for classes and
`ALL_CAPS_SNAKE_CASE` for constants. Without a second character, it is not
possible to reliably guess whether the identifier is intended to be part
of a `CamelCase` string for a class or an `ALL_CAPS_SNAKE_CASE` string for
a constant, since both conventions will produce the same output when given
a single input character. Therefore, this lint rule does not apply to cases
where the imported identifier consists of a single uppercase character.

A common example of a single uppercase character being used for a class
name can be found in Django's `django.db.models.Q` class.

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for lowercase imports that are aliased to non-lowercase names.

## Why is this bad?
[PEP 8] recommends naming conventions for classes, functions,
constants, and more. The use of inconsistent naming styles between
import and alias names may lead readers to expect an import to be of
another type (e.g., confuse a Python class with a constant).

Import aliases should thus follow the same naming style as the member
being imported.

## Example
```python
from example import myclassname as MyClassName
```

Use instead:
```python
from example import myclassname
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for `CamelCase` imports that are aliased to lowercase names.

## Why is this bad?
[PEP 8] recommends naming conventions for classes, functions,
constants, and more. The use of inconsistent naming styles between
import and alias names may lead readers to expect an import to be of
another type (e.g., confuse a Python class with a constant).

Import aliases should thus follow the same naming style as the member
being imported.

## Example
```python
from example import MyClassName as myclassname
```

Use instead:
```python
from example import MyClassName
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for `CamelCase` imports that are aliased to constant-style names.

## Why is this bad?
[PEP 8] recommends naming conventions for classes, functions,
constants, and more. The use of inconsistent naming styles between
import and alias names may lead readers to expect an import to be of
another type (e.g., confuse a Python class with a constant).

Import aliases should thus follow the same naming style as the member
being imported.

## Example
```python
from example import MyClassName as MY_CLASS_NAME
```

Use instead:
```python
from example import MyClassName
```

## Note
Identifiers consisting of a single uppercase character are ambiguous under
the rules of [PEP 8], which specifies `CamelCase` for classes and
`ALL_CAPS_SNAKE_CASE` for constants. Without a second character, it is not
possible to reliably guess whether the identifier is intended to be part
of a `CamelCase` string for a class or an `ALL_CAPS_SNAKE_CASE` string for
a constant, since both conventions will produce the same output when given
a single input character. Therefore, this lint rule does not apply to cases
where the alias for the imported identifier consists of a single uppercase
character.

A common example of a single uppercase character being used for a class
name can be found in Django's `django.db.models.Q` class.

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/
## What it does
Checks for class variable names that follow the `mixedCase` convention.

## Why is this bad?
[PEP 8] recommends that variable names should be lower case and separated
by underscores (also known as `snake_case`).

> Function names should be lowercase, with words separated by underscores
> as necessary to improve readability.
>
> Variable names follow the same convention as function names.
>
> mixedCase is allowed only in contexts where that’s already the
> prevailing style (e.g. threading.py), to retain backwards compatibility.

## Example
```python
class MyClass:
    myVariable = "hello"
    another_variable = "world"
```

Use instead:
```python
class MyClass:
    my_variable = "hello"
    another_variable = "world"
```

## Options
- `lint.pep8-naming.ignore-names`
- `lint.pep8-naming.extend-ignore-names`

[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments
## What it does
Checks for global variable names that follow the `mixedCase` convention.

```