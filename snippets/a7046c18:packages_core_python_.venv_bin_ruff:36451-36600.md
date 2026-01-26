# a7046c18:packages_core_python_.venv_bin_ruff:36451-36600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36451-36600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Checks for docstrings on class definitions that are preceded by a blank
line.

## Why is this bad?
Avoid introducing any blank lines between a class definition and its
docstring, for consistency.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `google`,
`numpy`, and `pep257` conventions.

For an alternative, see [D203].

## Example

```python
class PhotoMetadata:

    """Metadata about a photo."""
```

Use instead:

```python
class PhotoMetadata:
    """Metadata about a photo."""
```

## Options
- `lint.pydocstyle.convention`

[D203]: https://docs.astral.sh/ruff/rules/incorrect-blank-line-before-class
## What it does
Checks for docstring summary lines that are not positioned on the first
physical line of the docstring.

## Why is this bad?
[PEP 257] recommends that multi-line docstrings consist of "a summary line
just like a one-line docstring, followed by a blank line, followed by a
more elaborate description."

The summary line should be located on the first physical line of the
docstring, immediately after the opening quotes.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `google`
convention, and disabled when using the `numpy` and `pep257` conventions.

For an alternative, see [D213].

## Example
```python
def sort_list(l: list[int]) -> list[int]:
    """
    Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the
    bubble sort algorithm.
    """
```

Use instead:
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the bubble
    sort algorithm.
    """
```

## Options
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[D213]: https://docs.astral.sh/ruff/rules/multi-line-summary-second-line
[PEP 257]: https://peps.python.org/pep-0257
## What it does
Checks for docstring summary lines that are not positioned on the second
physical line of the docstring.

## Why is this bad?
[PEP 257] recommends that multi-line docstrings consist of "a summary line
just like a one-line docstring, followed by a blank line, followed by a
more elaborate description."

The summary line should be located on the second physical line of the
docstring, immediately after the opening quotes and the blank line.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is disabled when using the `google`,
`numpy`, and `pep257` conventions.

For an alternative, see [D212].

## Example
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the
    bubble sort algorithm.
    """
```

Use instead:
```python
def sort_list(l: list[int]) -> list[int]:
    """
    Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the bubble
    sort algorithm.
    """
```

## Options
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[D212]: https://docs.astral.sh/ruff/rules/multi-line-summary-first-line
[PEP 257]: https://peps.python.org/pep-0257
## What it does
Checks for over-indented sections in docstrings.

## Why is this bad?
This rule enforces a consistent style for docstrings with multiple
sections.

Multiline docstrings are typically composed of a summary line, followed by
a blank line, followed by a series of sections, each with a section header
and a section body. The convention is that all sections should use
consistent indentation. In each section, the header should match the
indentation of the docstring's opening quotes, and the body should be
indented one level further.

This rule is enabled when using the `numpy` and `google` conventions, and
disabled when using the `pep257` convention.

## Example
```python
def calculate_speed(distance: float, time: float) -> float:
```