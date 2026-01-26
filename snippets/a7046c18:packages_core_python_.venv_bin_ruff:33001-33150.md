# a7046c18:packages_core_python_.venv_bin_ruff:33001-33150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33001-33150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
sorted_df = df.sort_values("col1")
```

## References
- [_Why You Should Probably Never Use pandas `inplace=True`_](https://towardsdatascience.com/why-you-should-probably-never-use-pandas-inplace-true-9f9f211849e4)
## What it does
Checks for uses of `.isnull` on Pandas objects.

## Why is this bad?
In the Pandas API, `.isna` and `.isnull` are equivalent. For consistency,
prefer `.isna` over `.isnull`.

As a name, `.isna` more accurately reflects the behavior of the method,
since these methods check for `NaN` and `NaT` values in addition to `None`
values.

## Example
```python
import pandas as pd

animals_df = pd.read_csv("animals.csv")
pd.isnull(animals_df)
```

Use instead:
```python
import pandas as pd

animals_df = pd.read_csv("animals.csv")
pd.isna(animals_df)
```

## References
- [Pandas documentation: `isnull`](https://pandas.pydata.org/docs/reference/api/pandas.isnull.html#pandas.isnull)
- [Pandas documentation: `isna`](https://pandas.pydata.org/docs/reference/api/pandas.isna.html#pandas.isna)
## What it does
Checks for uses of `.notnull` on Pandas objects.

## Why is this bad?
In the Pandas API, `.notna` and `.notnull` are equivalent. For consistency,
prefer `.notna` over `.notnull`.

As a name, `.notna` more accurately reflects the behavior of the method,
since these methods check for `NaN` and `NaT` values in addition to `None`
values.

## Example
```python
import pandas as pd

animals_df = pd.read_csv("animals.csv")
pd.notnull(animals_df)
```

Use instead:
```python
import pandas as pd

animals_df = pd.read_csv("animals.csv")
pd.notna(animals_df)
```

## References
- [Pandas documentation: `notnull`](https://pandas.pydata.org/docs/reference/api/pandas.notnull.html#pandas.notnull)
- [Pandas documentation: `notna`](https://pandas.pydata.org/docs/reference/api/pandas.notna.html#pandas.notna)
## What it does
Checks for uses of `.ix` on Pandas objects.

## Why is this bad?
The `.ix` method is deprecated as its behavior is ambiguous. Specifically,
it's often unclear whether `.ix` is indexing by label or by ordinal position.

Instead, prefer the `.loc` method for label-based indexing, and `.iloc` for
ordinal indexing.

## Example
```python
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.ix[0]  # 0th row or row with label 0?
```

Use instead:
```python
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.iloc[0]  # 0th row.
```

## References
- [Pandas release notes: Deprecate `.ix`](https://pandas.pydata.org/pandas-docs/version/0.20/whatsnew.html#deprecate-ix)
- [Pandas documentation: `loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
- [Pandas documentation: `iloc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)
## What it does
Checks for uses of `.at` on Pandas objects.

## Why is this bad?
The `.at` method selects a single value from a `DataFrame` or Series based on
a label index, and is slightly faster than using `.loc`. However, `.loc` is
more idiomatic and versatile, as it can be used to select multiple values at
once.

If performance is an important consideration, convert the object to a NumPy
array, which will provide a much greater performance boost than using `.at`
over `.loc`.

## Example
```python
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.at["Maria"]
```

Use instead:
```python
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.loc["Maria"]
```

## References
- [Pandas documentation: `loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
- [Pandas documentation: `at`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.at.html)
## What it does
Checks for uses of `.iat` on Pandas objects.

## Why is this bad?
The `.iat` method selects a single value from a `DataFrame` or Series based
on an ordinal index, and is slightly faster than using `.iloc`. However,
`.iloc` is more idiomatic and versatile, as it can be used to select
multiple values at once.

If performance is an important consideration, convert the object to a NumPy
array, which will provide a much greater performance boost than using `.iat`
over `.iloc`.

## Example
```python
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.iat[0]
```

Use instead:
```python
```