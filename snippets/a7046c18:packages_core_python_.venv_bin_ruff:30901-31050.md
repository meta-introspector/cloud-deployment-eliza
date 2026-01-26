# a7046c18:packages_core_python_.venv_bin_ruff:30901-31050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:30901-31050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
methods such as `Path.mkdir(parents=True)` can improve readability over the
`os` module's counterparts (e.g., `os.makedirs()`.

## Examples
```python
import os

os.makedirs("./nested/directory/")
```

Use instead:
```python
from pathlib import Path

Path("./nested/directory/").mkdir(parents=True)
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.mkdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir)
- [Python documentation: `os.makedirs`](https://docs.python.org/3/library/os.html#os.makedirs)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.rename`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.rename()` can improve readability over the `os`
module's counterparts (e.g., `os.rename()`).

## Examples
```python
import os

os.rename("old.py", "new.py")
```

Use instead:
```python
from pathlib import Path

Path("old.py").rename("new.py")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.
Additionally, the fix is marked as unsafe when the return value is used because the type changes
from `None` to a `Path` object.

## References
- [Python documentation: `Path.rename`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rename)
- [Python documentation: `os.rename`](https://docs.python.org/3/library/os.html#os.rename)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.replace`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.replace()` can improve readability over the `os`
module's counterparts (e.g., `os.replace()`).

Note that `os` functions may be preferable if performance is a concern,
e.g., in hot loops.

## Examples
```python
import os

os.replace("old.py", "new.py")
```

Use instead:
```python
from pathlib import Path

Path("old.py").replace("new.py")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.
Additionally, the fix is marked as unsafe when the return value is used because the type changes
from `None` to a `Path` object.

## References
- [Python documentation: `Path.replace`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.replace)
- [Python documentation: `os.replace`](https://docs.python.org/3/library/os.html#os.replace)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for uses of `os.rmdir`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os`. When possible, using `Path` object
methods such as `Path.rmdir()` can improve readability over the `os`
module's counterparts (e.g., `os.rmdir()`).

## Examples
```python
import os

os.rmdir("folder/")
```

Use instead:
```python
from pathlib import Path

Path("folder/").rmdir()
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.rmdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rmdir)
- [Python documentation: `os.rmdir`](https://docs.python.org/3/library/os.html#os.rmdir)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
```