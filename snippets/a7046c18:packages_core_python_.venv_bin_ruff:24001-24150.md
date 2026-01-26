# a7046c18:packages_core_python_.venv_bin_ruff:24001-24150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:24001-24150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
#!/usr/bin/env python
```

## References
- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)
- [Git documentation: `git update-index --chmod`](https://git-scm.com/docs/git-update-index#Documentation/git-update-index.txt---chmod-x)
## What it does
Checks for executable `.py` files that do not have a shebang.

## Why is this bad?
In Python, a shebang (also known as a hashbang) is the first line of a
script, which specifies the interpreter that should be used to run the
script.

If a `.py` file is executable, but does not have a shebang, it may be run
with the wrong interpreter, or fail to run at all.

If the file is meant to be executable, add a shebang, as in:
```python
#!/usr/bin/env python
```

Otherwise, remove the executable bit from the file
(e.g., `chmod -x __main__.py` or `git update-index --chmod=-x __main__.py`).

A file is considered executable if it has the executable bit set (i.e., its
permissions mode intersects with `0o111`). As such, _this rule is only
available on Unix-like systems_, and is not enforced on Windows or WSL.

## References
- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)
- [Git documentation: `git update-index --chmod`](https://git-scm.com/docs/git-update-index#Documentation/git-update-index.txt---chmod-x)
## What it does
Checks for a shebang directive in `.py` files that does not contain `python`,
`pytest`, or `uv run`.

## Why is this bad?
In Python, a shebang (also known as a hashbang) is the first line of a
script, which specifies the command that should be used to run the
script.

For Python scripts, if the shebang does not include a command that explicitly
or implicitly specifies an interpreter, then the file will be executed with
the default interpreter, which is likely a mistake.

## Example
```python
#!/usr/bin/env bash
```

Use instead:
```python
#!/usr/bin/env python3
```

## References
- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)
## What it does
Checks for whitespace before a shebang directive.

## Why is this bad?
In Python, a shebang (also known as a hashbang) is the first line of a
script, which specifies the interpreter that should be used to run the
script.

The shebang's `#!` prefix must be the first two characters of a file. The
presence of whitespace before the shebang will cause the shebang to be
ignored, which is likely a mistake.

## Example
```python
 #!/usr/bin/env python3
```

Use instead:
```python
#!/usr/bin/env python3
```

## References
- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)
## What it does
Checks for a shebang directive that is not at the beginning of the file.

## Why is this bad?
In Python, a shebang (also known as a hashbang) is the first line of a
script, which specifies the interpreter that should be used to run the
script.

The shebang's `#!` prefix must be the first two characters of a file. If
the shebang is not at the beginning of the file, it will be ignored, which
is likely a mistake.

## Example
```python
foo = 1
#!/usr/bin/env python3
```

Use instead:
```python
#!/usr/bin/env python3
foo = 1
```

## References
- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)
## What it does
Checks for "FIXME" comments.

## Why is this bad?
"FIXME" comments are used to describe an issue that should be resolved
(usually, a bug or unexpected behavior).

Consider resolving the issue before deploying the code.

Note that if you use "FIXME" comments as a form of documentation, this
rule may not be appropriate for your project.

## Example
```python
def speed(distance, time):
    return distance / time  # FIXME: Raises ZeroDivisionError for time = 0.
```
## What it does
Checks for "TODO" comments.

## Why is this bad?
"TODO" comments are used to describe an issue that should be resolved
(usually, a missing feature, optimization, or refactoring opportunity).

Consider resolving the issue before deploying the code.

Note that if you use "TODO" comments as a form of documentation (e.g.,
to [provide context for future work](https://gist.github.com/dmnd/ed5d8ef8de2e4cfea174bd5dafcda382)),
this rule may not be appropriate for your project.

## Example
```python
def greet(name):
    return f"Hello, {name}!"  # TODO: Add support for custom greetings.
```
## What it does
Checks for "XXX" comments.

## Why is this bad?
"XXX" comments are used to describe an issue that should be resolved.

Consider resolving the issue before deploying the code, or, at minimum,
```