# a7046c18:packages_core_python_.venv_bin_ruff:38851-39000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:38851-39000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Why is this bad?
Non-empty tuples are always `True`, so an `if` statement with a non-empty
tuple as its test condition will always pass. This is likely a mistake.

## Example
```python
if (False,):
    print("This will always run")
```

Use instead:
```python
if False:
    print("This will never run")
```

## References
- [Python documentation: The `if` statement](https://docs.python.org/3/reference/compound_stmts.html#the-if-statement)
## What it does
Checks for `break` statements outside of loops.

## Why is this bad?
The use of a `break` statement outside of a `for` or `while` loop will
raise a `SyntaxError`.

## Example
```python
def foo():
    break
```

## References
- [Python documentation: `break`](https://docs.python.org/3/reference/simple_stmts.html#the-break-statement)
## What it does
Checks for `continue` statements outside of loops.

## Why is this bad?
The use of a `continue` statement outside of a `for` or `while` loop will
raise a `SyntaxError`.

## Example
```python
def foo():
    continue  # SyntaxError
```

## References
- [Python documentation: `continue`](https://docs.python.org/3/reference/simple_stmts.html#the-continue-statement)
## What it does
Checks for `yield`, `yield from`, and `await` usages outside of functions.

## Why is this bad?
The use of `yield`, `yield from`, or `await` outside of a function will
raise a `SyntaxError`.

## Example
```python
class Foo:
    yield 1
```

## Notebook behavior
As an exception, `await` is allowed at the top level of a Jupyter notebook
(see: [autoawait]).

## References
- [Python documentation: `yield`](https://docs.python.org/3/reference/simple_stmts.html#the-yield-statement)

[autoawait]: https://ipython.readthedocs.io/en/stable/interactive/autoawait.html
## What it does
Checks for `return` statements outside of functions.

## Why is this bad?
The use of a `return` statement outside of a function will raise a
`SyntaxError`.

## Example
```python
class Foo:
    return 1
```

## References
- [Python documentation: `return`](https://docs.python.org/3/reference/simple_stmts.html#the-return-statement)
## What it does
Checks for `except` blocks that handle all exceptions, but are not the last
`except` block in a `try` statement.

## Why is this bad?
When an exception is raised within a `try` block, the `except` blocks are
evaluated in order, and the first matching block is executed. If an `except`
block handles all exceptions, but isn't the last block, Python will raise a
`SyntaxError`, as the following blocks would never be executed.

## Example
```python
def reciprocal(n):
    try:
        reciprocal = 1 / n
    except:
        print("An exception occurred.")
    except ZeroDivisionError:
        print("Cannot divide by zero.")
    else:
        return reciprocal
```

Use instead:
```python
def reciprocal(n):
    try:
        reciprocal = 1 / n
    except ZeroDivisionError:
        print("Cannot divide by zero.")
    except:
        print("An exception occurred.")
    else:
        return reciprocal
```

## References
- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)
## What it does
Checks for forward annotations that include invalid syntax.


## Why is this bad?
In Python, type annotations can be quoted as strings literals to enable
references to types that have not yet been defined, known as "forward
references".

However, these quoted annotations must be valid Python expressions. The use
of invalid syntax in a quoted annotation won't raise a `SyntaxError`, but
will instead raise an error when type checking is performed.

## Example

```python
def foo() -> "/": ...
```

## References
- [PEP 563 – Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)
## What it does
Checks for variable definitions that redefine (or "shadow") unused
variables.

## Why is this bad?
Redefinitions of unused names are unnecessary and often indicative of a
mistake.
```