# a7046c18:packages_core_python_.venv_bin_ruff:48901-49050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:48901-49050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

This is useful for ensuring proper type annotation inference for
projects that re-export `typing` and `typing_extensions` members
from a compatibility module. If omitted, any members imported from
modules apart from `typing` and `typing_extensions` will be treated
as ordinary Python objects.typing-modules = ["airflow.typing_compat"]A list of rule codes or prefixes to consider non-fixable.# Disable fix for unused imports (`F401`).
unfixable = ["F401"]A list of mappings from file pattern to rule codes or prefixes to
exclude, when considering any matching files. An initial '!' negates
the file pattern.{}dict[str, list[RuleSelector]]# Ignore `E402` (import violations) in all `__init__.py` files, and in `path/to/file.py`.
"__init__.py" = ["E402"]
"path/to/file.py" = ["E402"]
# Ignore `D` rules everywhere except for the `src/` directory.
"!src/**.py" = ["D"]A list of mappings from file pattern to rule codes or prefixes to
exclude, in addition to any rules excluded by [`per-file-ignores`](#lint_per-file-ignores).# Also ignore `E402` in all `__init__.py` files.
"__init__.py" = ["E402"]Options for the `pep8-naming` plugin.A list of names (or patterns) to ignore when considering `pep8-naming` violations.

Supports glob patterns. For example, to ignore all names starting with `test_`
or ending with `_test`, you could use `ignore-names = ["test_*", "*_test"]`.
For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).["setUp", "tearDown", "setUpClass", "tearDownClass", "setUpModule", "tearDownModule", "asyncSetUp", "asyncTearDown", "setUpTestData", "failureException", "longMessage", "maxDiff"]ignore-names = ["callMethod"]Additional names (or patterns) to ignore when considering `pep8-naming` violations,
in addition to those included in [`ignore-names`](#lint_pep8-naming_ignore-names).

Supports glob patterns. For example, to ignore all names starting with `test_`
or ending with `_test`, you could use `ignore-names = ["test_*", "*_test"]`.
For more information on the glob syntax, refer to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).extend-ignore-names = ["callMethod"]A list of decorators that, when applied to a method, indicate that the
method should be treated as a class method (in addition to the builtin
`@classmethod`).

For example, Ruff will expect that any method decorated by a decorator
in this list takes a `cls` argument as its first argument.

Expects to receive a list of fully-qualified names (e.g., `pydantic.validator`,
rather than `validator`) or alternatively a plain name which is then matched against
the last segment in case the decorator itself consists of a dotted name.classmethod-decorators = [
    # Allow Pydantic's `@validator` decorator to trigger class method treatment.
    "pydantic.validator",
    # Allow SQLAlchemy's dynamic decorators, like `@field.expression`, to trigger class method treatment.
    "declared_attr",
    "expression",
    "comparator",
]classmethod-decoratorsA list of decorators that, when applied to a method, indicate that the
method should be treated as a static method (in addition to the builtin
`@staticmethod`).

For example, Ruff will expect that any method decorated by a decorator
in this list has no `self` or `cls` argument.

