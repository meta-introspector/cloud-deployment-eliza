# a7046c18:packages_core_python_.venv_bin_ruff:49501-49650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:49501-49650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
parentheses around the tuple (see `RUF031`).# Make it a violation to use a tuple in a subscript without parentheses.
parenthesize-tuple-in-subscript = trueThe `extend-markup-names` option has been moved to the `flake8-bandit` section of the configuration.The `allowed-markup-names` option has been moved to the `flake8-bandit` section of the configuration.Whether to require `__init__.py` files to contain no code at all, including imports and
docstrings (see `RUF067`).# Make it a violation to include any code, including imports and docstrings in `__init__.py`
strictly-empty-init-modules = trueOptions for the `isort` plugin.Force `import from` statements with multiple members and at least one
alias (e.g., `import A as B`) to wrap such that every line contains
exactly one member. For example, this formatting would be retained,
rather than condensing to a single line:

```python
from .utils import (
    test_directory as test_directory,
    test_id as test_id
)
```

Note that this setting is only effective when combined with
`combine-as-imports = true`. When [`combine-as-imports`](#lint_isort_combine-as-imports) isn't
enabled, every aliased `import from` will be given its own line, in
which case, wrapping is not necessary.

When using the formatter, ensure that [`format.skip-magic-trailing-comma`](#format_skip-magic-trailing-comma) is set to `false` (default)
when enabling `force-wrap-aliases` to avoid that the formatter collapses members if they all fit on a single line.force-wrap-aliases = true
combine-as-imports = trueForces all from imports to appear on their own line.force-single-line = trueOne or more modules to exclude from the single line rule.single-line-exclusions = ["os", "json"]Combines as imports on the same line. See isort's [`combine-as-imports`](https://pycqa.github.io/isort/docs/configuration/options.html#combine-as-imports)
option.combine-as-imports = trueIf a comma is placed after the last member in a multi-line import, then
the imports will never be folded into one line.

See isort's [`split-on-trailing-comma`](https://pycqa.github.io/isort/docs/configuration/options.html#split-on-trailing-comma) option.

When using the formatter, ensure that [`format.skip-magic-trailing-comma`](#format_skip-magic-trailing-comma) is set to `false` (default) when enabling `split-on-trailing-comma`
to avoid that the formatter removes the trailing commas.split-on-trailing-comma = falseOrder imports by type, which is determined by case, in addition to
alphabetically.

Note that this option takes precedence over the
[`case-sensitive`](#lint_isort_case-sensitive) setting when enabled.order-by-type = trueDon't sort straight-style imports (like `import sys`) before from-style
imports (like `from itertools import groupby`). Instead, sort the
imports by module, independent of import style.force-sort-within-sections = trueSort imports taking into account case sensitivity.

Note that the [`order-by-type`](#lint_isort_order-by-type) setting will
take precedence over this one when enabled.case-sensitive = trueForce specific imports to the top of their appropriate section.force-to-top = ["src"]A list of modules to consider first-party, regardless of whether they
can be identified as such via introspection of the local filesystem.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).known-first-party = ["src"]A list of modules to consider third-party, regardless of whether they
can be identified as such via introspection of the local filesystem.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).known-third-party = ["src"]A list of modules to consider being a local folder.
Generally, this is reserved for relative imports (`from . import module`).

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).known-local-folder = ["src"]A list of modules to consider standard-library, in addition to those
known to Ruff in advance.

Supports glob patterns. For more information on the glob syntax, refer
to the [`globset` documentation](https://docs.rs/globset/latest/globset/#syntax).extra-standard-library = ["path"]Whether to place "closer" imports (fewer `.` characters, most local)
before "further" imports (more `.` characters, least local), or vice
versa.

The default ("furthest-to-closest") is equivalent to isort's
[`reverse-relative`](https://pycqa.github.io/isort/docs/configuration/options.html#reverse-relative) default (`reverse-relative = false`); setting
this to "closest-to-furthest" is equivalent to isort's
`reverse-relative = true`."furthest-to-closest""furthest-to-closest" | "closest-to-furthest"relative-imports-order = "closest-to-furthest"Add the specified import line to all files.required-imports = ["from __future__ import annotations"]An override list of tokens to always recognize as a Class for
[`order-by-type`](#lint_isort_order-by-type) regardless of casing.classes = ["SVC"]An override list of tokens to always recognize as a CONSTANT
for [`order-by-type`](#lint_isort_order-by-type) regardless of casing.constants = ["constant"]An override list of tokens to always recognize as a var
for [`order-by-type`](#lint_isort_order-by-type) regardless of casing.variables = ["VAR"]A list of sections that should _not_ be delineated from the previous
section via empty lines.list["future" | "standard-library" | "third-party" | "first-party" | "local-folder" | str]no-lines-before = ["future", "standard-library"]The number of blank lines to place after imports.
Use `-1` for automatic determination.

Ruff uses at most one blank line after imports in typing stub files (files with `.pyi` extension) in accordance to
the typing style recommendations ([source](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)).

When using the formatter, only the values `-1`, `1`, and `2` are compatible because
it enforces at least one empty and at most two empty lines after imports.-1# Use a single line after each import block.
lines-after-imports = 1The number of lines to place between "direct" and `import from` imports.

When using the formatter, only the values `0` and `1` are compatible because
it preserves up to one empty line after imports in nested blocks.# Use a single line between direct and from import.
lines-between-types = 1A list of modules to separate into auxiliary block(s) of imports,
in the order specified.forced-separate = ["tests"]Override in which order the sections should be output. Can be used to move custom sections.["future", "standard-library", "third-party", "first-party", "local-folder"]section-order = ["future", "standard-library", "first-party", "local-folder", "third-party"]Define a default section for any imports that don't fit into the specified [`section-order`](#lint_isort_section-order)."third-party"default-section = "first-party"Put all imports into the same section bucket.

For example, rather than separating standard library and third-party imports, as in:
```python
import os
import sys

import numpy
import pandas
```

Setting `no-sections = true` will instead group all imports into a single section:
```python
import numpy
import os
import pandas
import sys
```no-sections = trueWhether to automatically mark imports from within the same package as first-party.
For example, when `detect-same-package = true`, then when analyzing files within the
`foo` package, any imports from within the `foo` package will be considered first-party.

This heuristic is often unnecessary when `src` is configured to detect all first-party
sources; however, if `src` is _not_ configured, this heuristic can be useful to detect
first-party imports from _within_ (but not _across_) first-party packages.detect-same-package = falseWhether to place `import from` imports before straight imports when sorting.

For example, by default, imports will be sorted such that straight imports appear
before `import from` imports, as in:
```python
import os
import sys
from typing import List
```

Setting `from-first = true` will instead sort such that `import from` imports appear
before straight imports, as in:
```python
from typing import List
import os
import sys
```from-first = trueSort imports by their string length, such that shorter imports appear
before longer imports. For example, by default, imports will be sorted
alphabetically, as in:
```python
import collections
import os
```

Setting `length-sort = true` will instead sort such that shorter imports
appear before longer imports, as in:
```python
import os
import collections
```length-sort = trueSort straight imports by their string length. Similar to [`length-sort`](#lint_isort_length-sort),
but applies only to straight imports and doesn't affect `from` imports.length-sort-straight = trueA list of mappings from section names to modules.

By default, imports are categorized according to their type (e.g., `future`, `third-party`,
and so on). This setting allows you to group modules into custom sections, to augment or
override the built-in sections.

For example, to group all testing utilities, you could create a `testing` section:
```toml
testing = ["pytest", "hypothesis"]
```

The values in the list are treated as glob patterns. For example, to match all packages in
the LangChain ecosystem (`langchain-core`, `langchain-openai`, etc.):
```toml
langchain = ["langchain-*"]
```

Custom sections should typically be inserted into the [`section-order`](#lint_isort_section-order) list to ensure that
they're displayed as a standalone group and in the intended order, as in:
```