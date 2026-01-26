# a7046c18:packages_core_python_.venv_bin_ruff:28651-28800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:28651-28800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
foo = "bar\"s"
```

Use instead:
```python
foo = 'bar"s'
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter automatically removes unnecessary escapes, making the rule
redundant.

## Options

- `lint.flake8-quotes.inline-quotes`

[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for strings that include unnecessarily escaped quotes.

## Why is this bad?
If a string contains an escaped quote that doesn't match the quote
character used for the string, it's unnecessary and can be removed.

## Example
```python
foo = "bar\'s"
```

Use instead:
```python
foo = "bar's"
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter automatically removes unnecessary escapes, making the rule
redundant.

[formatter]: https://docs.astral.sh/ruff/formatter
## What it does
Checks for unnecessary parentheses on raised exceptions.

## Why is this bad?
If an exception is raised without any arguments, parentheses are not
required, as the `raise` statement accepts either an exception instance
or an exception class (which is then implicitly instantiated).

Removing the parentheses makes the code more concise.

## Known problems
Parentheses can only be omitted if the exception is a class, as opposed to
a function call. This rule isn't always capable of distinguishing between
the two.

For example, if you import a function `module.get_exception` from another
module, and `module.get_exception` returns an exception object, this rule will
incorrectly mark the parentheses in `raise module.get_exception()` as
unnecessary.

## Example
```python
raise TypeError()
```

Use instead:
```python
raise TypeError
```

## Fix Safety
This rule's fix is marked as unsafe if removing the parentheses would also remove comments
or if it’s unclear whether the expression is a class or a function call.

## References
- [Python documentation: The `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)
## What it does
Checks for the presence of a `return None` statement when `None` is the only
possible return value.

## Why is this bad?
Python implicitly assumes `return None` if an explicit `return` value is
omitted. Therefore, explicitly returning `None` is redundant and should be
avoided when it is the only possible `return` value across all code paths
in a given function.

## Example
```python
def foo(bar):
    if not bar:
        return
    return None
```

Use instead:
```python
def foo(bar):
    if not bar:
        return
    return
```

## Fix safety
This rule's fix is marked as unsafe for cases in which comments would be
dropped from the `return` statement.

## Options

This rule ignores functions marked as properties.

- `lint.pydocstyle.property-decorators`
## What it does
Checks for the presence of a `return` statement with no explicit value,
for functions that return non-`None` values elsewhere.

## Why is this bad?
Including a `return` statement with no explicit value can cause confusion
when other `return` statements in the function return non-`None` values.
Python implicitly assumes return `None` if no other return value is present.
Adding an explicit `return None` can make the code more readable by clarifying
intent.

## Example
```python
def foo(bar):
    if not bar:
        return
    return 1
```

Use instead:
```python
def foo(bar):
    if not bar:
        return None
    return 1
```
## What it does
Checks for missing explicit `return` statements at the end of functions
that can return non-`None` values.

## Why is this bad?
The lack of an explicit `return` statement at the end of a function that
can return non-`None` values can cause confusion. Python implicitly returns
`None` if no other return value is present. Adding an explicit
`return None` can make the code more readable by clarifying intent.

## Example
```