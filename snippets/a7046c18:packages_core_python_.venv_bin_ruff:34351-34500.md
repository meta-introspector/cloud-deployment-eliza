# a7046c18:packages_core_python_.venv_bin_ruff:34351-34500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34351-34500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## References
- [Python documentation: Keywords](https://docs.python.org/3/reference/lexical_analysis.html#keywords)
## What it does
Checks for missing blank lines between methods of a class.

## Why is this bad?
PEP 8 recommends exactly one blank line between methods of a class.

## Example
```python
class MyClass(object):
    def func1():
        pass
    def func2():
        pass
```

Use instead:
```python
class MyClass(object):
    def func1():
        pass

    def func2():
        pass
```

## Typing stub files (`.pyi`)
The typing style guide recommends to not use blank lines between methods except to group
them. That's why this rule is not enabled in typing stub files.

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E301.html)
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)
## What it does
Checks for missing blank lines between top level functions and classes.

## Why is this bad?
PEP 8 recommends exactly two blank lines between top level functions and classes.

The rule respects the [`lint.isort.lines-after-imports`] setting when
determining the required number of blank lines between top-level `import`
statements and function or class definitions for compatibility with isort.

## Example
```python
def func1():
    pass
def func2():
    pass
```

Use instead:
```python
def func1():
    pass


def func2():
    pass
```

## Typing stub files (`.pyi`)
The typing style guide recommends to not use blank lines between classes and functions except to group
them. That's why this rule is not enabled in typing stub files.

## Options
- `lint.isort.lines-after-imports`

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E302.html)
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)
## What it does
Checks for extraneous blank lines.

## Why is this bad?
PEP 8 recommends using blank lines as follows:
- No more than two blank lines between top-level statements.
- No more than one blank line between non-top-level statements.

## Example
```python
def func1():
    pass



def func2():
    pass
```

Use instead:
```python
def func1():
    pass


def func2():
    pass
```

## Typing stub files (`.pyi`)
The rule allows at most one blank line in typing stub files in accordance to the typing style guide recommendation.

Note: The rule respects the following `isort` settings when determining the maximum number of blank lines allowed between two statements:

* [`lint.isort.lines-after-imports`]: For top-level statements directly following an import statement.
* [`lint.isort.lines-between-types`]: For `import` statements directly following a `from ... import ...` statement or vice versa.

## Options
- `lint.isort.lines-after-imports`
- `lint.isort.lines-between-types`

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E303.html)
- [Typing Style Guide](https://typing.python.org/en/latest/guides/writing_stubs.html#blank-lines)
## What it does
Checks for extraneous blank line(s) after function decorators.

## Why is this bad?
There should be no blank lines between a decorator and the object it is decorating.

## Example
```python
class User(object):

    @property

    def name(self):
        pass
```

Use instead:
```python
class User(object):

    @property
    def name(self):
        pass
```

## References
- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)
- [Flake 8 rule](https://www.flake8rules.com/rules/E304.html)
## What it does
Checks for missing blank lines after the end of function or class.
```