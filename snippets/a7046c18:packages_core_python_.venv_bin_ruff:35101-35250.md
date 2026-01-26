# a7046c18:packages_core_python_.venv_bin_ruff:35101-35250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:35101-35250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
spam(1)\n#
```

## Fix safety

This fix is marked unsafe if the whitespace is inside a multiline string,
as removing it changes the string's content.

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for files missing a new line at the end of the file.

## Why is this bad?
Trailing blank lines in a file are superfluous.

However, the last line of the file should end with a newline.

## Example
```python
spam(1)
```

Use instead:
```python
spam(1)\n
```
## What it does
Checks for superfluous whitespace in blank lines.

## Why is this bad?
According to [PEP 8], "avoid trailing whitespace anywhere. Because it’s usually
invisible, it can be confusing"

## Example
```python
class Foo(object):\n    \n    bang = 12
```

Use instead:
```python
class Foo(object):\n\n    bang = 12
```

## Fix safety

This fix is marked unsafe if the whitespace is inside a multiline string,
as removing it changes the string's content.

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for files with multiple trailing blank lines.

In the case of notebooks, this check is applied to
each cell separately.

## Why is this bad?
Trailing blank lines in a file are superfluous.

However, the last line of the file should end with a newline.

## Example
```python
spam(1)\n\n\n
```

Use instead:
```python
spam(1)\n
```
## What it does
Checks for doc lines that exceed the specified maximum character length.

## Why is this bad?
For flowing long blocks of text (docstrings or comments), overlong lines
can hurt readability. [PEP 8], for example, recommends that such lines be
limited to 72 characters, while this rule enforces the limit specified by
the [`lint.pycodestyle.max-doc-length`] setting. (If no value is provided, this
rule will be ignored, even if it's added to your `--select` list.)

In the context of this rule, a "doc line" is defined as a line consisting
of either a standalone comment or a standalone string, like a docstring.

In the interest of pragmatism, this rule makes a few exceptions when
determining whether a line is overlong. Namely, it:

1. Ignores lines that consist of a single "word" (i.e., without any
   whitespace between its characters).
2. Ignores lines that end with a URL, as long as the URL starts before
   the line-length threshold.
3. Ignores line that end with a pragma comment (e.g., `# type: ignore`
   or `# noqa`), as long as the pragma comment starts before the
   line-length threshold. That is, a line will not be flagged as
   overlong if a pragma comment _causes_ it to exceed the line length.
   (This behavior aligns with that of the Ruff formatter.)

If [`lint.pycodestyle.ignore-overlong-task-comments`] is `true`, this rule will
also ignore comments that start with any of the specified [`lint.task-tags`]
(e.g., `# TODO:`).

## Example
```python
def function(x):
    """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor purus ut ex fermentum, at maximus est hendrerit."""
```

Use instead:
```python
def function(x):
    """
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Duis auctor purus ut ex fermentum, at maximus est hendrerit.
    """
```

## Error suppression
Hint: when suppressing `W505` errors within multi-line strings (like
docstrings), the `noqa` directive should come at the end of the string
(after the closing triple quote), and will apply to the entire string, like
so:

```python
"""Lorem ipsum dolor sit amet.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
"""  # noqa: W505
```

## Options
- `lint.task-tags`
- `lint.pycodestyle.max-doc-length`
- `lint.pycodestyle.ignore-overlong-task-comments`

[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length
## What it does
Checks for invalid escape sequences.

## Why is this bad?
Invalid escape sequences are deprecated in Python 3.6.

## Example
```python
regex = "\.png$"
```

Use instead:
```python
regex = r"\.png$"
```

Or, if the string already contains a valid escape sequence:
```