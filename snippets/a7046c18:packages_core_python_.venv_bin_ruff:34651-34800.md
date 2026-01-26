# a7046c18:packages_core_python_.venv_bin_ruff:34651-34800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34651-34800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Use instead:
```python
my_function(
    param1, param2, param3, param4, param5,
    param6, param7, param8, param9, param10
)
```

## Error suppression
Hint: when suppressing `E501` errors within multi-line strings (like
docstrings), the `noqa` directive should come at the end of the string
(after the closing triple quote), and will apply to the entire string, like
so:

```python
"""Lorem ipsum dolor sit amet.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
"""  # noqa: E501
```

## Options
- `line-length`
- `lint.task-tags`
- `lint.pycodestyle.ignore-overlong-task-comments`
- `lint.pycodestyle.max-line-length`

[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length
## What it does
Checks for redundant backslashes between brackets.

## Why is this bad?
Explicit line joins using a backslash are redundant between brackets.

## Example
```python
x = (2 + \
    2)
```

Use instead:
```python
x = (2 +
    2)
```

[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length
## What it does
Checks for compound statements (multiple statements on the same line).

## Why is this bad?
According to [PEP 8], "compound statements are generally discouraged".

## Example
```python
if foo == "blah": do_blah_thing()
```

Use instead:
```python
if foo == "blah":
    do_blah_thing()
```

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for multiline statements on one line.

## Why is this bad?
According to [PEP 8], including multi-clause statements on the same line is
discouraged.

## Example
```python
do_one(); do_two(); do_three()
```

Use instead:
```python
do_one()
do_two()
do_three()
```

[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations
## What it does
Checks for statements that end with an unnecessary semicolon.

## Why is this bad?
A trailing semicolon is unnecessary and should be removed.

## Example
```python
do_four();  # useless semicolon
```

Use instead:
```python
do_four()
```
## What it does
Checks for comparisons to `None` which are not using the `is` operator.

## Why is this bad?
According to [PEP 8], "Comparisons to singletons like None should always be done with
`is` or `is not`, never the equality operators."

## Example
```python
if arg != None:
    pass
if None == arg:
    pass
```

Use instead:
```python
if arg is not None:
    pass
```

## Fix safety

This rule's fix is marked as unsafe, as it may alter runtime behavior when
used with libraries that override the `==`/`__eq__` or `!=`/`__ne__` operators.
In these cases, `is`/`is not` may not be equivalent to `==`/`!=`. For more
information, see [this issue].

[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations
[this issue]: https://github.com/astral-sh/ruff/issues/4560
## What it does
Checks for equality comparisons to boolean literals.

## Why is this bad?
[PEP 8] recommends against using the equality operators `==` and `!=` to
compare values to `True` or `False`.

Instead, use `if cond:` or `if not cond:` to check for truth values.

If you intend to check if a value is the boolean literal `True` or `False`,
consider using `is` or `is not` to check for identity instead.

## Example
```python
if foo == True:
    ...

if bar == False:
    ...
```