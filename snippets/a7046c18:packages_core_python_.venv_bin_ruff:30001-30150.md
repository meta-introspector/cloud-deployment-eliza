# a7046c18:packages_core_python_.venv_bin_ruff:30001-30150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30001-30150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
some other nested context).

## Why is this bad?
Some modules are expensive to import. For example, importing `torch` or
`tensorflow` can introduce a noticeable delay in the startup time of a
Python program.

In such cases, you may want to enforce that the module is imported lazily
as needed, rather than at the top of the file. This could involve inlining
the import into the function that uses it, rather than importing it
unconditionally, to ensure that the module is only imported when necessary.

## Example
```python
import tensorflow as tf


def show_version():
    print(tf.__version__)
```

Use instead:
```python
def show_version():
    import tensorflow as tf

    print(tf.__version__)
```

## Options
- `lint.flake8-tidy-imports.banned-module-level-imports`
## What it does
Checks that a TODO comment is labelled with "TODO".

## Why is this bad?
Ambiguous tags reduce code visibility and can lead to dangling TODOs.
For example, if a comment is tagged with "FIXME" rather than "TODO", it may
be overlooked by future readers.

Note that this rule will only flag "FIXME" and "XXX" tags as incorrect.

## Example
```python
# FIXME(ruff): this should get fixed!
```

Use instead:
```python
# TODO(ruff): this is now fixed!
```
## What it does
Checks that a TODO comment includes an author.

## Why is this bad?
Including an author on a TODO provides future readers with context around
the issue. While the TODO author is not always considered responsible for
fixing the issue, they are typically the individual with the most context.

## Example
```python
# TODO: should assign an author here
```

Use instead
```python
# TODO(charlie): now an author is assigned
```
## What it does
Checks that a TODO comment is associated with a link to a relevant issue
or ticket.

## Why is this bad?
Including an issue link near a TODO makes it easier for resolvers
to get context around the issue.

## Example
```python
# TODO: this link has no issue
```

Use one of these instead:
```python
# TODO(charlie): this comment has an issue link
# https://github.com/astral-sh/ruff/issues/3870

# TODO(charlie): this comment has a 3-digit issue code
# 003

# TODO(charlie): https://github.com/astral-sh/ruff/issues/3870
# this comment has an issue link

# TODO(charlie): #003 this comment has a 3-digit issue code
# with leading character `#`

# TODO(charlie): this comment has an issue code (matches the regex `[A-Z]+\-?\d+`)
# SIXCHR-003
```
## What it does
Checks that a "TODO" tag is followed by a colon.

## Why is this bad?
"TODO" tags are typically followed by a parenthesized author name, a colon,
a space, and a description of the issue, in that order.

Deviating from this pattern can lead to inconsistent and non-idiomatic
comments.

## Example
```python
# TODO(charlie) fix this colon
```

Used instead:
```python
# TODO(charlie): colon fixed
```
## What it does
Checks that a "TODO" tag contains a description of the issue following the
tag itself.

## Why is this bad?
TODO comments should include a description of the issue to provide context
for future readers.

## Example
```python
# TODO(charlie)
```

Use instead:
```python
# TODO(charlie): fix some issue
```
## What it does
Checks that a "TODO" tag is properly capitalized (i.e., that the tag is
uppercase).

## Why is this bad?
Capitalizing the "TODO" in a TODO comment is a convention that makes it
easier for future readers to identify TODOs.

## Example
```python
# todo(charlie): capitalize this
```

Use instead:
```python
# TODO(charlie): this is capitalized
```
```