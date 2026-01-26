# a7046c18:packages_core_python_.venv_bin_ruff:31051-31200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:31051-31200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.remove`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.unlink()` can improve readability over the `os`
module's counterparts (e.g., `os.remove()`).

## Examples
```python
import os

os.remove("file.py")
```

Use instead:
```python
from pathlib import Path

Path("file.py").unlink()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.unlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.unlink)
- [Python documentation: `os.remove`](https://docs.python.org/3/library/os.html#os.remove)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.unlink`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.unlink()` can improve readability over the `os`
module's counterparts (e.g., `os.unlink()`).

## Examples
```python
import os

os.unlink("file.py")
```

Use instead:
```python
from pathlib import Path

Path("file.py").unlink()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.unlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.unlink)
- [Python documentation: `os.unlink`](https://docs.python.org/3/library/os.html#os.unlink)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.getcwd` and `os.getcwdb`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.cwd()` can improve readability over the `os`
module's counterparts (e.g., `os.getcwd()`).

## Examples
```python
import os

cwd = os.getcwd()
```

Use instead:
```python
from pathlib import Path

cwd = Path.cwd()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.
Additionally, the fix is marked as unsafe when the return value is used because the type changes
from `str` or `bytes` to a `Path` object.

## References
- [Python documentation: `Path.cwd`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.cwd)
- [Python documentation: `os.getcwd`](https://docs.python.org/3/library/os.html#os.getcwd)
- [Python documentation: `os.getcwdb`](https://docs.python.org/3/library/os.html#os.getcwdb)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.path.exists`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.path`. When possible, using `Path` object
methods such as `Path.exists()` can improve readability over the `os.path`
module's counterparts (e.g., `os.path.exists()`).

## Examples
```python
import os

os.path.exists("file.py")
```

Use instead:
```python
from pathlib import Path

Path("file.py").exists()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.
```