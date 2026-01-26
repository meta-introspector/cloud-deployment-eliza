# a7046c18:packages_core_python_.venv_bin_ruff:20551-20700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20551-20700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
By default, `jinja2` sets `autoescape` to `False`, so it is important to
set `autoescape=True` or use the `select_autoescape` function to mitigate
XSS vulnerabilities.

## Example
```python
import jinja2

jinja2.Environment(loader=jinja2.FileSystemLoader("."))
```

Use instead:
```python
import jinja2

jinja2.Environment(loader=jinja2.FileSystemLoader("."), autoescape=True)
```

## References
- [Jinja documentation: API](https://jinja.palletsprojects.com/en/latest/api/#autoescaping)
- [Common Weakness Enumeration: CWE-94](https://cwe.mitre.org/data/definitions/94.html)
## What it does
Checks for uses of the `mako` templates.

## Why is this bad?
Mako templates allow HTML and JavaScript rendering by default, and are
inherently open to XSS attacks. Ensure variables in all templates are
properly sanitized via the `n`, `h` or `x` flags (depending on context).
For example, to HTML escape the variable `data`, use `${ data |h }`.

## Example
```python
from mako.template import Template

Template("hello")
```

Use instead:
```python
from mako.template import Template

Template("hello |h")
```

## References
- [Mako documentation](https://www.makotemplates.org/)
- [OpenStack security: Cross site scripting XSS](https://security.openstack.org/guidelines/dg_cross-site-scripting-xss.html)
- [Common Weakness Enumeration: CWE-80](https://cwe.mitre.org/data/definitions/80.html)
## What it does
Checks for non-literal strings being passed to [`markupsafe.Markup`][markupsafe-markup].

## Why is this bad?
[`markupsafe.Markup`][markupsafe-markup] does not perform any escaping, so passing dynamic
content, like f-strings, variables or interpolated strings will potentially
lead to XSS vulnerabilities.

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
Checks for `except` clauses that catch all exceptions.  This includes
`except BaseException` and `except Exception`.


## Why is this bad?
Overly broad `except` clauses can lead to unexpected behavior, such as
catching `KeyboardInterrupt` or `SystemExit` exceptions that prevent the
user from exiting the program.

Instead of catching all exceptions, catch only those that are expected to
be raised in the `try` block.

## Example
```python
try:
    foo()
except BaseException:
    ...
```

Use instead:
```python
try:
    foo()
except FileNotFoundError:
    ...
```

Exceptions that are re-raised will _not_ be flagged, as they're expected to
be caught elsewhere:
```python
try:
    foo()
except BaseException:
    raise
```