Expects to receive a list of fully-qualified names (e.g., `belay.Device.teardown`,
rather than `teardown`) or alternatively a plain name which is then matched against
the last segment in case the decorator itself consists of a dotted name.# Allow Belay's `@Device.teardown` decorator to trigger static method treatment.
staticmethod-decorators = ["belay.Device.teardown"]staticmethod-decoratorsOptions for the `pydocstyle` plugin.Whether to use Google-style, NumPy-style conventions, or the [PEP 257](https://peps.python.org/pep-0257/)
defaults when analyzing docstring sections.

Enabling a convention will disable all rules that are not included in
the specified convention. As such, the intended workflow is to enable a
convention and then selectively enable or disable any additional rules
on top of it.

For example, to use Google-style conventions but avoid requiring
documentation for every function parameter:

```toml
[tool.ruff.lint]
# Enable all `pydocstyle` rules, limiting to those that adhere to the
# Google convention via `convention = "google"`, below.
select = ["D"]

# On top of the Google convention, disable `D417`, which requires
# documentation for every function parameter.
ignore = ["D417"]

[tool.ruff.lint.pydocstyle]
convention = "google"
```

To enable an additional rule that's excluded from the convention,
select the desired rule via its fully qualified rule code (e.g.,
`D400` instead of `D4` or `D40`):

```toml
[tool.ruff.lint]
# Enable D400 on top of the Google convention.
extend-select = ["D400"]

[tool.ruff.lint.pydocstyle]
convention = "google"
```"google" | "numpy" | "pep257"# Use Google-style docstrings.
convention = "google"conventionIgnore docstrings for functions or methods decorated with the
specified fully-qualified decorators.ignore-decorators = ["typing.overload"]ignore-decoratorsA list of decorators that, when applied to a method, indicate that the
method should be treated as a property (in addition to the builtin
`@property` and standard-library `@functools.cached_property`).

For example, Ruff will expect that any method decorated by a decorator
in this list can use a non-imperative summary line.property-decorators = ["gi.repository.GObject.Property"]property-decoratorsIf set to `true`, ignore missing documentation for `*args` and `**kwargs` parameters.ignore-var-parameters = trueignore-var-parametersOptions for the `pycodestyle` plugin.The maximum line length to allow for [`line-too-long`](https://docs.astral.sh/ruff/rules/line-too-long/) violations. By default,
this is set to the value of the [`line-length`](#line-length) option.

Use this option when you want to detect extra-long lines that the formatter can't automatically split by setting
`pycodestyle.line-length` to a value larger than [`line-length`](#line-length).

```toml
# The formatter wraps lines at a length of 88.
line-length = 88

[pycodestyle]
# E501 reports lines that exceed the length of 100.
max-line-length = 100
```

The length is determined by the number of characters per line, except for lines containing East Asian characters or emojis.
For these lines, the [unicode width](https://unicode.org/reports/tr11/) of each character is added up to determine the length.

See the [`line-too-long`](https://docs.astral.sh/ruff/rules/line-too-long/) rule for more information.max-line-length = 100max-line-lengthThe maximum line length to allow for [`doc-line-too-long`](https://docs.astral.sh/ruff/rules/doc-line-too-long/) violations within
documentation (`W505`), including standalone comments. By default,
this is set to `null` which disables reporting violations.

The length is determined by the number of characters per line, except for lines containing Asian characters or emojis.
For these lines, the [unicode width](https://unicode.org/reports/tr11/) of each character is added up to determine the length.

See the [`doc-line-too-long`](https://docs.astral.sh/ruff/rules/doc-line-too-long/) rule for more information.max-doc-length = 88max-doc-lengthWhether line-length violations (`E501`) should be triggered for
comments starting with [`task-tags`](#lint_task-tags) (by default: "TODO", "FIXME",
and "XXX").ignore-overlong-task-comments = trueignore-overlong-task-commentsOptions for the `flake8-bandit` plugin.A list of directories to consider temporary (see `S108`).hardcoded-tmp-directory = ["/foo/bar"]hardcoded-tmp-directoryA list of directories to consider temporary, in addition to those
specified by [`hardcoded-tmp-directory`](#lint_flake8-bandit_hardcoded-tmp-directory) (see `S108`).hardcoded-tmp-directory-extend = ["/foo/bar"]hardcoded-tmp-directory-extendWhether to disallow `try`-`except`-`pass` (`S110`) for specific
exception types. By default, `try`-`except`-`pass` is only
disallowed for `Exception` and `BaseException`.check-typed-exception = truecheck-typed-exceptionA list of additional callable names that behave like
[`markupsafe.Markup`](https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup).

Expects to receive a list of fully-qualified names (e.g., `webhelpers.html.literal`, rather than
`literal`).extend-markup-names = ["webhelpers.html.literal", "my_package.Markup"]extend-markup-namesA list of callable names, whose result may be safely passed into
[`markupsafe.Markup`](https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup).

Expects to receive a list of fully-qualified names (e.g., `bleach.clean`, rather than `clean`).

This setting helps you avoid false positives in code like:

```python
from bleach import clean
from markupsafe import Markup

cleaned_markup = Markup(clean(some_user_input))
```

Where the use of [`bleach.clean`](https://bleach.readthedocs.io/en/latest/clean.html)
usually ensures that there's no XSS vulnerability.

Although it is not recommended, you may also use this setting to whitelist other
kinds of calls, e.g. calls to i18n translation functions, where how safe that is
will depend on the implementation and how well the translations are audited.

Another common use-case is to wrap the output of functions that generate markup
like [`xml.etree.ElementTree.tostring`](https://docs.python.org/3/library/xml.etree.elementtree.html#xml.etree.ElementTree.tostring)
or template rendering engines where sanitization of potential user input is either
```