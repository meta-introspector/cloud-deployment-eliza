# a7046c18:packages_core_python_.venv_bin_ruff:31951-32100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31951-32100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `.split(os.sep)`

## Why is this bad?
The `pathlib` module in the standard library should be used for path
manipulation. It provides a high-level API with the functionality
needed for common operations on `Path` objects.

## Example
If not all parts of the path are needed, then the `name` and `parent`
attributes of the `Path` object should be used. Otherwise, the `parts`
attribute can be used as shown in the last example.
```python
import os

"path/to/file_name.txt".split(os.sep)[-1]

"path/to/file_name.txt".split(os.sep)[-2]

# Iterating over the path parts
if any(part in blocklist for part in "my/file/path".split(os.sep)):
    ...
```

Use instead:
```python
from pathlib import Path

Path("path/to/file_name.txt").name

Path("path/to/file_name.txt").parent.name

# Iterating over the path parts
if any(part in blocklist for part in Path("my/file/path").parts):
    ...
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than working directly with strings,
especially on older versions of Python.

## References
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for the use of `glob.glob()` and `glob.iglob()`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os` and `glob`.

When possible, using `Path` object methods such as `Path.glob()` can
improve readability over their low-level counterparts (e.g.,
`glob.glob()`).

Note that `glob.glob()` and `Path.glob()` are not exact equivalents:

|                   | `glob`-module functions                                                                                                                              | `Path.glob()`                                                                                                                                |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Hidden files      | Hidden files are excluded by default. On Python 3.11+, the `include_hidden` keyword can be used to include hidden directories.                       | Includes hidden files by default.                                                                                                            |
| Eagerness         | `glob.iglob()` returns a lazy iterator. Under the hood, `glob.glob()` simply converts the iterator to a list.                                        | `Path.glob()` returns a lazy iterator.                                                                                                       |
| Working directory | `glob.glob()` and `glob.iglob()` take a `root_dir` keyword to set the current working directory.                                                     | `Path.rglob()` can be used to return the relative path.                                                                                      |
| Globstar (`**`)   | The `recursive` flag must be set to `True` for the `**` pattern to match any files and zero or more directories, subdirectories, and symbolic links. | The `**` pattern in `Path.glob()` means "this directory and all subdirectories, recursively". In other words, it enables recursive globbing. |

## Example
```python
import glob
import os

glob.glob(os.path.join("my_path", "requirements*.txt"))
```

Use instead:
```python
from pathlib import Path

Path("my_path").glob("requirements*.txt")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `Path.glob`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob)
- [Python documentation: `Path.rglob`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rglob)
- [Python documentation: `glob.glob`](https://docs.python.org/3/library/glob.html#glob.glob)
- [Python documentation: `glob.iglob`](https://docs.python.org/3/library/glob.html#glob.iglob)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.listdir`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `pathlib`'s
`Path.iterdir()` can improve readability over `os.listdir()`.

## Example

```python
p = "."
for d in os.listdir(p):
    ...

if os.listdir(p):
    ...

if "file" in os.listdir(p):
    ...
```

Use instead:

```python
p = Path(".")
for d in p.iterdir():
    ...

if any(p.iterdir()):
    ...

if (p / "file").exists():
    ...
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `Path.iterdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.iterdir)
- [Python documentation: `os.listdir`](https://docs.python.org/3/library/os.html#os.listdir)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for `pathlib.Path.with_suffix()` calls where
the given suffix does not have a leading dot
or the given suffix is a single dot `"."` and the
Python version is less than 3.14.
```