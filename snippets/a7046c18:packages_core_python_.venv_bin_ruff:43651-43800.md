# a7046c18:packages_core_python_.venv_bin_ruff:43651-43800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:43651-43800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Example
```python
a, b, c = [foo(x) for x in items]
```

Use instead:
```python
a, b, c = (foo(x) for x in items)
```

## References
- [Python documentation: Generator expressions](https://docs.python.org/3/reference/expressions.html#generator-expressions)
- [Python documentation: List comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
## What it does
Checks for `for` loops that can be replaced with `yield from` expressions.

## Why is this bad?
If a `for` loop only contains a `yield` statement, it can be replaced with a
`yield from` expression, which is more concise and idiomatic.

## Example
```python
def bar():
    for x in foo:
        yield x

    global y
    for y in foo:
        yield y
```

Use instead:
```python
def bar():
    yield from foo

    for _element in foo:
        y = _element
        yield y
```

## Fix safety
This rule's fix is marked as unsafe, as converting a `for` loop to a `yield
from` expression can change the behavior of the program in rare cases.
For example, if a generator is being sent values via `send`, then rewriting
to a `yield from` could lead to an attribute error if the underlying
generator does not implement the `send` method.

Additionally, if at least one target is `global` or `nonlocal`,
no fix will be offered.

In most cases, however, the fix is safe, and such a modification should have
no effect on the behavior of the program.

## References
- [Python documentation: The `yield` statement](https://docs.python.org/3/reference/simple_stmts.html#the-yield-statement)
- [PEP 380 – Syntax for Delegating to a Subgenerator](https://peps.python.org/pep-0380/)
## What it does
Checks for unnecessary imports of builtins.

## Why is this bad?
Builtins are always available. Importing them is unnecessary and should be
removed to avoid confusion.

## Example
```python
from builtins import str

str(1)
```

Use instead:
```python
str(1)
```

## Fix safety
This fix is marked as unsafe because removing the import
may change program behavior. For example, in the following
situation:

```python
def str(x):
    return x


from builtins import str

str(1)  # `"1"` with the import, `1` without
```

## Options

This rule will not trigger on imports required by the `isort` configuration.

- `lint.isort.required-imports`

## References
- [Python documentation: The Python Standard Library](https://docs.python.org/3/library/index.html)
## What it does
Checks for unnecessary positional indices in format strings.

## Why is this bad?
In Python 3.1 and later, format strings can use implicit positional
references. For example, `"{0}, {1}".format("Hello", "World")` can be
rewritten as `"{}, {}".format("Hello", "World")`.

If the positional indices appear exactly in-order, they can be omitted
in favor of automatic indices to improve readability.

## Example
```python
"{0}, {1}".format("Hello", "World")  # "Hello, World"
```

Use instead:
```python
"{}, {}".format("Hello", "World")  # "Hello, World"
```

This fix is marked as unsafe because:
- Comments attached to arguments are not moved, which can cause comments to mismatch the actual arguments.
- If arguments have side effects (e.g., print), reordering may change program behavior.

## References
- [Python documentation: Format String Syntax](https://docs.python.org/3/library/string.html#format-string-syntax)
- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)
## What it does
Checks for `printf`-style string formatting, and offers to replace it with
`str.format` calls.

## Why is this bad?
`printf`-style string formatting has a number of quirks, and leads to less
readable code than using `str.format` calls or f-strings. In general, prefer
the newer `str.format` and f-strings constructs over `printf`-style string
formatting.

## Example

```python
"%s, %s" % ("Hello", "World")  # "Hello, World"
```

Use instead:

```python
"{}, {}".format("Hello", "World")  # "Hello, World"
```

```