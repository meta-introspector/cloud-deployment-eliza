# a7046c18:packages_core_python_.venv_bin_ruff:31651-31800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31651-31800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.samefile`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.samefile)
- [Python documentation: `os.path.samefile`](https://docs.python.org/3/library/os.path.html#os.path.samefile)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.splitext`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.suffix` and `Path.stem` can improve readability over
the `os.path` module's counterparts (e.g., `os.path.splitext()`).

`os.path.splitext()` specifically returns a tuple of the file root and
extension (e.g., given `splitext('/foo/bar.py')`, `os.path.splitext()`
returns `("foo/bar", ".py")`. These outputs can be reconstructed through a
combination of `Path.suffix` (`".py"`), `Path.stem` (`"bar"`), and
`Path.parent` (`"foo"`).

## Examples
```python
import os

(root, ext) = os.path.splitext("foo/bar.py")
```

Use instead:
```python
from pathlib import Path

path = Path("foo/bar.py")
root = path.parent / path.stem
ext = path.suffix
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `Path.suffix`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.suffix)
- [Python documentation: `Path.suffixes`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.suffixes)
- [Python documentation: `os.path.splitext`](https://docs.python.org/3/library/os.path.html#os.path.splitext)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of the `open()` builtin.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation. When possible,
using `Path` object methods such as `Path.open()` can improve readability
over the `open` builtin.

## Examples
```python
with open("f1.py", "wb") as fp:
    ...
```

Use instead:
```python
from pathlib import Path

with Path("f1.py").open("wb") as fp:
    ...
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than working directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.open`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.open)
- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of the `py.path` library.

## Why is this bad?
The `py.path` library is in maintenance mode. Instead, prefer the standard
library's `pathlib` module, or third-party modules like `path` (formerly
`py.path`).

## Examples
```python
import py.path

p = py.path.local("/foo/bar").join("baz/qux")
```

Use instead:
```python
from pathlib import Path

p = Path("/foo/bar") / "bar" / "qux"
```

## References
- [Python documentation: `Pathlib`](https://docs.python.org/3/library/pathlib.html)
- [Path repository](https://github.com/jaraco/path)
## What it does
Checks for `pathlib.Path` objects that are initialized with the current
directory.

## Why is this bad?
The `Path()` constructor defaults to the current directory, so passing it
in explicitly (as `"."`) is unnecessary.

## Example
```python
from pathlib import Path

_ = Path(".")
```

Use instead:
```python
from pathlib import Path

_ = Path()
```

## Fix safety
This fix is marked unsafe if there are comments inside the parentheses, as applying
the fix will delete them.

## References
- [Python documentation: `Path`](https://docs.python.org/3/library/pathlib.html#pathlib.Path)
## What it does
Checks for uses of `os.path.getsize`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`.

```