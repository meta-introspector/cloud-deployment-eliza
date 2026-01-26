# a7046c18:packages_core_python_.venv_bin_ruff:39601-39750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:39601-39750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for `import` statements outside of a module's top-level scope, such
as within a function or class definition.

## Why is this bad?
[PEP 8] recommends placing imports not only at the top-level of a module,
but at the very top of the file, "just after any module comments and
docstrings, and before module globals and constants."

`import` statements have effects that are global in scope; defining them at
the top level has a number of benefits. For example, it makes it easier to
identify the dependencies of a module, and ensures that any invalid imports
are caught regardless of whether a specific function is called or class is
instantiated.

An import statement would typically be placed within a function only to
avoid a circular dependency, to defer a costly module load, or to avoid
loading a dependency altogether in a certain runtime environment.

## Example
```python
def print_python_version():
    import platform

    print(platform.python_version())
```

Use instead:
```python
import platform


def print_python_version():
    print(platform.python_version())
```

## See also
This rule will ignore import statements configured in
[`lint.flake8-tidy-imports.banned-module-level-imports`][banned-module-level-imports]
if the rule [`banned-module-level-imports`][TID253] is enabled.

[banned-module-level-imports]: https://docs.astral.sh/ruff/settings/#lint_flake8-tidy-imports_banned-module-level-imports
[TID253]: https://docs.astral.sh/ruff/rules/banned-module-level-imports/
[PEP 8]: https://peps.python.org/pep-0008/#imports
## What it does
Checks for `len` calls on sequences in a boolean test context.

## Why is this bad?
Empty sequences are considered false in a boolean context.
You can either remove the call to `len`
or compare the length against a scalar.

## Example
```python
fruits = ["orange", "apple"]
vegetables = []

if len(fruits):
    print(fruits)

if not len(vegetables):
    print(vegetables)
```

Use instead:
```python
fruits = ["orange", "apple"]
vegetables = []

if fruits:
    print(fruits)

if not vegetables:
    print(vegetables)
```

## Fix safety
This rule's fix is marked as unsafe when the `len` call includes a comment,
as the comment would be removed.

For example, the fix would be marked as unsafe in the following case:
```python
fruits = []
if len(
    fruits  # comment
):
    ...
```

## References
[PEP 8: Programming Recommendations](https://peps.python.org/pep-0008/#programming-recommendations)
## What it does
Checks for comparisons to empty strings.

## Why is this bad?
An empty string is falsy, so it is unnecessary to compare it to `""`. If
the value can be something else Python considers falsy, such as `None`,
`0`, or another empty container, then the code is not equivalent.

## Known problems
High false positive rate, as the check is context-insensitive and does not
consider the type of the variable being compared ([#4282]).

## Example
```python
x: str = ...

if x == "":
    print("x is empty")
```

Use instead:
```python
x: str = ...

if not x:
    print("x is empty")
```

## References
- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)

[#4282]: https://github.com/astral-sh/ruff/issues/4282
## What it does
Checks for the use of non-ASCII characters in variable names.

## Why is this bad?
The use of non-ASCII characters in variable names can cause confusion
and compatibility issues (see: [PEP 672]).

## Example
```python
ápple_count: int
```

Use instead:
```python
apple_count: int
```

[PEP 672]: https://peps.python.org/pep-0672/
## What it does
Checks for the use of non-ASCII characters in import statements.

## Why is this bad?
The use of non-ASCII characters in import statements can cause confusion
and compatibility issues (see: [PEP 672]).

## Example
```python
```