# a7046c18:packages_core_python_.venv_bin_ruff:29251-29400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:29251-29400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Fix safety

This fix is always marked as unsafe because it might remove comments.

## Options

The rule will avoid flagging cases where using the builtin function would exceed the configured
line length, as determined by these options:

- `lint.pycodestyle.max-line-length`
- `indent-width`

## References
- [Python documentation: `any`](https://docs.python.org/3/library/functions.html#any)
- [Python documentation: `all`](https://docs.python.org/3/library/functions.html#all)
## What it does
Check for environment variables that are not capitalized.

## Why is this bad?
By convention, environment variables should be capitalized.

On Windows, environment variables are case-insensitive and are converted to
uppercase, so using lowercase environment variables can lead to subtle bugs.

## Example
```python
import os

os.environ["foo"]
```

Use instead:
```python
import os

os.environ["FOO"]
```

## Fix safety

This fix is always marked as unsafe because automatically capitalizing environment variable names
can change program behavior in environments where the variable names are case-sensitive, such as most
Unix-like systems.

## References
- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)
## What it does
Checks for `for` loops with explicit loop-index variables that can be replaced
with `enumerate()`.

In [preview], this rule checks for index variables initialized with any integer rather than only
a literal zero.

## Why is this bad?
When iterating over a sequence, it's often desirable to keep track of the
index of each element alongside the element itself. Prefer the `enumerate`
builtin over manually incrementing a counter variable within the loop, as
`enumerate` is more concise and idiomatic.

## Example
```python
fruits = ["apple", "banana", "cherry"]
i = 0
for fruit in fruits:
    print(f"{i + 1}. {fruit}")
    i += 1
```

Use instead:
```python
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(f"{i + 1}. {fruit}")
```

## References
- [Python documentation: `enumerate`](https://docs.python.org/3/library/functions.html#enumerate)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for `if` branches with identical arm bodies.

## Why is this bad?
If multiple arms of an `if` statement have the same body, using `or`
better signals the intent of the statement.

## Example
```python
if x == 1:
    print("Hello")
elif x == 2:
    print("Hello")
```

Use instead:
```python
if x == 1 or x == 2:
    print("Hello")
```
## What it does
Checks for cases where files are opened (e.g., using the builtin `open()` function)
without using a context manager.

## Why is this bad?
If a file is opened without a context manager, it is not guaranteed that
the file will be closed (e.g., if an exception is raised), which can cause
resource leaks. The rule detects a wide array of IO calls where context managers
could be used, such as `open`, `pathlib.Path(...).open()`, `tempfile.TemporaryFile()`
or`tarfile.TarFile(...).gzopen()`.

## Example
```python
file = open("foo.txt")
...
file.close()
```

Use instead:
```python
with open("foo.txt") as file:
    ...
```

## References
- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)
## What it does
Checks for three or more consecutive if-statements with direct returns

## Why is this bad?
These can be simplified by using a dictionary

## Example
```python
def find_phrase(x):
    if x == 1:
        return "Hello"
    elif x == 2:
        return "Goodbye"
    elif x == 3:
        return "Good morning"
    else:
        return "Goodnight"
```

Use instead:
```python
def find_phrase(x):
    phrases = {1: "Hello", 2: "Goodye", 3: "Good morning"}
```