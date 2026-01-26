# a7046c18:packages_core_python_.venv_bin_ruff:19951-20100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:19951-20100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## What it does
Checks for imports of the `lxml` module.

## Why is this bad?
Using various methods from the `lxml` module to parse untrusted XML data is
known to be vulnerable to XML attacks. Replace vulnerable imports with the
equivalent `defusedxml` package.

## Example
```python
import lxml
```

[deprecated]: https://github.com/tiran/defusedxml/blob/c7445887f5e1bcea470a16f61369d29870cfcfe1/README.md#defusedxmllxml
## What it does
Checks for imports of the `xmlrpc` module.

## Why is this bad?
XMLRPC is a particularly dangerous XML module, as it is also concerned with
communicating data over a network. Use the `defused.xmlrpc.monkey_patch()`
function to monkey-patch the `xmlrpclib` module and mitigate remote XML
attacks.

## Example
```python
import xmlrpc
```
## What it does
Checks for imports of `wsgiref.handlers.CGIHandler` and
`twisted.web.twcgi.CGIScript`.

## Why is this bad?
httpoxy is a set of vulnerabilities that affect application code running in
CGI or CGI-like environments. The use of CGI for web applications should be
avoided to prevent this class of attack.

## Example
```python
from wsgiref.handlers import CGIHandler
```

## References
- [httpoxy website](https://httpoxy.org/)
## What it does
Checks for imports of several unsafe cryptography modules.

## Why is this bad?
The `pycrypto` library is known to have a publicly disclosed buffer
overflow vulnerability. It is no longer actively maintained and has been
deprecated in favor of the `pyca/cryptography` library.

## Example
```python
import Crypto.Random
```

## References
- [Buffer Overflow Issue](https://github.com/pycrypto/pycrypto/issues/176)
## What it does
Checks for imports of the `pyghmi` module.

## Why is this bad?
`pyghmi` is an IPMI-related module, but IPMI is considered insecure.
Instead, use an encrypted protocol.

## Example
```python
import pyghmi
```

## References
- [Buffer Overflow Issue](https://github.com/pycrypto/pycrypto/issues/176)
## What it does
Checks for HTTPS requests that disable SSL certificate checks.

## Why is this bad?
If SSL certificates are not verified, an attacker could perform a "man in
the middle" attack by intercepting and modifying traffic between the client
and server.

## Example
```python
import requests

requests.get("https://www.example.com", verify=False)
```

Use instead:
```python
import requests

requests.get("https://www.example.com")  # By default, `verify=True`.
```

## References
- [Common Weakness Enumeration: CWE-295](https://cwe.mitre.org/data/definitions/295.html)
## What it does
Checks for function calls with parameters that indicate the use of insecure
SSL and TLS protocol versions.

## Why is this bad?
Several highly publicized exploitable flaws have been discovered in all
versions of SSL and early versions of TLS. The following versions are
considered insecure, and should be avoided:
- SSL v2
- SSL v3
- TLS v1
- TLS v1.1

This method supports detection on the Python's built-in `ssl` module and
the `pyOpenSSL` module.

## Example
```python
import ssl

ssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1)
```

Use instead:
```python
import ssl

ssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1_2)
```
## What it does
Checks for function definitions with default arguments set to insecure SSL
and TLS protocol versions.

## Why is this bad?
Several highly publicized exploitable flaws have been discovered in all
versions of SSL and early versions of TLS. The following versions are
considered insecure, and should be avoided:
- SSL v2
- SSL v3
- TLS v1
- TLS v1.1

## Example

```python
import ssl


def func(version=ssl.PROTOCOL_TLSv1): ...
```

Use instead:

```python
```