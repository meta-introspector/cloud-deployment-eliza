# a7046c18:packages_core_python_.venv_bin_ruff:17401-17550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:17401-17550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

[#4845]: https://github.com/astral-sh/ruff/issues/4845
## What it does
Checks for FastAPI routes that use the optional `response_model` parameter
with the same type as the return type.

## Why is this bad?
FastAPI routes automatically infer the response model type from the return
type, so specifying it explicitly is redundant.

The `response_model` parameter is used to override the default response
model type. For example, `response_model` can be used to specify that
a non-serializable response type should instead be serialized via an
alternative type.

For more information, see the [FastAPI documentation](https://fastapi.tiangolo.com/tutorial/response-model/).

## Example

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str


@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Item:
    return item
```

Use instead:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str


@app.post("/items/")
async def create_item(item: Item) -> Item:
    return item
```
## What it does
Identifies FastAPI routes with deprecated uses of `Depends` or similar.

## Why is this bad?
The [FastAPI documentation] recommends the use of [`typing.Annotated`][typing-annotated]
for defining route dependencies and parameters, rather than using `Depends`,
`Query` or similar as a default value for a parameter. Using this approach
everywhere helps ensure consistency and clarity in defining dependencies
and parameters.

`Annotated` was added to the `typing` module in Python 3.9; however,
the third-party [`typing_extensions`][typing-extensions] package
provides a backport that can be used on older versions of Python.

## Example

```python
from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: dict = Depends(common_parameters)):
    return commons
```

Use instead:

```python
from typing import Annotated

from fastapi import Depends, FastAPI

app = FastAPI()


async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}


@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

## Fix safety
This fix is always unsafe, as adding/removing/changing a function parameter's
default value can change runtime behavior. Additionally, comments inside the
deprecated uses might be removed.

## Availability

Because this rule relies on the third-party `typing_extensions` module for Python versions
before 3.9, if the target version is < 3.9 and `typing_extensions` imports have been
disabled by the [`lint.typing-extensions`] linter option the diagnostic will not be emitted
and no fix will be offered.

## Options

- `lint.typing-extensions`

[FastAPI documentation]: https://fastapi.tiangolo.com/tutorial/query-params-str-validations/?h=annotated#advantages-of-annotated
[typing-annotated]: https://docs.python.org/3/library/typing.html#typing.Annotated
[typing-extensions]: https://typing-extensions.readthedocs.io/en/stable/
## What it does
Identifies FastAPI routes that declare path parameters in the route path
that are not included in the function signature.

## Why is this bad?
Path parameters are used to extract values from the URL path.

If a path parameter is declared in the route path but not in the function
signature, it will not be accessible in the function body, which is likely
a mistake.

If a path parameter is declared in the route path, but as a positional-only
argument in the function signature, it will also not be accessible in the
function body, as FastAPI will not inject the parameter.

## Known problems
If the path parameter is _not_ a valid Python identifier (e.g., `user-id`, as
opposed to `user_id`), FastAPI will normalize it. However, this rule simply
ignores such path parameters, as FastAPI's normalization behavior is undocumented.

## Example

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/things/{thing_id}")
```