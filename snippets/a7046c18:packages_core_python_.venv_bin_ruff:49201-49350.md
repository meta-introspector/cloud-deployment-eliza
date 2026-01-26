# a7046c18:packages_core_python_.venv_bin_ruff:49201-49350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:49201-49350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

app = FastAPI("app")

@app.get("/home")
def home() -> str: ...
```

Here `app.get` will correctly be identified as `fastapi.FastAPI.get`.runtime-evaluated-decorators = ["pydantic.validate_call", "attrs.define"]runtime-evaluated-decoratorsWhether to add quotes around type annotations, if doing so would allow
the corresponding import to be moved into a type-checking block.

For example, in the following, Python requires that `Sequence` be
available at runtime, despite the fact that it's only used in a type
annotation:

```python
from collections.abc import Sequence


def func(value: Sequence[int]) -> None:
    ...
```

In other words, moving `from collections.abc import Sequence` into an
`if TYPE_CHECKING:` block above would cause a runtime error, as the
type would no longer be available at runtime.

By default, Ruff will respect such runtime semantics and avoid moving
the import to prevent such runtime errors.

Setting `quote-annotations` to `true` will instruct Ruff to add quotes
around the annotation (e.g., `"Sequence[int]"`), which in turn enables
Ruff to move the import into an `if TYPE_CHECKING:` block, like so:

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Sequence


def func(value: "Sequence[int]") -> None:
    ...
```

Note that this setting has no effect when `from __future__ import annotations`
is present, as `__future__` annotations are always treated equivalently
to quoted annotations. Similarly, this setting has no effect on Python
versions after 3.14 because these annotations are also deferred.# Add quotes around type annotations, if doing so would allow
# an import to be moved into a type-checking block.
quote-annotations = truequote-annotationsOptions for the `flake8-comprehensions` plugin.Allow `dict` calls that make use of keyword arguments (e.g., `dict(a=1, b=2)`).allow-dict-calls-with-keyword-arguments = trueallow-dict-calls-with-keyword-argumentsOptions for the `flake8-unused-arguments` pluginWhether to allow unused variadic arguments, like `*args` and `**kwargs`.ignore-variadic-names = trueignore-variadic-namesOptions for the `flake8-implicit-str-concat` pluginWhether to allow implicit string concatenations for multiline strings.
By default, implicit concatenations of multiline strings are
allowed (but continuation lines, delimited with a backslash, are
prohibited).

