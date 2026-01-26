# a7046c18:packages_core_python_.venv_bin_ruff:23701-23850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:23701-23850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        exclude = ["author"]
```

Use instead:
```python
from django.forms import ModelForm


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "content"]
```
## What it does
Checks for the use of `fields = "__all__"` in Django `ModelForm`
classes.

## Why is this bad?
If a `ModelForm` includes the `fields = "__all__"` attribute, any new
field that is added to the model will automatically be exposed for
modification.

## Example
```python
from django.forms import ModelForm


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = "__all__"
```

Use instead:
```python
from django.forms import ModelForm


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "content"]
```
## What it does
Checks that a `__str__` method is defined in Django models.

## Why is this bad?
Django models should define a `__str__` method to return a string representation
of the model instance, as Django calls this method to display the object in
the Django Admin and elsewhere.

Models without a `__str__` method will display a non-meaningful representation
of the object in the Django Admin.

## Example
```python
from django.db import models


class MyModel(models.Model):
    field = models.CharField(max_length=255)
```

Use instead:
```python
from django.db import models


class MyModel(models.Model):
    field = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.field}"
```
## What it does
Checks for the order of Model's inner classes, methods, and fields as per
the [Django Style Guide].

## Why is this bad?
The [Django Style Guide] specifies that the order of Model inner classes,
attributes and methods should be as follows:

1. All database fields
2. Custom manager attributes
3. `class Meta`
4. `def __str__()`
5. `def save()`
6. `def get_absolute_url()`
7. Any custom methods

## Example
```python
from django.db import models


class StrBeforeFieldModel(models.Model):
    class Meta:
        verbose_name = "test"
        verbose_name_plural = "tests"

    def __str__(self):
        return "foobar"

    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=40)
```

Use instead:
```python
from django.db import models


class StrBeforeFieldModel(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=40)

    class Meta:
        verbose_name = "test"
        verbose_name_plural = "tests"

    def __str__(self):
        return "foobar"
```

[Django Style Guide]: https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style
## What it does
Checks that Django's `@receiver` decorator is listed first, prior to
any other decorators.

## Why is this bad?
Django's `@receiver` decorator is special in that it does not return
a wrapped function. Rather, `@receiver` connects the decorated function
to a signal. If any other decorators are listed before `@receiver`,
the decorated function will not be connected to the signal.

## Example
```python
from django.dispatch import receiver
from django.db.models.signals import post_save


@transaction.atomic
@receiver(post_save, sender=MyModel)
def my_handler(sender, instance, created, **kwargs):
    pass
```

Use instead:
```python
from django.dispatch import receiver
```