# a7046c18:packages_core_python_.venv_bin_ruff:49351-49500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:49351-49500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Inclusion are based on globs, and should be single-path patterns, like
`*.pyw`, to include any file with the `.pyw` extension.

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).# In addition to the standard set of inclusions, include `.pyw` files.
extend-include = ["*.pyw"]Whether to enforce [`exclude`](#exclude) and [`extend-exclude`](#extend-exclude) patterns,
even for paths that are passed to Ruff explicitly. Typically, Ruff will lint
any paths passed in directly, even if they would typically be
excluded. Setting `force-exclude = true` will cause Ruff to
respect these exclusions unequivocally.

This is useful for [`pre-commit`](https://pre-commit.com/), which explicitly passes all
changed files to the [`ruff-pre-commit`](https://github.com/astral-sh/ruff-pre-commit)
plugin, regardless of whether they're marked as excluded by Ruff's own
settings.force-exclude = trueA list of file patterns to include when linting.

Inclusion are based on globs, and should be single-path patterns, like
`*.pyw`, to include any file with the `.pyw` extension. `pyproject.toml` is
included here not for configuration but because we lint whether e.g. the
`[project]` matches the schema.

Notebook files (`.ipynb` extension) are included by default on Ruff 0.6.0+.

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).["*.py", "*.pyi", "*.pyw", "*.ipynb", "**/pyproject.toml"]include = ["*.py"]Whether to automatically exclude files that are ignored by `.ignore`,
`.gitignore`, `.git/info/exclude`, and global `gitignore` files.
Enabled by default.respect-gitignore = falseA list of builtins to treat as defined references, in addition to the
system builtins.Mark the specified directories as namespace packages. For the purpose of
module resolution, Ruff will treat those directories and all their subdirectories
as if they contained an `__init__.py` file.namespace-packages = ["airflow/providers"]The minimum Python version to target, e.g., when considering automatic
code upgrades, like rewriting type annotations. Ruff will not propose
changes using features that are not available in the given version.

For example, to represent supporting Python >=3.11 or ==3.11
specify `target-version = "py311"`.

If you're already using a `pyproject.toml` file, we recommend
`project.requires-python` instead, as it's based on Python packaging
standards, and will be respected by other tools. For example, Ruff
treats the following as identical to `target-version = "py38"`:

```toml
[project]
requires-python = ">=3.8"
```

If both are specified, `target-version` takes precedence over
`requires-python`. See [_Inferring the Python version_](https://docs.astral.sh/ruff/configuration/#inferring-the-python-version)
for a complete description of how the `target-version` is determined
when left unspecified.

Note that a stub file can [sometimes make use of a typing feature](https://typing.python.org/en/latest/spec/distributing.html#syntax)
before it is available at runtime, as long as the stub does not make
use of new *syntax*. For example, a type checker will understand
`int | str` in a stub as being a `Union` type annotation, even if the
type checker is run using Python 3.9, despite the fact that the `|`
operator can only be used to create union types at runtime on Python
3.10+. As such, Ruff will often recommend newer features in a stub
file than it would for an equivalent runtime file with the same target
version."py310""py37" | "py38" | "py39" | "py310" | "py311" | "py312" | "py313" | "py314"# Always generate Python 3.7-compatible code.
target-version = "py37"A list of mappings from glob-style file pattern to Python version to use when checking the
corresponding file(s).

This may be useful for overriding the global Python version settings in `target-version` or
`requires-python` for a subset of files. For example, if you have a project with a minimum
supported Python version of 3.9 but a subdirectory of developer scripts that want to use a
newer feature like the `match` statement from Python 3.10, you can use
`per-file-target-version` to specify `"developer_scripts/*.py" = "py310"`.

This setting is used by the linter to enforce any enabled version-specific lint rules, as
well as by the formatter for any version-specific formatting options, such as parenthesizing
context managers on Python 3.10+.dict[str, PythonVersion]# Override the project-wide Python version for a developer scripts directory:
"scripts/*.py" = "py312"The directories to consider when resolving first- vs. third-party
imports.

When omitted, the `src` directory will typically default to including both:

1. The directory containing the nearest `pyproject.toml`, `ruff.toml`, or `.ruff.toml` file (the "project root").
2. The `"src"` subdirectory of the project root.

These defaults ensure that Ruff supports both flat layouts and `src` layouts out-of-the-box.
(If a configuration file is explicitly provided (e.g., via the `--config` command-line
flag), the current working directory will be considered the project root.)

As an example, consider an alternative project structure, like:

```text
my_project
├── pyproject.toml
└── lib
    └── my_package
        ├── __init__.py
        ├── foo.py
        └── bar.py
```

In this case, the `./lib` directory should be included in the `src` option
(e.g., `src = ["lib"]`), such that when resolving imports, `my_package.foo`
is considered first-party.

This field supports globs. For example, if you have a series of Python
packages in a `python_modules` directory, `src = ["python_modules/*"]`
would expand to incorporate all packages in that directory. User home
directory and environment variables will also be expanded.[".", "src"]# Allow imports relative to the "src" and "test" directories.
src = ["src", "test"]The line length to use when enforcing long-lines violations (like `E501`)
and at which `isort` and the formatter prefers to wrap lines.

The length is determined by the number of characters per line, except for lines containing East Asian characters or emojis.
For these lines, the [unicode width](https://unicode.org/reports/tr11/) of each character is added up to determine the length.

The value must be greater than `0` and less than or equal to `320`.

Note: While the formatter will attempt to format lines such that they remain
within the `line-length`, it isn't a hard upper bound, and formatted lines may
exceed the `line-length`.

See [`pycodestyle.max-line-length`](#lint_pycodestyle_max-line-length) to configure different lengths for `E501` and the formatter.88# Allow lines to be as long as 120.
line-length = 120The number of spaces per indentation level (tab).

Used by the formatter and when enforcing long-line violations (like `E501`) to determine the visual
width of a tab.

This option changes the number of spaces the formatter inserts when
using soft-tabs (`indent-style = space`).

PEP 8 recommends using 4 spaces per [indentation level](https://peps.python.org/pep-0008/#indentation).Configures how Ruff checks your code.

Options specified in the `lint` section take precedence over the deprecated top-level settings.A list of file patterns to exclude from linting in addition to the files excluded globally (see [`exclude`](#exclude), and [`extend-exclude`](#extend-exclude)).

Exclusions are based on globs, and can be either:

- Single-path patterns, like `.mypy_cache` (to exclude any directory
  named `.mypy_cache` in the tree), `foo.py` (to exclude any file named
  `foo.py`), or `foo_*.py` (to exclude any file matching `foo_*.py` ).
- Relative patterns, like `directory/foo.py` (to exclude that specific
  file) or `directory/*.py` (to exclude any Python files in
  `directory`). Note that these paths are relative to the project root
  (e.g., the directory containing your `pyproject.toml`).

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).exclude = ["generated"]Whether to enable preview mode. When preview mode is enabled, Ruff will
use unstable rules and fixes.Whether to allow imports from the third-party `typing_extensions` module for Python versions
before a symbol was added to the first-party `typing` module.

Many rules try to import symbols from the `typing` module but fall back to
`typing_extensions` for earlier versions of Python. This option can be used to disable this
fallback behavior in cases where `typing_extensions` is not installed.# Disable `typing_extensions` imports
typing-extensions = falseWhether to allow rules to add `from __future__ import annotations` in cases where this would
simplify a fix or enable a new diagnostic.

For example, `TC001`, `TC002`, and `TC003` can move more imports into `TYPE_CHECKING` blocks
if `__future__` annotations are enabled.# Enable `from __future__ import annotations` imports
future-annotations = trueOptions for the `ruff` pluginWhether to prefer accessing items keyed by tuples with
```