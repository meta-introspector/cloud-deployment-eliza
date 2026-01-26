# a7046c18:packages_core_python_.venv_bin_ruff:49051-49200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:49051-49200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
already baked in or has to happen before rendering.allowed-markup-calls = ["bleach.clean", "my_package.sanitize"]allowed-markup-callsOptions for the `flake8-errmsg` plugin.Maximum string length for string literals in exception messages.max-string-length = 20max-string-lengthOptions for the `flake8-quotes` plugin.Quote style to prefer for inline strings (either "single" or
"double").

When using the formatter, ensure that [`format.quote-style`](#format_quote-style) is set to
the same preferred quote style."single" | "double"inline-quotes = "single"inline-quotesQuote style to prefer for multiline strings (either "single" or
"double").

When using the formatter, only "double" is compatible, as the formatter
enforces double quotes for multiline strings.multiline-quotes = "single"Quote style to prefer for docstrings (either "single" or "double").

When using the formatter, only "double" is compatible, as the formatter
enforces double quotes for docstrings strings.docstring-quotes = "single"Whether to avoid using single quotes if a string contains single quotes,
or vice-versa with double quotes, as per [PEP 8](https://peps.python.org/pep-0008/#string-quotes).
This minimizes the need to escape quotation marks within strings.# Don't bother trying to avoid escapes.
avoid-escape = falseavoid-escapeOptions for the `flake8-bugbear` plugin.Additional callable functions to consider "immutable" when evaluating, e.g., the
`function-call-in-default-argument` rule (`B008`) or `function-call-in-dataclass-defaults`
rule (`RUF009`).

Expects to receive a list of fully-qualified names (e.g., `fastapi.Query`, rather than
`Query`).# Allow default arguments like, e.g., `data: List[str] = fastapi.Query(None)`.
extend-immutable-calls = ["fastapi.Depends", "fastapi.Query"]extend-immutable-callsOptions for the `flake8-gettext` plugin.The function names to consider as internationalization calls.["_", "gettext", "ngettext"]function-names = ["_", "gettext", "ngettext", "ugettetxt"]function-namesAdditional function names to consider as internationalization calls, in addition to those
included in [`function-names`](#lint_flake8-gettext_function-names).extend-function-names = ["ugettetxt"]extend-function-namesOptions for the `flake8-builtins` plugin.DEPRECATED: This option has been renamed to `ignorelist`. Use `ignorelist` instead.

Ignore list of builtins.

This option is ignored if both `ignorelist` and `builtins-ignorelist` are set.builtins-ignorelist = ["id"]0.10.0`builtins-ignorelist` has been renamed to `ignorelist`. Use that instead.builtins-ignorelistIgnore list of builtins.ignorelist = ["id"]ignorelistDEPRECATED: This option has been renamed to `allowed-modules`. Use `allowed-modules` instead.

List of builtin module names to allow.

This option is ignored if both `allowed-modules` and `builtins-allowed-modules` are set.builtins-allowed-modules = ["secrets"]`builtins-allowed-modules` has been renamed to `allowed-modules`. Use that instead.builtins-allowed-modulesList of builtin module names to allow.allowed-modules = ["secrets"]allowed-modulesDEPRECATED: This option has been renamed to `strict-checking`. Use `strict-checking` instead.

Compare module names instead of full module paths.

This option is ignored if both `strict-checking` and `builtins-strict-checking` are set.builtins-strict-checking = true`builtins-strict-checking` has been renamed to `strict-checking`. Use that instead.builtins-strict-checkingCompare module names instead of full module paths.

Used by [`A005` - `stdlib-module-shadowing`](https://docs.astral.sh/ruff/rules/stdlib-module-shadowing/).strict-checking = truestrict-checkingOptions for the `flake8-copyright` plugin.The regular expression used to match the copyright notice, compiled
with the [`regex`](https://docs.rs/regex/latest/regex/) crate.
Defaults to `(?i)Copyright\s+((?:\(C\)|©)\s+)?\d{4}((-|,\s)\d{4})*`, which matches
the following:

- `Copyright 2023`
- `Copyright (C) 2023`
- `Copyright 2021-2023`
- `Copyright (C) 2021-2023`
- `Copyright (C) 2021, 2023`"(?i)Copyright\s+((?:\(C\)|©)\s+)?\d{4}((-|,\s)\d{4})*"notice-rgx = "(?i)Copyright \\(C\\) \\d{4}"notice-rgxAuthor to enforce within the copyright notice. If provided, the
author must be present immediately following the copyright notice.author = "Ruff"authorA minimum file size (in bytes) required for a copyright notice to
be enforced. By default, all files are validated.# Avoid enforcing a header on files smaller than 1024 bytes.
min-file-size = 1024min-file-sizeOptions for the `flake8-annotations` plugin.Whether to allow the omission of a return type hint for `__init__` if at
least one argument is annotated.mypy-init-return = trueWhether to suppress `ANN000`-level violations for arguments matching the
"dummy" variable regex (like `_`).suppress-dummy-args = truesuppress-dummy-argsWhether to suppress `ANN200`-level violations for functions that meet
either of the following criteria:

- Contain no `return` statement.
- Explicit `return` statement(s) all return `None` (explicitly or
  implicitly).suppress-none-returning = truesuppress-none-returningWhether to suppress `ANN401` for dynamically typed `*args` and
`**kwargs` arguments.allow-star-arg-any = trueallow-star-arg-anyWhether to suppress `ANN*` rules for any declaration
that hasn't been typed at all.
This makes it easier to gradually add types to a codebase.ignore-fully-untyped = trueignore-fully-untypedOptions for the `flake8-boolean-trap` pluginAdditional callable functions with which to allow boolean traps.

Expects to receive a list of fully-qualified names (e.g., `pydantic.Field`, rather than
`Field`).extend-allowed-calls = ["pydantic.Field", "django.db.models.Value"]extend-allowed-callsOptions for the `flake8-pytest-style` pluginBoolean flag specifying whether `@pytest.fixture()` without parameters
should have parentheses. If the option is set to `false` (the default),
`@pytest.fixture` is valid and `@pytest.fixture()` is invalid. If set
to `true`, `@pytest.fixture()` is valid and `@pytest.fixture` is
invalid.fixture-parentheses = truefixture-parenthesesExpected type for multiple argument names in `@pytest.mark.parametrize`.
The following values are supported:

- `csv` — a comma-separated list, e.g.
  `@pytest.mark.parametrize("name1,name2", ...)`
- `tuple` (default) — e.g.
  `@pytest.mark.parametrize(("name1", "name2"), ...)`
- `list` — e.g. `@pytest.mark.parametrize(["name1", "name2"], ...)`"csv" | "tuple" | "list"parametrize-names-type = "list"parametrize-names-typeExpected type for the list of values rows in `@pytest.mark.parametrize`.
The following values are supported:

- `tuple` — e.g. `@pytest.mark.parametrize("name", (1, 2, 3))`
- `list` (default) — e.g. `@pytest.mark.parametrize("name", [1, 2, 3])`parametrize-values-type = "tuple"parametrize-values-typeExpected type for each row of values in `@pytest.mark.parametrize` in
case of multiple parameters. The following values are supported:

- `tuple` (default) — e.g.
  `@pytest.mark.parametrize(("name1", "name2"), [(1, 2), (3, 4)])`
- `list` — e.g.
  `@pytest.mark.parametrize(("name1", "name2"), [[1, 2], [3, 4]])`parametrize-values-row-type = "list"parametrize-values-row-typeList of exception names that require a match= parameter in a
`pytest.raises()` call.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).["BaseException", "Exception", "ValueError", "OSError", "IOError", "EnvironmentError", "socket.error"]raises-require-match-for = ["requests.RequestException"]raises-require-match-forList of additional exception names that require a match= parameter in a
`pytest.raises()` call. This extends the default list of exceptions
that require a match= parameter.
This option is useful if you want to extend the default list of
exceptions that require a match= parameter without having to specify
the entire list.
Note that this option does not remove any exceptions from the default
list.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).raises-extend-require-match-for = ["requests.RequestException"]raises-extend-require-match-forBoolean flag specifying whether `@pytest.mark.foo()` without parameters
should have parentheses. If the option is set to `false` (the
default), `@pytest.mark.foo` is valid and `@pytest.mark.foo()` is
invalid. If set to `true`, `@pytest.mark.foo()` is valid and
`@pytest.mark.foo` is invalid.mark-parentheses = trueList of warning names that require a match= parameter in a
`pytest.warns()` call.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).["Warning", "UserWarning", "DeprecationWarning"]warns-require-match-for = ["requests.RequestsWarning"]warns-require-match-forList of additional warning names that require a match= parameter in a
`pytest.warns()` call. This extends the default list of warnings that
require a match= parameter.

This option is useful if you want to extend the default list of warnings
that require a match= parameter without having to specify the entire
list.

Note that this option does not remove any warnings from the default
list.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).warns-extend-require-match-for = ["requests.RequestsWarning"]warns-extend-require-match-forOptions for the `flake8-tidy-imports` pluginWhether to ban all relative imports (`"all"`), or only those imports
that extend into the parent module or beyond (`"parents"`)."parents""parents" | "all"# Disallow all relative imports.
ban-relative-imports = "all"ban-relative-importsSpecific modules or module members that may not be imported or accessed.
Note that this rule is only meant to flag accidental uses,
and can be circumvented via `eval` or `importlib`.dict[str, { "msg": str }]"cgi".msg = "The cgi module is deprecated, see https://peps.python.org/pep-0594/#cgi."
"typing.TypedDict".msg = "Use typing_extensions.TypedDict instead."banned-apiList of specific modules that may not be imported at module level, and should instead be
imported lazily (e.g., within a function definition, or an `if TYPE_CHECKING:`
block, or some other nested context). This also affects the rule `import-outside-top-level`
if `banned-module-level-imports` is enabled.# Ban certain modules from being imported at module level, instead requiring
# that they're imported lazily (e.g., within a function definition).
banned-module-level-imports = ["torch", "tensorflow"]banned-module-level-importsOptions for the `flake8-type-checking` pluginEnforce `TC001`, `TC002`, and `TC003` rules even when valid runtime imports
are present for the same module.

See flake8-type-checking's [strict](https://github.com/snok/flake8-type-checking#strict) option.strict = trueExempt certain modules from needing to be moved into type-checking
blocks.["typing"]exempt-modules = ["typing", "typing_extensions"]exempt-modulesExempt classes that list any of the enumerated classes as a base class
from needing to be moved into type-checking blocks.

Common examples include Pydantic's `pydantic.BaseModel` and SQLAlchemy's
`sqlalchemy.orm.DeclarativeBase`, but can also support user-defined
classes that inherit from those base classes. For example, if you define
a common `DeclarativeBase` subclass that's used throughout your project
(e.g., `class Base(DeclarativeBase) ...` in `base.py`), you can add it to
this list (`runtime-evaluated-base-classes = ["base.Base"]`) to exempt
models from being moved into type-checking blocks.runtime-evaluated-base-classes = ["pydantic.BaseModel", "sqlalchemy.orm.DeclarativeBase"]runtime-evaluated-base-classesExempt classes and functions decorated with any of the enumerated
decorators from being moved into type-checking blocks.

Common examples include Pydantic's `@pydantic.validate_call` decorator
(for functions) and attrs' `@attrs.define` decorator (for classes).

This also supports framework decorators like FastAPI's `fastapi.FastAPI.get`
which will work across assignments in the same module.

For example:
```python
import fastapi
```