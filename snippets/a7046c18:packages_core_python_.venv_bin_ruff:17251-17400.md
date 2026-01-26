# a7046c18:packages_core_python_.venv_bin_ruff:17251-17400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:17251-17400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
values. Some have more modern replacements. Others are considered too niche
and not worth continued maintenance in Airflow.

## Example
```python
from airflow.utils.dates import days_ago


yesterday = days_ago(today, 1)
```

Use instead:
```python
from datetime import timedelta


yesterday = today - timedelta(days=1)
```
## What it does
Checks for uses of Airflow functions and values that have been moved to its providers
(e.g., `apache-airflow-providers-fab`).

## Why is this bad?
Airflow 3.0 moved various deprecated functions, members, and other
values to its providers. The user needs to install the corresponding provider and replace
the original usage with the one in the provider.

## Example
```python
from airflow.auth.managers.fab.fab_auth_manager import FabAuthManager

fab_auth_manager_app = FabAuthManager().get_fastapi_app()
```

Use instead:
```python
from airflow.providers.fab.auth_manager.fab_auth_manager import FabAuthManager

fab_auth_manager_app = FabAuthManager().get_fastapi_app()
```
## What it does
Checks for Airflow function calls that will raise a runtime error in Airflow 3.0
due to function signature changes, such as functions that changed to accept only
keyword arguments, parameter reordering, or parameter type changes.

## Why is this bad?
Airflow 3.0 introduces changes to function signatures. Code that
worked in Airflow 2.x will raise a runtime error if not updated in Airflow
3.0.

## Example
```python
from airflow.lineage.hook import HookLineageCollector

collector = HookLineageCollector()
# Passing positional arguments will raise a runtime error in Airflow 3.0
collector.create_asset("s3://bucket/key")
```

Use instead:
```python
from airflow.lineage.hook import HookLineageCollector

collector = HookLineageCollector()
# Passing arguments as keyword arguments instead of positional arguments
collector.create_asset(uri="s3://bucket/key")
```
## What it does
Checks for uses of deprecated Airflow functions and values that still have
a compatibility layer.

## Why is this bad?
Airflow 3.0 removed various deprecated functions, members, and other
values. Some have more modern replacements. Others are considered too niche
and not worth continued maintenance in Airflow.
Even though these symbols still work fine on Airflow 3.0, they are expected to be removed in a future version.
Where available, users should replace the removed functionality with the new alternatives.

## Example
```python
from airflow import Dataset


Dataset(uri="test://test/")
```

Use instead:
```python
from airflow.sdk import Asset


Asset(uri="test://test/")
```
## What it does
Checks for uses of Airflow functions and values that have been moved to its providers
but still have a compatibility layer (e.g., `apache-airflow-providers-standard`).

## Why is this bad?
Airflow 3.0 moved various deprecated functions, members, and other
values to its providers. Even though these symbols still work fine on Airflow 3.0,
they are expected to be removed in a future version. The user is suggested to install
the corresponding provider and replace the original usage with the one in the provider.

## Example
```python
from airflow.operators.python import PythonOperator


def print_context(ds=None, **kwargs):
    print(kwargs)
    print(ds)


print_the_context = PythonOperator(
    task_id="print_the_context", python_callable=print_context
)
```

Use instead:
```python
from airflow.providers.standard.operators.python import PythonOperator


def print_context(ds=None, **kwargs):
    print(kwargs)
    print(ds)


print_the_context = PythonOperator(
    task_id="print_the_context", python_callable=print_context
)
```
## What it does
Checks for commented-out Python code.

## Why is this bad?
Commented-out code is dead code, and is often included inadvertently.
It should be removed.

## Known problems
Prone to false positives when checking comments that resemble Python code,
but are not actually Python code ([#4845]).

## Example
```python
# print("Hello, world!")
```

## Options
- `lint.task-tags`
```