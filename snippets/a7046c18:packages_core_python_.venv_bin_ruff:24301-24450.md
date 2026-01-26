# a7046c18:packages_core_python_.venv_bin_ruff:24301-24450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:24301-24450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
from gettext import gettext as _

name = "Maria"
_(f"Hello, {name}!")  # Looks for "Hello, Maria!".
```

Use instead:
```python
from gettext import gettext as _

name = "Maria"
_("Hello, %s!") % name  # Looks for "Hello, %s!".
```

## Options

- `lint.flake8-gettext.function-names`

## References
- [Python documentation: `gettext` — Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)
## What it does
Checks for `str.format` calls in `gettext` function calls.

## Why is this bad?
In the `gettext` API, the `gettext` function (often aliased to `_`) returns
a translation of its input argument by looking it up in a translation
catalog.

Calling `gettext` with a formatted string as its argument can cause
unexpected behavior. Since the formatted string is resolved before the
function call, the translation catalog will look up the formatted string,
rather than the `str.format`-style template.

Instead, format the value returned by the function call, rather than
its argument.

## Example
```python
from gettext import gettext as _

name = "Maria"
_("Hello, {}!".format(name))  # Looks for "Hello, Maria!".
```

Use instead:
```python
from gettext import gettext as _

name = "Maria"
_("Hello, %s!") % name  # Looks for "Hello, %s!".
```

## Options

- `lint.flake8-gettext.function-names`

## References
- [Python documentation: `gettext` — Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)
## What it does
Checks for printf-style formatted strings in `gettext` function calls.

## Why is this bad?
In the `gettext` API, the `gettext` function (often aliased to `_`) returns
a translation of its input argument by looking it up in a translation
catalog.

Calling `gettext` with a formatted string as its argument can cause
unexpected behavior. Since the formatted string is resolved before the
function call, the translation catalog will look up the formatted string,
rather than the printf-style template.

Instead, format the value returned by the function call, rather than
its argument.

## Example
```python
from gettext import gettext as _

name = "Maria"
_("Hello, %s!" % name)  # Looks for "Hello, Maria!".
```

Use instead:
```python
from gettext import gettext as _

name = "Maria"
_("Hello, %s!") % name  # Looks for "Hello, %s!".
```

## Options

- `lint.flake8-gettext.function-names`

## References
- [Python documentation: `gettext` — Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)
## What it does
Checks for implicitly concatenated strings on a single line.

## Why is this bad?
While it is valid Python syntax to concatenate multiple string or byte
literals implicitly (via whitespace delimiters), it is unnecessary and
negatively affects code readability.

In some cases, the implicit concatenation may also be unintentional, as
code formatters are capable of introducing single-line implicit
concatenations when collapsing long lines.

## Example
```python
z = "The quick " "brown fox."
```

Use instead:
```python
z = "The quick brown fox."
```
## What it does
Checks for implicitly concatenated strings that span multiple lines.

## Why is this bad?
For string literals that wrap across multiple lines, [PEP 8] recommends
the use of implicit string concatenation within parentheses instead of
using a backslash for line continuation, as the former is more readable
than the latter.

By default, this rule will only trigger if the string literal is
concatenated via a backslash. To disallow implicit string concatenation
altogether, set the [`lint.flake8-implicit-str-concat.allow-multiline`] option
to `false`.

## Example
```python
z = "The quick brown fox jumps over the lazy "\
    "dog."
```

Use instead:
```python
z = (
    "The quick brown fox jumps over the lazy "
    "dog."
)
```

## Options
- `lint.flake8-implicit-str-concat.allow-multiline`
```