# a7046c18:packages_core_python_.venv_bin_ruff:23551-23700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23551-23700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Example
```python
import datetime

datetime.date.fromtimestamp(946684800)
```

Use instead:
```python
import datetime

datetime.datetime.fromtimestamp(946684800, tz=datetime.timezone.utc).date()
```

Or, for Python 3.11 and later:
```python
import datetime

datetime.datetime.fromtimestamp(946684800, tz=datetime.UTC).date()
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for uses of `datetime.datetime.min` and `datetime.datetime.max`.

## Why is this bad?
`datetime.min` and `datetime.max` are non-timezone-aware datetime objects.

As such, operations on `datetime.min` and `datetime.max` may behave
unexpectedly, as in:

```python
import datetime

# Timezone: UTC-14
datetime.datetime.min.timestamp()  # ValueError: year 0 is out of range
datetime.datetime.max.timestamp()  # ValueError: year 10000 is out of range
```

## Example
```python
import datetime

datetime.datetime.max
```

Use instead:
```python
import datetime

datetime.datetime.max.replace(tzinfo=datetime.UTC)
```

## References
- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
## What it does
Checks for the presence of debugger calls and imports.

## Why is this bad?
Debugger calls and imports should be used for debugging purposes only. The
presence of a debugger call or import in production code is likely a
mistake and may cause unintended behavior, such as exposing sensitive
information or causing the program to hang.

Instead, consider using a logging library to log information about the
program's state, and writing tests to verify that the program behaves
as expected.

## Example
```python
def foo():
    breakpoint()
```

## References
- [Python documentation: `pdb` — The Python Debugger](https://docs.python.org/3/library/pdb.html)
- [Python documentation: `logging` — Logging facility for Python](https://docs.python.org/3/library/logging.html)
## What it does
Checks nullable string-based fields (like `CharField` and `TextField`)
in Django models.

## Why is this bad?
If a string-based field is nullable, then your model will have two possible
representations for "no data": `None` and the empty string. This can lead to
confusion, as clients of the API have to check for both `None` and the
empty string when trying to determine if the field has data.

The Django convention is to use the empty string in lieu of `None` for
string-based fields.

## Example
```python
from django.db import models


class MyModel(models.Model):
    field = models.CharField(max_length=255, null=True)
```

Use instead:
```python
from django.db import models


class MyModel(models.Model):
    field = models.CharField(max_length=255, default="")
```
## What it does
Checks for the use of `locals()` in `render` functions.

## Why is this bad?
Using `locals()` can expose internal variables or other unintentional
data to the rendered template.

## Example
```python
from django.shortcuts import render


def index(request):
    posts = Post.objects.all()
    return render(request, "app/index.html", locals())
```

Use instead:
```python
from django.shortcuts import render


def index(request):
    posts = Post.objects.all()
    context = {"posts": posts}
    return render(request, "app/index.html", context)
```
## What it does
Checks for the use of `exclude` in Django `ModelForm` classes.

## Why is this bad?
If a `ModelForm` includes the `exclude` attribute, any new field that
is added to the model will automatically be exposed for modification.

## Example
```python
from django.forms import ModelForm


class PostForm(ModelForm):
    class Meta:
        model = Post
```