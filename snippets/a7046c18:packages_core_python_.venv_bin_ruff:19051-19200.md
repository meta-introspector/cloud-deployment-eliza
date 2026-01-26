# a7046c18:packages_core_python_.venv_bin_ruff:19051-19200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19051-19200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- [Python documentation: `TarFile.extractall`](https://docs.python.org/3/library/tarfile.html#tarfile.TarFile.extractall)
- [Python documentation: Extraction filters](https://docs.python.org/3/library/tarfile.html#tarfile-extraction-filter)

[PEP 706]: https://peps.python.org/pep-0706/#backporting-forward-compatibility
## What it does
Checks for calls to `pickle` functions or modules that wrap them.

## Why is this bad?
Deserializing untrusted data with `pickle` and other deserialization
modules is insecure as it can allow for the creation of arbitrary objects,
which can then be used to achieve arbitrary code execution and otherwise
unexpected behavior.

Avoid deserializing untrusted data with `pickle` and other deserialization
modules. Instead, consider safer formats, such as JSON.

If you must deserialize untrusted data with `pickle`, consider signing the
data with a secret key and verifying the signature before deserializing the
payload, This will prevent an attacker from injecting arbitrary objects
into the serialized data.

In [preview], this rule will also flag references to `pickle` functions.

## Example
```python
import pickle

with open("foo.pickle", "rb") as file:
    foo = pickle.load(file)
```

Use instead:
```python
import json

with open("foo.json", "rb") as file:
    foo = json.load(file)
```

## References
- [Python documentation: `pickle` — Python object serialization](https://docs.python.org/3/library/pickle.html)
- [Common Weakness Enumeration: CWE-502](https://cwe.mitre.org/data/definitions/502.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for calls to `marshal` functions.

## Why is this bad?
Deserializing untrusted data with `marshal` is insecure, as it can allow for
the creation of arbitrary objects, which can then be used to achieve
arbitrary code execution and otherwise unexpected behavior.

Avoid deserializing untrusted data with `marshal`. Instead, consider safer
formats, such as JSON.

If you must deserialize untrusted data with `marshal`, consider signing the
data with a secret key and verifying the signature before deserializing the
payload. This will prevent an attacker from injecting arbitrary objects
into the serialized data.

In [preview], this rule will also flag references to `marshal` functions.

## Example
```python
import marshal

with open("foo.marshal", "rb") as file:
    foo = marshal.load(file)
```

Use instead:
```python
import json

with open("foo.json", "rb") as file:
    foo = json.load(file)
```

## References
- [Python documentation: `marshal` — Internal Python object serialization](https://docs.python.org/3/library/marshal.html)
- [Common Weakness Enumeration: CWE-502](https://cwe.mitre.org/data/definitions/502.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of weak or broken cryptographic hash functions.

## Why is this bad?
Weak or broken cryptographic hash functions may be susceptible to
collision attacks (where two different inputs produce the same hash) or
pre-image attacks (where an attacker can find an input that produces a
given hash). This can lead to security vulnerabilities in applications
that rely on these hash functions.

Avoid using weak or broken cryptographic hash functions in security
contexts. Instead, use a known secure hash function such as SHA-256.

In [preview], this rule will also flag references to insecure hash functions.

## Example
```python
from cryptography.hazmat.primitives import hashes

digest = hashes.Hash(hashes.MD5())
digest.update(b"Hello, world!")
digest.finalize()
```

Use instead:
```python
from cryptography.hazmat.primitives import hashes

digest = hashes.Hash(hashes.SHA256())
digest.update(b"Hello, world!")
digest.finalize()
```

## References
- [Python documentation: `hashlib` — Secure hashes and message digests](https://docs.python.org/3/library/hashlib.html)
- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)
- [Common Weakness Enumeration: CWE-328](https://cwe.mitre.org/data/definitions/328.html)
- [Common Weakness Enumeration: CWE-916](https://cwe.mitre.org/data/definitions/916.html)

[preview]: https://docs.astral.sh/ruff/preview/
## What it does
Checks for uses of weak or broken cryptographic ciphers.

## Why is this bad?
Weak or broken cryptographic ciphers may be susceptible to attacks that
allow an attacker to decrypt ciphertext without knowing the key or
otherwise compromise the security of the cipher, such as forgeries.

Use strong, modern cryptographic ciphers instead of weak or broken ones.

In [preview], this rule will also flag references to insecure ciphers.

## Example
```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms

algorithm = algorithms.ARC4(key)
cipher = Cipher(algorithm, mode=None)
encryptor = cipher.encryptor()
```

Use instead:
```python
from cryptography.fernet import Fernet

fernet = Fernet(key)
```
```