# a7046c18:packages_core_python_.venv_bin_ruff:44551-44700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:44551-44700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for use of [PEP 695] type parameters with leading underscores in generic classes and
functions.

## Why is this bad?

[PEP 695] type parameters are already restricted in scope to the class or function in which they
appear, so leading underscores just hurt readability without the usual privacy benefits.

However, neither a diagnostic nor a fix will be emitted for "sunder" (`_T_`) or "dunder"
(`__T__`) type parameter names as these are not considered private.

## Example

```python
class GenericClass[_T]:
    var: _T


def generic_function[_T](var: _T) -> list[_T]:
    return var[0]
```

Use instead:

```python
class GenericClass[T]:
    var: T


def generic_function[T](var: T) -> list[T]:
    return var[0]
```

## Fix availability

If the name without an underscore would shadow a builtin or another variable, would be a
keyword, or would otherwise be an invalid identifier, a fix will not be available. In these
situations, you can consider using a trailing underscore or a different name entirely to satisfy
the lint rule.

## See also

This rule renames private [PEP 695] type parameters but doesn't convert pre-[PEP 695] generics
to the new format. See [`non-pep695-generic-function`][UP047] and
[`non-pep695-generic-class`][UP046] for rules that will make this transformation.
Those rules do not remove unused type variables after their changes,
so you may also want to consider enabling [`unused-private-type-var`][PYI018] to complete
the transition to [PEP 695] generics.

[PEP 695]: https://peps.python.org/pep-0695/
[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function
[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class
[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var
## What it does
Checks for `metaclass=type` in class definitions.

## Why is this bad?
Since Python 3, the default metaclass is `type`, so specifying it explicitly is redundant.

Even though `__prepare__` is not required, the default metaclass (`type`) implements it,
for the convenience of subclasses calling it via `super()`.
## Example

```python
class Foo(metaclass=type): ...
```

Use instead:

```python
class Foo: ...
```

## References
- [PEP 3115 – Metaclasses in Python 3000](https://peps.python.org/pep-3115/)
## What it does
Checks for uses of `open` and `read` that can be replaced by `pathlib`
methods, like `Path.read_text` and `Path.read_bytes`.

## Why is this bad?
When reading the entire contents of a file into a variable, it's simpler
and more concise to use `pathlib` methods like `Path.read_text` and
`Path.read_bytes` instead of `open` and `read` calls via `with` statements.

## Example
```python
with open(filename) as f:
    contents = f.read()
```

Use instead:
```python
from pathlib import Path

contents = Path(filename).read_text()
```
## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.read_bytes`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_bytes)
- [Python documentation: `Path.read_text`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_text)
## What it does
Checks for uses of `open` and `write` that can be replaced by `pathlib`
methods, like `Path.write_text` and `Path.write_bytes`.

## Why is this bad?
When writing a single string to a file, it's simpler and more concise
to use `pathlib` methods like `Path.write_text` and `Path.write_bytes`
instead of `open` and `write` calls via `with` statements.

## Example
```python
with open(filename, "w") as f:
    f.write(contents)
```

Use instead:
```python
from pathlib import Path

Path(filename).write_text(contents)
```

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.write_bytes`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_bytes)
- [Python documentation: `Path.write_text`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_text)
## What it does
Checks for `print` calls with unnecessary empty strings as positional
arguments and unnecessary `sep` keyword arguments.

## Why is this bad?
Prefer calling `print` without any positional arguments, which is
equivalent and more concise.

Similarly, when printing one or fewer items, the `sep` keyword argument,
(used to define the string that separates the `print` arguments) can be
omitted, as it's redundant when there are no items to separate.

## Example
```python
print("")
```

Use instead:
```python
print()
```