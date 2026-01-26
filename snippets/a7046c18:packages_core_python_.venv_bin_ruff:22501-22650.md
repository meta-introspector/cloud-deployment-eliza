# a7046c18:packages_core_python_.venv_bin_ruff:22501-22650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:22501-22650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```python
import rich

rich.print("Some message")
```

## Options
- `lint.flake8-builtins.ignorelist`
- `target-version`
## What it does
Checks for modules that use the same names as Python standard-library
modules.

## Why is this bad?
Reusing a standard-library module name for the name of a module increases
the difficulty of reading and maintaining the code, and can cause
non-obvious errors. Readers may mistake the first-party module for the
standard-library module and vice versa.

Standard-library modules can be marked as exceptions to this rule via the
[`lint.flake8-builtins.allowed-modules`] configuration option.

By default, the module path relative to the project root or [`src`] directories is considered,
so a top-level `logging.py` or `logging/__init__.py` will clash with the builtin `logging`
module, but `utils/logging.py`, for example, will not. With the
[`lint.flake8-builtins.strict-checking`] option set to `true`, only the last component
of the module name is considered, so `logging.py`, `utils/logging.py`, and
`utils/logging/__init__.py` will all trigger the rule.

This rule is not applied to stub files, as the name of a stub module is out
of the control of the author of the stub file. Instead, a stub should aim to
faithfully emulate the runtime module it is stubbing.

As of Python 3.13, errors from modules that use the same name as
standard-library modules now display a custom message.

## Example

```console
$ touch random.py
$ python3 -c 'from random import choice'
Traceback (most recent call last):
  File "<string>", line 1, in <module>
    from random import choice
ImportError: cannot import name 'choice' from 'random' (consider renaming '/random.py' since it has the same name as the standard library module named 'random' and prevents importing that standard library module)
```

## Options
- `lint.flake8-builtins.allowed-modules`
- `lint.flake8-builtins.strict-checking`
## What it does
Checks for lambda arguments that use the same names as Python builtins.

## Why is this bad?
Reusing a builtin name for the name of a lambda argument increases the
difficulty of reading and maintaining the code and can cause
non-obvious errors. Readers may mistake the variable for the
builtin, and vice versa.

Builtins can be marked as exceptions to this rule via the
[`lint.flake8-builtins.ignorelist`] configuration option.

## Options
- `lint.flake8-builtins.ignorelist`
## What it does
Checks for the absence of trailing commas.

## Why is this bad?
The presence of a trailing comma can reduce diff size when parameters or
elements are added or removed from function calls, function definitions,
literals, etc.

## Example
```python
foo = {
    "bar": 1,
    "baz": 2
}
```

Use instead:
```python
foo = {
    "bar": 1,
    "baz": 2,
}
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent use of trailing commas, making the rule redundant.

[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for the presence of trailing commas on bare (i.e., unparenthesized)
tuples.

## Why is this bad?
The presence of a misplaced comma will cause Python to interpret the value
as a tuple, which can lead to unexpected behaviour.

## Example
```python
import json


foo = json.dumps({"bar": 1}),
```

Use instead:
```python
import json


foo = json.dumps({"bar": 1})
```

In the event that a tuple is intended, then use instead:
```python
import json


foo = (json.dumps({"bar": 1}),)
```
## What it does
Checks for the presence of prohibited trailing commas.

## Why is this bad?
Trailing commas are not essential in some cases and can therefore be viewed
as unnecessary.

## Example
```python
foo = (1, 2, 3,)
```

Use instead:
```python
foo = (1, 2, 3)
```

## Formatter compatibility
We recommend against using this rule alongside the [formatter]. The
formatter enforces consistent use of trailing commas, making the rule redundant.

[formatter]:https://docs.astral.sh/ruff/formatter/
## What it does
Checks for unnecessary generators that can be rewritten as list
comprehensions (or with `list()` directly).

```