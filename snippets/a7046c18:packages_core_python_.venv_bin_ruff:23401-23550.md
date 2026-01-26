# a7046c18:packages_core_python_.venv_bin_ruff:23401-23550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23401-23550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

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
Checks for usage of `datetime.datetime.fromtimestamp()` that do not specify
a timezone.

## Why is this bad?
Python datetime objects can be naive or timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.datetime.fromtimestamp(ts)` or
`datetime.datetime.fromtimestampe(ts, tz=None)` returns a naive datetime
object. Instead, use `datetime.datetime.fromtimestamp(ts, tz=<timezone>)`
to create a timezone-aware object.

## Example
```python
import datetime

datetime.datetime.fromtimestamp(946684800)
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
Checks for uses of `datetime.datetime.strptime()` that lead to naive
datetime objects.

## Why is this bad?
Python datetime objects can be naive or timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.datetime.strptime()` without `%z` returns a naive datetime
object. Follow it with `.replace(tzinfo=<timezone>)` or `.astimezone()`.

## Example
```python
import datetime

datetime.datetime.strptime("2022/01/31", "%Y/%m/%d")
```

Instead, use `.replace(tzinfo=<timezone>)`:
```python
import datetime

datetime.datetime.strptime("2022/01/31", "%Y/%m/%d").replace(
    tzinfo=datetime.timezone.utc
)
```

Or, use `.astimezone()`:
```python
import datetime

datetime.datetime.strptime("2022/01/31", "%Y/%m/%d").astimezone(datetime.timezone.utc)
```

On Python 3.11 and later, `datetime.timezone.utc` can be replaced with
`datetime.UTC`.

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
- [Python documentation: `strftime()` and `strptime()` Behavior](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior)
## What it does
Checks for usage of `datetime.date.today()`.

## Why is this bad?
Python date objects are naive, that is, not timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.date.today` returns a naive date object without taking timezones
into account. Instead, use `datetime.datetime.now(tz=...).date()` to
create a timezone-aware object and retrieve its date component.

## Example
```python
import datetime

datetime.date.today()
```

Use instead:
```python
import datetime

datetime.datetime.now(tz=datetime.timezone.utc).date()
```

Or, for Python 3.11 and later:
```python
import datetime

datetime.datetime.now(tz=datetime.UTC).date()
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for usage of `datetime.date.fromtimestamp()`.

## Why is this bad?
Python date objects are naive, that is, not timezone-aware. While an aware
object represents a specific moment in time, a naive object does not
contain enough information to unambiguously locate itself relative to other
datetime objects. Since this can lead to errors, it is recommended to
always use timezone-aware objects.

`datetime.date.fromtimestamp(ts)` returns a naive date object.
Instead, use `datetime.datetime.fromtimestamp(ts, tz=...).date()` to
create a timezone-aware datetime object and retrieve its date component.

```