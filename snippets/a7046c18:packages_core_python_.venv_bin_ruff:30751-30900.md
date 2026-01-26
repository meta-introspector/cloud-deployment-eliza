# a7046c18:packages_core_python_.venv_bin_ruff:30751-30900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30751-30900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
An argument that is defined but not used is likely a mistake, and should
be removed to avoid confusion.

If a variable is intentionally defined-but-not-used, it should be
prefixed with an underscore, or some other value that adheres to the
[`lint.dummy-variable-rgx`] pattern.

## Example
```python
my_list = [1, 2, 3, 4, 5]
squares = map(lambda x, y: x**2, my_list)
```

Use instead:
```python
my_list = [1, 2, 3, 4, 5]
squares = map(lambda x: x**2, my_list)
```

## Options
- `lint.dummy-variable-rgx`
## What it does
Checks for uses of `os.path.abspath`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.resolve()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.abspath()`).

## Examples
```python
import os

file_path = os.path.abspath("../path/to/file")
```

Use instead:
```python
from pathlib import Path

file_path = Path("../path/to/file").resolve()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is always marked as unsafe because `Path.resolve()` resolves symlinks, while
`os.path.abspath()` does not. If resolving symlinks is important, you may need to use
`Path.absolute()`. However, `Path.absolute()` also does not remove any `..` components in a
path, unlike `os.path.abspath()` and `Path.resolve()`, so if that specific combination of
behaviors is required, there's no existing `pathlib` alternative. See CPython issue
[#69200](https://github.com/python/cpython/issues/69200).

Additionally, the fix is marked as unsafe because `os.path.abspath()` returns `str` or `bytes` (`AnyStr`),
while `Path.resolve()` returns a `Path` object. This change in return type can break code that uses
the return value.

## References
- [Python documentation: `Path.resolve`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.resolve)
- [Python documentation: `os.path.abspath`](https://docs.python.org/3/library/os.path.html#os.path.abspath)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.chmod`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.chmod()` can improve readability over the `os`
module's counterparts (e.g., `os.chmod()`).

## Examples
```python
import os

os.chmod("file.py", 0o444)
```

Use instead:
```python
from pathlib import Path

Path("file.py").chmod(0o444)
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.chmod`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.chmod)
- [Python documentation: `os.chmod`](https://docs.python.org/3/library/os.html#os.chmod)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.mkdir`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.mkdir()` can improve readability over the `os`
module's counterparts (e.g., `os.mkdir()`).

## Examples
```python
import os

os.mkdir("./directory/")
```

Use instead:
```python
from pathlib import Path

Path("./directory/").mkdir()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.mkdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir)
- [Python documentation: `os.mkdir`](https://docs.python.org/3/library/os.html#os.mkdir)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.makedirs`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
```