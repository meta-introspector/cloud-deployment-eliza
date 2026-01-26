# a7046c18:packages_core_python_.venv_bin_ruff:31201-31350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31201-31350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## References
- [Python documentation: `Path.exists`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.exists)
- [Python documentation: `os.path.exists`](https://docs.python.org/3/library/os.path.html#os.path.exists)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.expanduser`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.expanduser()` can improve readability over the `os.path`
module's counterparts (e.g., as `os.path.expanduser()`).

## Examples
```python
import os

os.path.expanduser("~/films/Monty Python")
```

Use instead:
```python
from pathlib import Path

Path("~/films/Monty Python").expanduser()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is always marked as unsafe because the behaviors of
`os.path.expanduser` and `Path.expanduser` differ when a user's home
directory can't be resolved: `os.path.expanduser` returns the
input unchanged, while `Path.expanduser` raises `RuntimeError`.

Additionally, the fix is marked as unsafe because `os.path.expanduser()` returns `str` or `bytes` (`AnyStr`),
while `Path.expanduser()` returns a `Path` object. This change in return type can break code that uses
the return value.

## References
- [Python documentation: `Path.expanduser`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.expanduser)
- [Python documentation: `os.path.expanduser`](https://docs.python.org/3/library/os.path.html#os.path.expanduser)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.isdir`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.is_dir()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.isdir()`).

## Examples
```python
import os

os.path.isdir("docs")
```

Use instead:
```python
from pathlib import Path

Path("docs").is_dir()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.is_dir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_dir)
- [Python documentation: `os.path.isdir`](https://docs.python.org/3/library/os.path.html#os.path.isdir)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.isfile`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.is_file()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.isfile()`).

## Examples
```python
import os

os.path.isfile("docs")
```

Use instead:
```python
from pathlib import Path

Path("docs").is_file()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.is_file`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_file)
- [Python documentation: `os.path.isfile`](https://docs.python.org/3/library/os.path.html#os.path.isfile)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.islink`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.is_symlink()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.islink()`).

## Examples
```python
import os

os.path.islink("docs")
```

Use instead:
```python
from pathlib import Path

Path("docs").is_symlink()
```