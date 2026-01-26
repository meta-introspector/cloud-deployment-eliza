# a7046c18:packages_core_python_.venv_bin_ruff:36301-36450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:36301-36450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for under-indented docstrings.

## Why is this bad?
[PEP 257] recommends that docstrings be indented to the same level as their
opening quotes. Avoid under-indenting docstrings, for consistency.

## Example
```python
def sort_list(l: list[int]) -> list[int]:
    """Return a sorted copy of the list.

Sort the list in ascending order and return a copy of the result using the bubble sort
algorithm.
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

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
[formatter]: https://docs.astral.sh/ruff/formatter/
## What it does
Checks for over-indented docstrings.

## Why is this bad?
[PEP 257] recommends that docstrings be indented to the same level as their
opening quotes. Avoid over-indenting docstrings, for consistency.

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
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the bubble
    sort algorithm.
    """
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

[PEP 257]: https://peps.python.org/pep-0257/
[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for multi-line docstrings whose closing quotes are not on their
own line.

## Why is this bad?
[PEP 257] recommends that the closing quotes of a multi-line docstring be
on their own line, for consistency and compatibility with documentation
tools that may need to parse the docstring.

## Example
```python
def sort_list(l: List[int]) -> List[int]:
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the
    bubble sort algorithm."""
```

Use instead:
```python
def sort_list(l: List[int]) -> List[int]:
    """Return a sorted copy of the list.

    Sort the list in ascending order and return a copy of the result using the bubble
    sort algorithm.
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
Checks for surrounding whitespace in docstrings.

## Why is this bad?
Remove surrounding whitespace from the docstring, for consistency.

## Example
```python
def factorial(n: int) -> int:
    """ Return the factorial of n. """
```

Use instead:
```python
def factorial(n: int) -> int:
    """Return the factorial of n."""
```

## Options

- `lint.pydocstyle.ignore-decorators`

## References
- [PEP 257 – Docstring Conventions](https://peps.python.org/pep-0257/)
- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)
- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
## What it does
```