Setting `allow-multiline = false` will automatically disable the
`explicit-string-concatenation` (`ISC003`) rule. Otherwise, both
implicit and explicit multiline string concatenations would be seen
as violations, making it impossible to write a linter-compliant multiline
string.allow-multiline = falseallow-multilineOptions for the `flake8-import-conventions` pluginThe conventional aliases for imports. These aliases can be extended by
the [`extend-aliases`](#lint_flake8-import-conventions_extend-aliases) option.{"altair": "alt", "matplotlib": "mpl", "matplotlib.pyplot": "plt", "numpy": "np", "numpy.typing": "npt", "pandas": "pd", "seaborn": "sns", "tensorflow": "tf", "tkinter":  "tk", "holoviews": "hv", "panel": "pn", "plotly.express": "px", "polars": "pl", "pyarrow": "pa", "xml.etree.ElementTree": "ET"}dict[str, str]# Declare the default aliases.
altair = "alt"
"matplotlib.pyplot" = "plt"
numpy = "np"
pandas = "pd"
seaborn = "sns"
scipy = "sp"aliasesA mapping from module to conventional import alias. These aliases will
be added to the [`aliases`](#lint_flake8-import-conventions_aliases) mapping.# Declare a custom alias for the `dask` module.
"dask.dataframe" = "dd"extend-aliasesA mapping from module to its banned import aliases.dict[str, list[str]]# Declare the banned aliases.
"tensorflow.keras.backend" = ["K"]banned-aliasesA list of modules that should not be imported from using the
`from ... import ...` syntax.

For example, given `banned-from = ["pandas"]`, `from pandas import DataFrame`
would be disallowed, while `import pandas` would be allowed.# Declare the banned `from` imports.
banned-from = ["typing"]banned-from`section-order` is ignored when `no-sections` is set to `true``default-section` is ignored when `no-sections` is set to `true``sections` is ignored when `no-sections` is set to `true``lines-between-types` is ignored when `force-sort-within-sections` is set to `true``section-order` must contain `default-section`: `no-lines-before` contains unknown section: ``section-order` contains unknown section: ``section-order` contains duplicate section: `Flake8SelfOptionsPep8NamingOptionsPydocstyleOptionsPycodestyleOptionsFlake8BanditOptionsFlake8ErrMsgOptionsFlake8QuotesOptionsFlake8BugbearOptionsFlake8GetTextOptionsFlake8BuiltinsOptionsFlake8CopyrightOptionsFlake8AnnotationsOptionsFlake8BooleanTrapOptionsFlake8PytestStyleOptionsFlake8TidyImportsOptionsFlake8TypeCheckingOptionsFlake8ComprehensionsOptionsFlake8UnusedArgumentsOptionsFlake8ImplicitStrConcatOptionsFlake8ImportConventionsOptionspydoclintpreviewtyping-extensionsfuture-annotationsRuffOptionsparenthesize-tuple-in-subscriptstrictly-empty-init-modulesIsortOptionsforce-wrap-aliasesforce-single-linesingle-line-exclusionscombine-as-importssplit-on-trailing-commaorder-by-typeforce-sort-within-sectionscase-sensitiveforce-to-topknown-first-partyknown-third-partyknown-local-folderextra-standard-libraryrelative-imports-orderclassesconstantsvariablesno-lines-beforelines-after-importslines-between-typesforced-separatesection-orderdefault-sectionno-sectionsdetect-same-packagefrom-firstlength-sortlength-sort-straightFormatOptionsindent-stylequote-styleskip-magic-trailing-commaline-endingdocstring-code-formatdocstring-code-line-lengthMcCabeOptionsmax-complexityPylintOptionsallow-magic-value-typesallow-dunder-method-namesmax-branchesmax-returnsmax-positional-argsmax-localsmax-statementsmax-public-methodsmax-bool-exprmax-nested-blocksAnalyzeOptionsdirectiondetect-string-importsstring-imports-min-dotsinclude-dependenciestype-checking-importsPyflakesOptionsextend-genericsallowed-unused-imports0.14.11RUFF_PKG_VERSION is not a valid PEP 440 version specifierRequired version `` does not match the running version `Invalid alias for module '': alias normalizes to '__debug__', which is not allowed.struct Optionsstruct RuffOptionsstruct IsortOptionscache-diroutput-formatfixunsafe-fixesshow-fixesforce-excluderespect-gitignorenamespace-packagestarget-versionper-file-target-versionline-lengthindent-widthanalyzestruct FormatOptionsstruct McCabeOptionsstruct PylintOptionsstruct AnalyzeOptionsstruct LintOptionsWirestruct PyflakesOptionsstruct PyUpgradeOptionsstruct PydoclintOptionsstruct Flake8SelfOptionsfield index 0 <= i < 30struct Pep8NamingOptionsstruct PydocstyleOptionsstruct PycodestyleOptionsfield index 0 <= i < 11struct Flake8BanditOptionsstruct Flake8ErrMsgOptionsstruct Flake8QuotesOptionsstruct Flake8BugbearOptionsstruct Flake8GetTextOptionsfield index 0 <= i < 2struct Flake8BuiltinsOptionsstruct Flake8CopyrightOptionsfield index 0 <= i < 45field index 0 <= i < 4field index 0 <= i < 3struct Flake8AnnotationsOptionsfield index 0 <= i < 5struct Flake8BooleanTrapOptionsstruct Flake8PytestStyleOptionsstruct Flake8TidyImportsOptionsfield index 0 <= i < 6struct Flake8ComprehensionsOptionsstruct Flake8UnusedArgumentsOptionsfield index 0 <= i < 9struct Flake8ImplicitStrConcatOptionsstruct Flake8ImportConventionsOptionsan assignable Python identifiera Python identifiera sequence of Python identifiers delimited by periodsA path to the cache directory.

By default, Ruff stores cache results in a `.ruff_cache` directory in
the current project root.

However, Ruff will also respect the `RUFF_CACHE_DIR` environment
variable, which takes precedence over that default.

This setting will override even the `RUFF_CACHE_DIR` environment
variable, if set.".ruff_cache"cache-dir = "~/.cache/ruff"A path to a local `pyproject.toml` or `ruff.toml` file to merge into this
configuration. User home directory and environment variables will be
expanded.

To resolve the current configuration file, Ruff will first load
this base configuration file, then merge in properties defined
in the current configuration file. Most settings follow simple override
behavior where the child value replaces the parent value. However,
rule selection (`lint.select` and `lint.ignore`) has special merging
behavior: if the child configuration specifies `lint.select`, it
establishes a new baseline rule set and the parent's `lint.ignore`
rules are discarded; if the child configuration omits `lint.select`,
the parent's rule selection is inherited and both parent and child
`lint.ignore` rules are accumulated together.# Extend the `pyproject.toml` file in the parent directory.
extend = "../pyproject.toml"
# But use a different line length.
line-length = 100The style in which violation messages should be formatted: `"full"` (default)
(shows source), `"concise"`, `"grouped"` (group messages by file), `"json"`
(machine-readable), `"junit"` (machine-readable XML), `"github"` (GitHub
Actions annotations), `"gitlab"` (GitLab CI code quality report),
`"pylint"` (Pylint text format) or `"azure"` (Azure Pipeline logging commands)."full""full" | "concise" | "grouped" | "json" | "junit" | "github" | "gitlab" | "pylint" | "azure"# Group violations by containing file.
output-format = "grouped"Enable fix behavior by-default when running `ruff` (overridden
by the `--fix` and `--no-fix` command-line flags).
Only includes automatic fixes unless `--unsafe-fixes` is provided.fix = trueEnable application of unsafe fixes.
If excluded, a hint will be displayed when unsafe fixes are available.
If set to false, the hint will be hidden.unsafe-fixes = trueLike [`fix`](#fix), but disables reporting on leftover violation. Implies [`fix`](#fix).fix-only = trueWhether to show an enumeration of all fixed lint violations
(overridden by the `--show-fixes` command-line flag).# Enumerate all fixed violations.
show-fixes = trueEnforce a requirement on the version of Ruff, to enforce at runtime.
If the version of Ruff does not meet the requirement, Ruff will exit
with an error.

Useful for unifying results across many environments, e.g., with a
`pyproject.toml` file.

Accepts a [PEP 440](https://peps.python.org/pep-0440/) specifier, like `==0.3.1` or `>=0.3.1`.required-version = ">=0.0.193"Whether to enable preview mode. When preview mode is enabled, Ruff will
use unstable rules, fixes, and formatting.# Enable preview features.
preview = trueA list of file patterns to exclude from formatting and linting.

Exclusions are based on globs, and can be either:

- Single-path patterns, like `.mypy_cache` (to exclude any directory
  named `.mypy_cache` in the tree), `foo.py` (to exclude any file named
  `foo.py`), or `foo_*.py` (to exclude any file matching `foo_*.py` ).
- Relative patterns, like `directory/foo.py` (to exclude that specific
  file) or `directory/*.py` (to exclude any Python files in
  `directory`). Note that these paths are relative to the project root
  (e.g., the directory containing your `pyproject.toml`).

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).

Note that you'll typically want to use
[`extend-exclude`](#extend-exclude) to modify the excluded paths.[".bzr", ".direnv", ".eggs", ".git", ".git-rewrite", ".hg", ".mypy_cache", ".nox", ".pants.d", ".pytype", ".ruff_cache", ".svn", ".tox", ".venv", "__pypackages__", "_build", "buck-out", "dist", "node_modules", "venv"]exclude = [".venv"]A list of file patterns to omit from formatting and linting, in addition to those
specified by [`exclude`](#exclude).

Exclusions are based on globs, and can be either:

- Single-path patterns, like `.mypy_cache` (to exclude any directory
  named `.mypy_cache` in the tree), `foo.py` (to exclude any file named
  `foo.py`), or `foo_*.py` (to exclude any file matching `foo_*.py` ).
- Relative patterns, like `directory/foo.py` (to exclude that specific
  file) or `directory/*.py` (to exclude any Python files in
  `directory`). Note that these paths are relative to the project root
  (e.g., the directory containing your `pyproject.toml`).

For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).# In addition to the standard set of exclusions, omit all tests, plus a specific file.
extend-exclude = ["tests", "src/bad.py"]A list of file patterns to include when linting, in addition to those
specified by [`include`](#include).

```