# a7046c18:packages_core_python_.venv_bin_ruff:34201-34350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:34201-34350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
An inline comment is a comment on the same line as a statement.

Per [PEP 8], inline comments should start with a # and a single space.

## Example
```python
x = x + 1  #Increment x
x = x + 1  #  Increment x
x = x + 1  # \xa0Increment x
```

Use instead:
```python
x = x + 1  # Increment x
x = x + 1    # Increment x
```

[PEP 8]: https://peps.python.org/pep-0008/#comments
## What it does
Checks for block comments that lack a single space after the leading `#` character.

## Why is this bad?
Per [PEP 8], "Block comments generally consist of one or more paragraphs built
out of complete sentences, with each sentence ending in a period."

Block comments should start with a `#` followed by a single space.

Shebangs (lines starting with `#!`, at the top of a file) are exempt from this
rule.

## Example
```python
#Block comment
```

Use instead:
```python
# Block comment
```

[PEP 8]: https://peps.python.org/pep-0008/#comments
## What it does
Checks for block comments that start with multiple leading `#` characters.

## Why is this bad?
Per [PEP 8], "Block comments generally consist of one or more paragraphs built
out of complete sentences, with each sentence ending in a period."

Each line of a block comment should start with a `#` followed by a single space.

Shebangs (lines starting with `#!`, at the top of a file) are exempt from this
rule.

## Example
```python
### Block comment
```

Use instead:
```python
# Block comment
```

Alternatively, this rule makes an exception for comments that consist
solely of `#` characters, as in:

```python
##############
# Block header
##############
```

[PEP 8]: https://peps.python.org/pep-0008/#comments
## What it does
Checks for extraneous whitespace after keywords.

## Why is this bad?


## Example
```python
True and  False
```

Use instead:
```python
True and False
```
## What it does
Checks for extraneous whitespace before keywords.

## Why is this bad?


## Example
```python
x  and y
```

Use instead:
```python
x and y
```
## What it does
Checks for extraneous tabs after keywords.

## Why is this bad?


## Example
```python
True and\tFalse
```

Use instead:
```python
True and False
```
## What it does
Checks for extraneous tabs before keywords.

## Why is this bad?


## Example
```python
True\tand False
```

Use instead:
```python
True and False
```
## What it does
Checks for missing whitespace after keywords.

## Why is this bad?
Missing whitespace after keywords makes the code harder to read.

## Example
```python
if(True):
    pass
```

Use instead:
```python
if (True):
    pass
```
```