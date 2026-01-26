# a7046c18:packages_core_python_.venv_bin_ruff:31501-31650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31501-31650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

os.path.join(os.path.join(ROOT_PATH, "folder"), "file.py")
```

Use instead:
```python
from pathlib import Path

Path(ROOT_PATH) / "folder" / "file.py"
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `PurePath.joinpath`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.joinpath)
- [Python documentation: `os.path.join`](https://docs.python.org/3/library/os.path.html#os.path.join)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.basename`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.name` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.basename()`).

## Examples
```python
import os

os.path.basename(__file__)
```

Use instead:
```python
from pathlib import Path

Path(__file__).name
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is always marked as unsafe because the replacement is not always semantically
equivalent to the original code. In particular, `pathlib` performs path normalization,
which can alter the result compared to `os.path.basename`. For example, this normalization:

- Collapses consecutive slashes (e.g., `"a//b"` → `"a/b"`).
- Removes trailing slashes (e.g., `"a/b/"` → `"a/b"`).
- Eliminates `"."` (e.g., `"a/./b"` → `"a/b"`).

As a result, code relying on the exact string returned by `os.path.basename`
may behave differently after the fix.

## References
- [Python documentation: `PurePath.name`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.name)
- [Python documentation: `os.path.basename`](https://docs.python.org/3/library/os.path.html#os.path.basename)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.dirname`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.parent` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.dirname()`).

## Examples
```python
import os

os.path.dirname(__file__)
```

Use instead:
```python
from pathlib import Path

Path(__file__).parent
```

## Fix Safety
This rule's fix is always marked as unsafe because the replacement is not always semantically
equivalent to the original code. In particular, `pathlib` performs path normalization,
which can alter the result compared to `os.path.dirname`. For example, this normalization:

- Collapses consecutive slashes (e.g., `"a//b"` → `"a/b"`).
- Removes trailing slashes (e.g., `"a/b/"` → `"a/b"`).
- Eliminates `"."` (e.g., `"a/./b"` → `"a/b"`).

As a result, code relying on the exact string returned by `os.path.dirname`
may behave differently after the fix.

Additionally, the fix is marked as unsafe because `os.path.dirname()` returns `str` or `bytes` (`AnyStr`),
while `Path.parent` returns a `Path` object. This change in return type can break code that uses
the return value.

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## References
- [Python documentation: `PurePath.parent`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.parent)
- [Python documentation: `os.path.dirname`](https://docs.python.org/3/library/os.path.html#os.path.dirname)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.samefile`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.samefile()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.samefile()`).

## Examples
```python
import os

os.path.samefile("f1.py", "f2.py")
```

Use instead:
```python
from pathlib import Path

Path("f1.py").samefile("f2.py")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
```