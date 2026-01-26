# a7046c18:packages_core_python_.venv_bin_ruff:34501-34650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34501-34650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Why is this bad?
PEP 8 recommends using blank lines as follows:
- Two blank lines are expected between functions and classes
- One blank line is expected between methods of a class.

## Example
```python
class User(object):
    pass
user = User()
```

Use instead:
```python
class User(object):
    pass


user = User()
```

## Typing stub files (`.pyi`)
The typing style guide recommends to not use blank lines between statements except to group
them. That's why this rule is not enabled in typing stub files.

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E305.html)
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)
## What it does
Checks for 1 blank line between nested function or class definitions.

## Why is this bad?
PEP 8 recommends using blank lines as follows:
- Two blank lines are expected between functions and classes
- One blank line is expected between methods of a class.

## Example
```python
def outer():
    def inner():
        pass
    def inner2():
        pass
```

Use instead:
```python
def outer():
    def inner():
        pass

    def inner2():
        pass
```

## Typing stub files (`.pyi`)
The typing style guide recommends to not use blank lines between classes and functions except to group
them. That's why this rule is not enabled in typing stub files.

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E306.html)
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)
## What it does
Check for multiple imports on one line.

## Why is this bad?
According to [PEP 8], "imports should usually be on separate lines."

## Example
```python
import sys, os
```

Use instead:
```python
import os
import sys
```

[PEP 8]: https://peps.python.org/pep-0008/#imports
## What it does
Checks for imports that are not at the top of the file.

## Why is this bad?
According to [PEP 8], "imports are always put at the top of the file, just after any
module comments and docstrings, and before module globals and constants."

This rule makes an exception for both `sys.path` modifications (allowing for
`sys.path.insert`, `sys.path.append`, etc.) and `os.environ` modifications
between imports.

## Example
```python
"One string"
"Two string"
a = 1
import os
from sys import x
```

Use instead:
```python
import os
from sys import x

"One string"
"Two string"
a = 1
```

## Notebook behavior
For Jupyter notebooks, this rule checks for imports that are not at the top of a *cell*.

[PEP 8]: https://peps.python.org/pep-0008/#imports
## What it does
Checks for lines that exceed the specified maximum character length.

## Why is this bad?
Overlong lines can hurt readability. [PEP 8], for example, recommends
limiting lines to 79 characters. By default, this rule enforces a limit
of 88 characters for compatibility with Black and the Ruff formatter,
though that limit is configurable via the [`line-length`] setting.

In the interest of pragmatism, this rule makes a few exceptions when
determining whether a line is overlong. Namely, it:

1. Ignores lines that consist of a single "word" (i.e., without any
   whitespace between its characters).
2. Ignores lines that end with a URL, as long as the URL starts before
   the line-length threshold.
3. Ignores line that end with a pragma comment (e.g., `# type: ignore`
   or `# noqa`), as long as the pragma comment starts before the
   line-length threshold. That is, a line will not be flagged as
   overlong if a pragma comment _causes_ it to exceed the line length.
   (This behavior aligns with that of the Ruff formatter.)
4. Ignores SPDX license identifiers and copyright notices
   (e.g., `# SPDX-License-Identifier: MIT`), which are machine-readable
   and should _not_ wrap over multiple lines.

If [`lint.pycodestyle.ignore-overlong-task-comments`] is `true`, this rule will
also ignore comments that start with any of the specified [`lint.task-tags`]
(e.g., `# TODO:`).

## Example
```python
my_function(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
```
```