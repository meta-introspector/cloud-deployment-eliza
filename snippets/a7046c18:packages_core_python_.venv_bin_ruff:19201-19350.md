# a7046c18:packages_core_python_.venv_bin_ruff:19201-19350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19201-19350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## References
- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of weak or broken cryptographic cipher modes.

## Why is this bad?
Weak or broken cryptographic ciphers may be susceptible to attacks that
allow an attacker to decrypt ciphertext without knowing the key or
otherwise compromise the security of the cipher, such as forgeries.

Use strong, modern cryptographic ciphers instead of weak or broken ones.

In [preview], this rule will also flag references to insecure cipher modes.

## Example
```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

algorithm = algorithms.ARC4(key)
cipher = Cipher(algorithm, mode=modes.ECB(iv))
encryptor = cipher.encryptor()
```

Use instead:
```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

algorithm = algorithms.ARC4(key)
cipher = Cipher(algorithm, mode=modes.CTR(iv))
encryptor = cipher.encryptor()
```

## References
- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of `tempfile.mktemp`.

## Why is this bad?
`tempfile.mktemp` returns a pathname of a file that does not exist at the
time the call is made; then, the caller is responsible for creating the
file and subsequently using it. This is insecure because another process
could create a file with the same name between the time the function
returns and the time the caller creates the file.

`tempfile.mktemp` is deprecated in favor of `tempfile.mkstemp` which
creates the file when it is called. Consider using `tempfile.mkstemp`
instead, either directly or via a context manager such as
`tempfile.TemporaryFile`.

In [preview], this rule will also flag references to `tempfile.mktemp`.

## Example
```python
import tempfile

tmp_file = tempfile.mktemp()
with open(tmp_file, "w") as file:
    file.write("Hello, world!")
```

Use instead:
```python
import tempfile

with tempfile.TemporaryFile() as file:
    file.write("Hello, world!")
```

## References
- [Python documentation:`mktemp`](https://docs.python.org/3/library/tempfile.html#tempfile.mktemp)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of the builtin `eval()` function.

## Why is this bad?
The `eval()` function is insecure as it enables arbitrary code execution.

If you need to evaluate an expression from a string, consider using
`ast.literal_eval()` instead, which will raise an exception if the
expression is not a valid Python literal.

In [preview], this rule will also flag references to `eval`.

## Example
```python
x = eval(input("Enter a number: "))
```

Use instead:
```python
from ast import literal_eval

x = literal_eval(input("Enter a number: "))
```

## References
- [Python documentation: `eval`](https://docs.python.org/3/library/functions.html#eval)
- [Python documentation: `literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval)
- [_Eval really is dangerous_ by Ned Batchelder](https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of calls to `django.utils.safestring.mark_safe`.

## Why is this bad?
Cross-site scripting (XSS) vulnerabilities allow attackers to execute
arbitrary JavaScript. To guard against XSS attacks, Django templates
assumes that data is unsafe and automatically escapes malicious strings
before rending them.

`django.utils.safestring.mark_safe` marks a string as safe for use in HTML
templates, bypassing XSS protection. Its usage can be dangerous if the
contents of the string are dynamically generated, because it may allow
cross-site scripting attacks if the string is not properly escaped.

For dynamically generated strings, consider utilizing
`django.utils.html.format_html`.

In [preview], this rule will also flag references to `django.utils.safestring.mark_safe`.

## Example
```python
from django.utils.safestring import mark_safe


def render_username(username):
    return mark_safe(f"<i>{username}</i>")  # Dangerous if username is user-provided.
```

Use instead:
```python
from django.utils.html import format_html


def render_username(username):
    return format_html("<i>{}</i>", username)  # username is escaped.
```

## References
- [Django documentation: `mark_safe`](https://docs.djangoproject.com/en/dev/ref/utils/#django.utils.safestring.mark_safe)
- [Django documentation: Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/dev/topics/security/#cross-site-scripting-xss-protection)
- [Common Weakness Enumeration: CWE-80](https://cwe.mitre.org/data/definitions/80.html)

[preview]: https://docs.astral.sh/ruff/preview/
```