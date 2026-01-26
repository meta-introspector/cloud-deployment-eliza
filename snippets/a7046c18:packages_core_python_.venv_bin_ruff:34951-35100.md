# a7046c18:packages_core_python_.venv_bin_ruff:34951-35100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34951-35100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
f = lambda x: 2 * x
```

Use instead:
```python
def f(x):
    return 2 * x
```

[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations
## What it does
Checks for the use of the characters 'l', 'O', or 'I' as variable names.

Note: This rule is automatically disabled for all stub files
(files with `.pyi` extensions). The rule has little relevance for authors
of stubs: a well-written stub should aim to faithfully represent the
interface of the equivalent .py file as it exists at runtime, including any
ambiguously named variables in the runtime module.

## Why is this bad?
In some fonts, these characters are indistinguishable from the
numerals one and zero. When tempted to use 'l', use 'L' instead.

## Example
```python
l = 0
O = 123
I = 42
```

Use instead:
```python
L = 0
o = 123
i = 42
```
## What it does
Checks for the use of the characters 'l', 'O', or 'I' as class names.

## Why is this bad?
In some fonts, these characters are indistinguishable from the
numerals one and zero. When tempted to use 'l', use 'L' instead.

## Example

```python
class I(object): ...
```

Use instead:

```python
class Integer(object): ...
```
## What it does
Checks for the use of the characters 'l', 'O', or 'I' as function names.

## Why is this bad?
In some fonts, these characters are indistinguishable from the
numerals one and zero. When tempted to use 'l', use 'L' instead.

## Example

```python
def l(x): ...
```

Use instead:

```python
def long_name(x): ...
```
## What it does
This is not a regular diagnostic; instead, it's raised when a file cannot be read
from disk.

## Why is this bad?
An `IOError` indicates an error in the development setup. For example, the user may
not have permissions to read a given file, or the filesystem may contain a broken
symlink.

## Example
On Linux or macOS:
```shell
$ echo 'print("hello world!")' > a.py
$ chmod 000 a.py
$ ruff a.py
a.py:1:1: E902 Permission denied (os error 13)
Found 1 error.
```

## References
- [UNIX Permissions introduction](https://mason.gmu.edu/~montecin/UNIXpermiss.htm)
- [Command Line Basics: Symbolic Links](https://www.digitalocean.com/community/tutorials/workflow-symbolic-links)
## Removed
This rule has been removed. Syntax errors will
always be shown regardless of whether this rule is selected or not.

## What it does
Checks for code that contains syntax errors.

## Why is this bad?
Code with syntax errors cannot be executed. Such errors are likely a
mistake.

## Example
```python
x =
```

Use instead:
```python
x = 1
```

## References
- [Python documentation: Syntax Errors](https://docs.python.org/3/tutorial/errors.html#syntax-errors)
## What it does
Checks for indentation that uses tabs.

## Why is this bad?
According to [PEP 8], spaces are preferred over tabs (unless used to remain
consistent with code that is already indented with tabs).

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent indentation, making the rule redundant.

The rule is also incompatible with the [formatter] when using
`format.indent-style="tab"`.

[PEP 8]: https://peps.python.org/pep-0008/#tabs-or-spaces
[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for superfluous trailing whitespace.

## Why is this bad?
According to [PEP 8], "avoid trailing whitespace anywhere. Because it’s usually
invisible, it can be confusing"

## Example
```python
spam(1) \n#
```

Use instead:
```python
```