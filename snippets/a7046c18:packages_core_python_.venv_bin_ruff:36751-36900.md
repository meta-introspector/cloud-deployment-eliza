# a7046c18:packages_core_python_.venv_bin_ruff:36751-36900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36751-36900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    """Return the pathname of the KOS root directory."""
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent quotes, making the rule redundant.

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[formatter]: https://docs.astral.sh/ruff/formatter/
## What it does
Checks for docstrings that include backslashes, but are not defined as
raw string literals.

## Why is this bad?
In Python, backslashes are typically used to escape characters in strings.
In raw strings (those prefixed with an `r`), however, backslashes are
treated as literal characters.

[PEP 257](https://peps.python.org/pep-0257/#what-is-a-docstring) recommends
the use of raw strings (i.e., `r"""raw triple double quotes"""`) for
docstrings that include backslashes. The use of a raw string ensures that
any backslashes are treated as literal characters, and not as escape
sequences, which avoids confusion.

## Example
```python
def foobar():
    """Docstring for foo\bar."""


foobar.__doc__  # "Docstring for foar."
```

Use instead:
```python
def foobar():
    r"""Docstring for foo\bar."""


foobar.__doc__  # "Docstring for foo\bar."
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [Python documentation: String and Bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)
## What it does
Checks for docstrings in which the first line does not end in a period.

## Why is this bad?
[PEP 257] recommends that the first line of a docstring is written in the
form of a command, ending in a period.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `numpy` and
`pep257` conventions, and disabled when using the `google` convention.

## Example
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values"""
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Options
- `lint.pydocstyle.convention`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for docstring first lines that are not in an imperative mood.

## Why is this bad?
[PEP 257] recommends that the first line of a docstring be written in the
imperative mood, for consistency.

Hint: to rewrite the docstring in the imperative, phrase the first line as
if it were a command.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `numpy` and
`pep257` conventions, and disabled when using the `google` conventions.

## Example
```python
def average(values: list[float]) -> float:
    """Returns the mean of the given values."""
```

Use instead:
```python
def average(values: list[float]) -> float:
    """Return the mean of the given values."""
```

## Options
- `lint.pydocstyle.convention`
- `lint.pydocstyle.property-decorators`
- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)

[PEP 257]: https://peps.python.org/pep-0257/
## What it does
Checks for function docstrings that include the function's signature in
the summary line.

## Why is this bad?
[PEP 257] recommends against including a function's signature in its
docstring. Instead, consider using type annotations as a form of
documentation for the function's parameters and return value.

This rule may not apply to all projects; its applicability is a matter of
convention. By default, this rule is enabled when using the `google` and
`pep257` conventions, and disabled when using the `numpy` convention.

## Example
```python
def foo(a, b):
    """foo(a: int, b: int) -> list[int]"""
```

Use instead:
```python
def foo(a: int, b: int) -> list[int]:
    """Return a list of a and b."""
```

## Options
```