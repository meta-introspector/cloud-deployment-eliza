# a7046c18:packages_core_python_.venv_bin_ruff:33151-33300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:33151-33300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.iloc[0]
```

Or, using NumPy:
```python
import numpy as np
import pandas as pd

students_df = pd.read_csv("students.csv")
students_df.to_numpy()[0]
```

## References
- [Pandas documentation: `iloc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)
- [Pandas documentation: `iat`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iat.html)
## What it does
Checks for uses of `.pivot` or `.unstack` on Pandas objects.

## Why is this bad?
Prefer `.pivot_table` to `.pivot` or `.unstack`. `.pivot_table` is more general
and can be used to implement the same behavior as `.pivot` and `.unstack`.

## Example
```python
import pandas as pd

df = pd.read_csv("cities.csv")
df.pivot(index="city", columns="year", values="population")
```

Use instead:
```python
import pandas as pd

df = pd.read_csv("cities.csv")
df.pivot_table(index="city", columns="year", values="population")
```

## References
- [Pandas documentation: Reshaping and pivot tables](https://pandas.pydata.org/docs/user_guide/reshaping.html)
- [Pandas documentation: `pivot_table`](https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html#pandas.pivot_table)
## What it does
Checks for uses of `.values` on Pandas Series and Index objects.

## Why is this bad?
The `.values` attribute is ambiguous as its return type is unclear. As
such, it is no longer recommended by the Pandas documentation.

Instead, use `.to_numpy()` to return a NumPy array, or `.array` to return a
Pandas `ExtensionArray`.

## Example
```python
import pandas as pd

animals = pd.read_csv("animals.csv").values  # Ambiguous.
```

Use instead:
```python
import pandas as pd

animals = pd.read_csv("animals.csv").to_numpy()  # Explicit.
```

## References
- [Pandas documentation: Accessing the values in a Series or Index](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.24.0.html#accessing-the-values-in-a-series-or-index)
## What it does
Checks for uses of `pd.read_table` to read CSV files.

## Why is this bad?
In the Pandas API, `pd.read_csv` and `pd.read_table` are equivalent apart
from their default separator: `pd.read_csv` defaults to a comma (`,`),
while `pd.read_table` defaults to a tab (`\t`) as the default separator.

Prefer `pd.read_csv` over `pd.read_table` when reading comma-separated
data (like CSV files), as it is more idiomatic.

## Example
```python
import pandas as pd

cities_df = pd.read_table("cities.csv", sep=",")
```

Use instead:
```python
import pandas as pd

cities_df = pd.read_csv("cities.csv")
```

## References
- [Pandas documentation: `read_csv`](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html#pandas.read_csv)
- [Pandas documentation: `read_table`](https://pandas.pydata.org/docs/reference/api/pandas.read_table.html#pandas.read_table)
## What it does
Checks for uses of `.stack` on Pandas objects.

## Why is this bad?
Prefer `.melt` to `.stack`, which has the same functionality but with
support for direct column renaming and no dependence on `MultiIndex`.

## Example
```python
import pandas as pd

cities_df = pd.read_csv("cities.csv")
cities_df.set_index("city").stack()
```

Use instead:
```python
import pandas as pd

cities_df = pd.read_csv("cities.csv")
cities_df.melt(id_vars="city")
```

## References
- [Pandas documentation: `melt`](https://pandas.pydata.org/docs/reference/api/pandas.melt.html)
- [Pandas documentation: `stack`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.stack.html)
## What it does
Checks for uses of `pd.merge` on Pandas objects.

## Why is this bad?
In Pandas, the `.merge` method (exposed on, e.g., `DataFrame` objects) and
the `pd.merge` function (exposed on the Pandas module) are equivalent.

For consistency, prefer calling `.merge` on an object over calling
`pd.merge` on the Pandas module, as the former is more idiomatic.

Further, `pd.merge` is not a method, but a function, which prohibits it
from being used in method chains, a common pattern in Pandas code.

## Example
```python
import pandas as pd

cats_df = pd.read_csv("cats.csv")
dogs_df = pd.read_csv("dogs.csv")
rabbits_df = pd.read_csv("rabbits.csv")
pets_df = pd.merge(pd.merge(cats_df, dogs_df), rabbits_df)  # Hard to read.
```

Use instead:
```python
import pandas as pd
```