# a7046c18:packages_core_python_.venv_bin_ruff:46951-47100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:46951-47100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
> Init-only fields are added as parameters to the generated `__init__()`
> method, and are passed to the optional `__post_init__()` method. They are
> not otherwise used by dataclasses.

## Example
```python
from dataclasses import InitVar, dataclass


@dataclass
class Foo:
    bar: InitVar[int] = 0

    def __post_init__(self, bar: int = 1, baz: int = 2) -> None:
        print(bar, baz)


foo = Foo()  # Prints '0 2'.
```

Use instead:
```python
from dataclasses import InitVar, dataclass


@dataclass
class Foo:
    bar: InitVar[int] = 1
    baz: InitVar[int] = 2

    def __post_init__(self, bar: int, baz: int) -> None:
        print(bar, baz)


foo = Foo()  # Prints '1 2'.
```

## Fix safety

This fix is always marked as unsafe because, although switching to `InitVar` is usually correct,
it is incorrect when the parameter is not intended to be part of the public API or when the value
is meant to be shared across all instances.

## References
- [Python documentation: Post-init processing](https://docs.python.org/3/library/dataclasses.html#post-init-processing)
- [Python documentation: Init-only variables](https://docs.python.org/3/library/dataclasses.html#init-only-variables)

[documentation]: https://docs.python.org/3/library/dataclasses.html#init-only-variables
## What it does
Checks for useless `if`-`else` conditions with identical arms.

## Why is this bad?
Useless `if`-`else` conditions add unnecessary complexity to the code without
providing any logical benefit. Assigning the value directly is clearer.

## Example
```python
foo = x if y else x
```

Use instead:
```python
foo = x
```
## Removed
This rule was implemented in `bandit` and has been remapped to
[S704](unsafe-markup-use.md)

## What it does
Checks for non-literal strings being passed to [`markupsafe.Markup`][markupsafe-markup].

## Why is this bad?
[`markupsafe.Markup`][markupsafe-markup] does not perform any escaping,
so passing dynamic content, like f-strings, variables or interpolated strings
will potentially lead to XSS vulnerabilities.

Instead you should interpolate the `Markup` object.

Using [`lint.flake8-bandit.extend-markup-names`] additional objects can be
treated like `Markup`.

This rule was originally inspired by [flake8-markupsafe] but doesn't carve
out any exceptions for i18n related calls by default.

You can use [`lint.flake8-bandit.allowed-markup-calls`] to specify exceptions.

## Example
Given:
```python
from markupsafe import Markup

content = "<script>alert('Hello, world!')</script>"
html = Markup(f"<b>{content}</b>")  # XSS
```

Use instead:
```python
from markupsafe import Markup

content = "<script>alert('Hello, world!')</script>"
html = Markup("<b>{}</b>").format(content)  # Safe
```

Given:
```python
from markupsafe import Markup

lines = [
    Markup("<b>heading</b>"),
    "<script>alert('XSS attempt')</script>",
]
html = Markup("<br>".join(lines))  # XSS
```

Use instead:
```python
from markupsafe import Markup

lines = [
    Markup("<b>heading</b>"),
    "<script>alert('XSS attempt')</script>",
]
html = Markup("<br>").join(lines)  # Safe
```
## Options
- `lint.flake8-bandit.extend-markup-names`
- `lint.flake8-bandit.allowed-markup-calls`

## References
- [MarkupSafe on PyPI](https://pypi.org/project/MarkupSafe/)
- [`markupsafe.Markup` API documentation](https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup)

[markupsafe-markup]: https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup
[flake8-markupsafe]: https://github.com/vmagamedov/flake8-markupsafe
## What it does
Checks for type annotations where `None` is not at the end of an union.

## Why is this bad?
Type annotation unions are commutative, meaning that the order of the elements
does not matter. The `None` literal represents the absence of a value. For
readability, it's preferred to write the more informative type expressions first.

## Example
```python
def func(arg: None | int): ...
```

Use instead:
```python
def func(arg: int | None): ...
```