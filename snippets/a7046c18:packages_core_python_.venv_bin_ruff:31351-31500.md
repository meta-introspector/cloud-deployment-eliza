# a7046c18:packages_core_python_.venv_bin_ruff:31351-31500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31351-31500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.is_symlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_symlink)
- [Python documentation: `os.path.islink`](https://docs.python.org/3/library/os.path.html#os.path.islink)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.readlink`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.readlink()` can improve readability over the `os`
module's counterparts (e.g., `os.readlink()`).

## Examples
```python
import os

os.readlink(file_name)
```

Use instead:
```python
from pathlib import Path

Path(file_name).readlink()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.
Additionally, the fix is marked as unsafe when the return value is used because the type changes
from `str` or `bytes` (`AnyStr`) to a `Path` object.

## References
- [Python documentation: `Path.readlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.readline)
- [Python documentation: `os.readlink`](https://docs.python.org/3/library/os.html#os.readlink)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.stat`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.stat()` can improve readability over the `os`
module's counterparts (e.g., `os.path.stat()`).

## Examples
```python
import os
from pwd import getpwuid
from grp import getgrgid

stat = os.stat(file_name)
owner_name = getpwuid(stat.st_uid).pw_name
group_name = getgrgid(stat.st_gid).gr_name
```

Use instead:
```python
from pathlib import Path

file_path = Path(file_name)
stat = file_path.stat()
owner_name = file_path.owner()
group_name = file_path.group()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)
- [Python documentation: `Path.group`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.group)
- [Python documentation: `Path.owner`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.owner)
- [Python documentation: `os.stat`](https://docs.python.org/3/library/os.html#os.stat)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.isabs`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.is_absolute()` can improve readability over the `os.path`
module's counterparts (e.g.,  as `os.path.isabs()`).

## Examples
```python
import os

if os.path.isabs(file_name):
    print("Absolute path!")
```

Use instead:
```python
from pathlib import Path

if Path(file_name).is_absolute():
    print("Absolute path!")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `PurePath.is_absolute`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.is_absolute)
- [Python documentation: `os.path.isabs`](https://docs.python.org/3/library/os.path.html#os.path.isabs)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.join`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.joinpath()` or the `/` operator can improve
readability over the `os.path` module's counterparts (e.g., `os.path.join()`).

## Examples
```python
import os
```