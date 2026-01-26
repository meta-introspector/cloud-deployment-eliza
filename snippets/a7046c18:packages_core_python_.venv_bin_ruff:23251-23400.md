# a7046c18:packages_core_python_.venv_bin_ruff:23251-23400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23251-23400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import datetime

datetime.datetime(2000, 1, 1, 0, 0, 0)
```

Use instead:
```python
import datetime

datetime.datetime(2000, 1, 1, 0, 0, 0, tzinfo=datetime.timezone.utc)
```

Or, on Python 3.11 and later:
```python
import datetime

datetime.datetime(2000, 1, 1, 0, 0, 0, tzinfo=datetime.UTC)
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for usage of `datetime.datetime.today()`.

## Why is this bad?
`datetime` objects are "naive" by default, in that they do not include
timezone information. "Naive" objects are easy to understand, but ignore
some aspects of reality, which can lead to subtle bugs. Timezone-aware
`datetime` objects are preferred, as they represent a specific moment in
time, unlike "naive" objects.

`datetime.datetime.today()` creates a "naive" object; instead, use
`datetime.datetime.now(tz=...)` to create a timezone-aware object.

## Example
```python
import datetime

datetime.datetime.today()
```

Use instead:
```python
import datetime

datetime.datetime.now(tz=datetime.timezone.utc)
```

Or, for Python 3.11 and later:
```python
import datetime

datetime.datetime.now(tz=datetime.UTC)
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for usage of `datetime.datetime.utcnow()`.

## Why is this bad?
Python datetime objects can be naive or timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.datetime.utcnow()` returns a naive datetime object; instead, use
`datetime.datetime.now(tz=...)` to create a timezone-aware object.

## Example
```python
import datetime

datetime.datetime.utcnow()
```

Use instead:
```python
import datetime

datetime.datetime.now(tz=datetime.timezone.utc)
```

Or, for Python 3.11 and later:
```python
import datetime

datetime.datetime.now(tz=datetime.UTC)
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for usage of `datetime.datetime.utcfromtimestamp()`.

## Why is this bad?
Python datetime objects can be naive or timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.datetime.utcfromtimestamp()` returns a naive datetime
object; instead, use `datetime.datetime.fromtimestamp(ts, tz=...)`
to create a timezone-aware object.

## Example
```python
import datetime

datetime.datetime.utcfromtimestamp(946684800)
```

Use instead:
```python
import datetime

datetime.datetime.fromtimestamp(946684800, tz=datetime.timezone.utc)
```

Or, on Python 3.11 and later:
```python
import datetime

datetime.datetime.fromtimestamp(946684800, tz=datetime.UTC)
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for usages of `datetime.datetime.now()` that do not specify a timezone.

## Why is this bad?
Python datetime objects can be naive or timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.datetime.now()` or `datetime.datetime.now(tz=None)` returns a naive
datetime object. Instead, use `datetime.datetime.now(tz=<timezone>)` to create
a timezone-aware object.

## Example
```python
import datetime

datetime.datetime.now()
```
```