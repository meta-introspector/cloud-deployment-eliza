# a7046c18:packages_core_python_.venv_bin_ruff:43951-44100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43951-44100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Options
- `target-version`

## Fix safety
This rule's fix is marked as unsafe because it will remove all code,
comments, and annotations within unreachable version blocks.

## References
- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)
## What it does
Checks for the presence of unnecessary quotes in type annotations.

## Why is this bad?
In Python, type annotations can be quoted to avoid forward references.

However, if `from __future__ import annotations` is present, Python
will always evaluate type annotations in a deferred manner, making
the quotes unnecessary.

Similarly, if the annotation is located in a typing-only context and
won't be evaluated by Python at runtime, the quotes will also be
considered unnecessary. For example, Python does not evaluate type
annotations on assignments in function bodies.

## Example

Given:

```python
from __future__ import annotations


def foo(bar: "Bar") -> "Bar": ...
```

Use instead:

```python
from __future__ import annotations


def foo(bar: Bar) -> Bar: ...
```

Given:

```python
def foo() -> None:
    bar: "Bar"
```

Use instead:

```python
def foo() -> None:
    bar: Bar
```

## Preview

When [preview] is enabled, if [`lint.future-annotations`] is set to `true`,
`from __future__ import annotations` will be added if doing so would allow an annotation to be
unquoted.

## Fix safety

The rule's fix is marked as safe, unless [preview] and
[`lint.future-annotations`] are enabled and a `from __future__ import
annotations` import is added. Such an import may change the behavior of all annotations in the
file.

## Options
- `lint.future-annotations`

## See also
- [`quoted-annotation-in-stub`][PYI020]: A rule that
  removes all quoted annotations from stub files
- [`quoted-type-alias`][TC008]: A rule that removes unnecessary quotes
  from type aliases.

## References
- [PEP 563 – Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)
- [Python documentation: `__future__`](https://docs.python.org/3/library/__future__.html#module-__future__)

[PYI020]: https://docs.astral.sh/ruff/rules/quoted-annotation-in-stub/
[TC008]: https://docs.astral.sh/ruff/rules/quoted-type-alias/
[preview]: https://docs.astral.sh/ruff/preview/
## Removed
This rule was removed as using [PEP 604] syntax in `isinstance` and `issubclass` calls
isn't recommended practice, and it incorrectly suggests that other typing syntaxes like [PEP 695]
would be supported by `isinstance` and `issubclass`. Using the [PEP 604] syntax
is also slightly slower.

## What it does
Checks for uses of `isinstance` and `issubclass` that take a tuple
of types for comparison.

## Why is this bad?
Since Python 3.10, `isinstance` and `issubclass` can be passed a
`|`-separated union of types, which is consistent
with the union operator introduced in [PEP 604].

Note that this results in slower code. Ignore this rule if the
performance of an `isinstance` or `issubclass` check is a
concern, e.g., in a hot loop.

## Example
```python
isinstance(x, (int, float))
```

Use instead:
```python
isinstance(x, int | float)
```

## Options
- `target-version`

## References
- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)
- [Python documentation: `issubclass`](https://docs.python.org/3/library/functions.html#issubclass)

[PEP 604]: https://peps.python.org/pep-0604/
[PEP 695]: https://peps.python.org/pep-0695/
## What it does
Checks for class definitions that include unnecessary parentheses after
the class name.

## Why is this bad?
If a class definition doesn't have any bases, the parentheses are
unnecessary.

## Example
```python
class Foo():
    ...
```

Use instead:
```python
class Foo:
    ...
```
## What it does
Checks for use of `TypeAlias` annotations and `TypeAliasType` assignments
for declaring type aliases.

## Why is this bad?
```