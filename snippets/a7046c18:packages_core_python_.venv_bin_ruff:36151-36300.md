# a7046c18:packages_core_python_.venv_bin_ruff:36151-36300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36151-36300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
blank line.

## Why is this bad?
Use a blank line to separate the docstring from the class definition, for
consistency.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is disabled when using the `google`,
`numpy`, and `pep257` conventions.

For an alternative, see [D211].

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

[D211]: https://docs.astral.sh/ruff/rules/blank-line-before-class
## What it does
Checks for class methods that are not separated from the class's docstring
by a blank line.

## Why is this bad?
[PEP 257] recommends the use of a blank line to separate a class's
docstring from its methods.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `numpy` and `pep257`
conventions, and disabled when using the `google` convention.

## Example
```python
class PhotoMetadata:
    """Metadata about a photo."""
    def __init__(self, file: Path):
        ...
```

Use instead:
```python
class PhotoMetadata:
    """Metadata about a photo."""

    def __init__(self, file: Path):
        ...
```

## Options
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for docstring summary lines that are not separated from the docstring
description by one blank line.

## Why is this bad?
[PEP 257] recommends that multi-line docstrings consist of "a summary line
just like a one-line docstring, followed by a blank line, followed by a
more elaborate description."

## Example
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.
    Sort the list in ascending order and return a copy of the
    result using the bubble sort algorithm.
    """
```

Use instead:
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the
    result using the bubble sort algorithm.
    """
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for docstrings that are indented with tabs.

## Why is this bad?
[PEP 8] recommends using spaces over tabs for indentation.

## Example
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.

	Sort the list in ascending order and return a copy of the result using the bubble
	sort algorithm.
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

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

The rule is also incompatible with the [formatter] when using
`format.indent-style="tab"`.

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 8]: https://peps.python.org/pep-0008/#tabs-or-spaces
```