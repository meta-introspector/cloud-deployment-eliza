# a7046c18:packages_core_python_.venv_bin_ruff:49651-49800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:49651-49800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```toml
section-order = [
  "future",
  "standard-library",
  "third-party",
  "first-party",
  "local-folder",
  "testing"
]
```

If a custom section is omitted from [`section-order`](#lint_isort_section-order), imports in that section will be
assigned to the [`default-section`](#lint_isort_default-section) (which defaults to `third-party`).# Group all Django imports into a separate section.
"django" = ["django"]Configures the way Ruff formats your code.A list of file patterns to exclude from formatting in addition to the files excluded globally (see [`exclude`](#exclude), and [`extend-exclude`](#extend-exclude)).

Exclusions are based on globs, and can be either:

- Single-path patterns, like `.mypy_cache` (to exclude any directory
  named `.mypy_cache` in the tree), `foo.py` (to exclude any file named
  `foo.py`), or `foo_*.py` (to exclude any file matching `foo_*.py` ).
- Relative patterns, like `directory/foo.py` (to exclude that specific
  file) or `directory/*.py` (to exclude any Python files in
  `directory`). Note that these paths are relative to the project root
  (e.g., the directory containing your `pyproject.toml`).

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).Whether to enable the unstable preview style formatting.# Enable preview style formatting.
preview = trueWhether to use spaces or tabs for indentation.

`indent-style = "space"` (default):

```python
def f():
    print("Hello") #  Spaces indent the `print` statement.
```

`indent-style = "tab"`:

```python
def f():
    print("Hello") #  A tab `\t` indents the `print` statement.
```

PEP 8 recommends using spaces for [indentation](https://peps.python.org/pep-0008/#indentation).
We care about accessibility; if you do not need tabs for accessibility, we do not recommend you use them.

See [`indent-width`](#indent-width) to configure the number of spaces per indentation and the tab width."space""space" | "tab"# Use tabs instead of 4 space indentation.
indent-style = "tab"Configures the preferred quote character for strings. The recommended options are

* `double` (default): Use double quotes `"`
* `single`: Use single quotes `'`

In compliance with [PEP 8](https://peps.python.org/pep-0008/) and [PEP 257](https://peps.python.org/pep-0257/),
Ruff prefers double quotes for triple quoted strings and docstrings even when using `quote-style = "single"`.

Ruff deviates from using the configured quotes if doing so prevents the need for
escaping quote characters inside the string:

```python
a = "a string without any quotes"
b = "It's monday morning"
```

Ruff will change the quotes of the string assigned to `a` to single quotes when using `quote-style = "single"`.
However, Ruff uses double quotes for the string assigned to `b` because using single quotes would require escaping the `'`,
which leads to the less readable code: `'It\'s monday morning'`.

In addition, Ruff supports the quote style `preserve` for projects that already use
a mixture of single and double quotes and can't migrate to the `double` or `single` style.
The quote style `preserve` leaves the quotes of all strings unchanged.# Prefer single quotes over double quotes.
quote-style = "single"Ruff uses existing trailing commas as an indication that short lines should be left separate.
If this option is set to `true`, the magic trailing comma is ignored.

For example, Ruff leaves the arguments separate even though
collapsing the arguments to a single line doesn't exceed the line length if `skip-magic-trailing-comma = false`:

```python
# The arguments remain on separate lines because of the trailing comma after `b`
def test(
    a,
    b,
): pass
```

Setting `skip-magic-trailing-comma = true` changes the formatting to:

```python
# The arguments are collapsed to a single line because the trailing comma is ignored
def test(a, b):
    pass
```The character Ruff uses at the end of a line.

* `auto`: The newline style is detected automatically on a file per file basis. Files with mixed line endings will be converted to the first detected line ending. Defaults to `\n` for files that contain no line endings.
* `lf`: Line endings will be converted to `\n`. The default line ending on Unix.
* `cr-lf`: Line endings will be converted to `\r\n`. The default line ending on Windows.
* `native`: Line endings will be converted to `\n` on Unix and `\r\n` on Windows."auto""auto" | "lf" | "cr-lf" | "native"# Use `\n` line endings for all files
line-ending = "lf"Whether to format code snippets in docstrings.

When this is enabled, Python code examples within docstrings are
automatically reformatted.

For example, when this is enabled, the following code:

```python
def f(x):
    """
    Something about `f`. And an example in doctest format:

    >>> f(  x  )

    Markdown is also supported:

    ```py
    f(  x  )
    ```

    As are reStructuredText literal blocks::

        f(  x  )


    And reStructuredText code blocks:

    .. code-block:: python

        f(  x  )
    """
    pass
```

... will be reformatted (assuming the rest of the options are set to
their defaults) as:

```python
def f(x):
    """
    Something about `f`. And an example in doctest format:

    >>> f(x)

    Markdown is also supported:

    ```py
    f(x)
    ```

    As are reStructuredText literal blocks::

        f(x)


```