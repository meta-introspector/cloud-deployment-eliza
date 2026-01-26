# a7046c18:packages_core_python_.venv_bin_ruff:32101-32250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:32101-32250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Why is this bad?
`Path.with_suffix()` will raise an error at runtime
if the given suffix is not prefixed with a dot
or, in versions prior to Python 3.14, if it is a single dot `"."`.

## Example

```python
from pathlib import Path

path = Path()

path.with_suffix("py")
```

Use instead:

```python
from pathlib import Path

path = Path()

path.with_suffix(".py")
```

## Known problems
This rule is likely to have false negatives, as Ruff can only emit the
lint if it can say for sure that a binding refers to a `Path` object at
runtime. Due to type inference limitations, Ruff is currently only
confident about this if it can see that the binding originates from a
function parameter annotated with `Path` or from a direct assignment to a
`Path()` constructor call.

## Fix safety
The fix for this rule adds a leading period to the string passed
to the `with_suffix()` call. This fix is marked as unsafe, as it
changes runtime behaviour: the call would previously always have
raised an exception, but no longer will.

Moreover, it's impossible to determine if this is the correct fix
for a given situation (it's possible that the string was correct
but was being passed to the wrong method entirely, for example).

No fix is offered if the suffix `"."` is given, since the intent is unclear.
## What it does
Checks for uses of `os.symlink`.

## Why is this bad?
`pathlib` offers a high-level API for path manipulation, as compared to
the lower-level API offered by `os.symlink`.

## Example
```python
import os

os.symlink("usr/bin/python", "tmp/python", target_is_directory=False)
```

Use instead:
```python
from pathlib import Path

Path("tmp/python").symlink_to("usr/bin/python")
```

## Known issues
While using `pathlib` can improve the readability and type safety of your code,
it can be less performant than the lower-level alternatives that work directly with strings,
especially on older versions of Python.

## Fix Safety
This rule's fix is marked as unsafe if the replacement would remove comments attached to the original expression.

## References
- [Python documentation: `Path.symlink_to`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.symlink_to)
- [PEP 428 – The pathlib module – object-oriented filesystem paths](https://peps.python.org/pep-0428/)
- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#corresponding-tools)
- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)
- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)
## What it does
Checks for `str.join` calls that can be replaced with f-strings.

## Why is this bad?
f-strings are more readable and generally preferred over `str.join` calls.

## Example
```python
" ".join((foo, bar))
```

Use instead:
```python
f"{foo} {bar}"
```

## Fix safety
The fix is always marked unsafe because the evaluation of the f-string
expressions will default to calling the `__format__` method of each
object, whereas `str.join` expects each object to be an instance of
`str` and uses the corresponding string. Therefore it is possible for
the values of the resulting strings to differ, or for one expression
to raise an exception while the other does not.

## References
- [Python documentation: f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)
## What it does
De-duplicates, groups, and sorts imports based on the provided `isort` settings.

## Why is this bad?
Consistency is good. Use a common convention for imports to make your code
more readable and idiomatic.

## Example
```python
import pandas
import numpy as np
```

Use instead:
```python
import numpy as np
import pandas
```

## What it does
Adds any required imports, as specified by the user, to the top of the
file.

## Why is this bad?
In some projects, certain imports are required to be present in all
files. For example, some projects assume that
`from __future__ import annotations` is enabled,
and thus require that import to be
present in all files. Omitting a "required" import (as specified by
the user) can cause errors or unexpected behavior.

## Example
```python
import typing
```

Use instead:
```python
from __future__ import annotations

import typing
```

## Options
```