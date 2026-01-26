# a7046c18:packages_core_python_.venv_bin_ruff:20101-20250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/.venv/bin/ruff:20101-20250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import ssl


def func(version=ssl.PROTOCOL_TLSv1_2): ...
```
## What it does
Checks for calls to `ssl.wrap_socket()` without an `ssl_version`.

## Why is this bad?
This method is known to provide a default value that maximizes
compatibility, but permits use of insecure protocols.

## Example
```python
import ssl

ssl.wrap_socket()
```

Use instead:
```python
import ssl

ssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1_2)
```
## What it does
Checks for uses of cryptographic keys with vulnerable key sizes.

## Why is this bad?
Small keys are easily breakable. For DSA and RSA, keys should be at least
2048 bits long. For EC, keys should be at least 224 bits long.

## Example
```python
from cryptography.hazmat.primitives.asymmetric import dsa, ec

dsa.generate_private_key(key_size=512)
ec.generate_private_key(curve=ec.SECT163K1())
```

Use instead:
```python
from cryptography.hazmat.primitives.asymmetric import dsa, ec

dsa.generate_private_key(key_size=4096)
ec.generate_private_key(curve=ec.SECP384R1())
```

## References
- [CSRC: Transitioning the Use of Cryptographic Algorithms and Key Lengths](https://csrc.nist.gov/pubs/sp/800/131/a/r2/final)
## What it does
Checks for uses of the `yaml.load` function.

## Why is this bad?
Running the `yaml.load` function over untrusted YAML files is insecure, as
`yaml.load` allows for the creation of arbitrary Python objects, which can
then be used to execute arbitrary code.

Instead, consider using `yaml.safe_load`, which allows for the creation of
simple Python objects like integers and lists, but prohibits the creation of
more complex objects like functions and classes.

## Example
```python
import yaml

yaml.load(untrusted_yaml)
```

Use instead:
```python
import yaml

yaml.safe_load(untrusted_yaml)
```

## References
- [PyYAML documentation: Loading YAML](https://pyyaml.org/wiki/PyYAMLDocumentation)
- [Common Weakness Enumeration: CWE-20](https://cwe.mitre.org/data/definitions/20.html)
## What it does
Checks for uses of policies disabling SSH verification in Paramiko.

## Why is this bad?
By default, Paramiko checks the identity of the remote host when establishing
an SSH connection. Disabling the verification might lead to the client
connecting to a malicious host, without the client knowing.

## Example
```python
from paramiko import client

ssh_client = client.SSHClient()
ssh_client.set_missing_host_key_policy(client.AutoAddPolicy)
```

Use instead:
```python
from paramiko import client

ssh_client = client.SSHClient()
ssh_client.set_missing_host_key_policy(client.RejectPolicy)
```

## References
- [Paramiko documentation: set_missing_host_key_policy](https://docs.paramiko.org/en/latest/api/client.html#paramiko.client.SSHClient.set_missing_host_key_policy)
## What it does
Checks for uses of SNMPv1 or SNMPv2.

## Why is this bad?
The SNMPv1 and SNMPv2 protocols are considered insecure as they do
not support encryption. Instead, prefer SNMPv3, which supports
encryption.

## Example
```python
from pysnmp.hlapi import CommunityData

CommunityData("public", mpModel=0)
```

Use instead:
```python
from pysnmp.hlapi import CommunityData

CommunityData("public", mpModel=2)
```

## References
- [Cybersecurity and Infrastructure Security Agency (CISA): Alert TA17-156A](https://www.cisa.gov/news-events/alerts/2017/06/05/reducing-risk-snmp-abuse)
- [Common Weakness Enumeration: CWE-319](https://cwe.mitre.org/data/definitions/319.html)
## What it does
Checks for uses of the SNMPv3 protocol without encryption.

## Why is this bad?
Unencrypted SNMPv3 communication can be intercepted and read by
unauthorized parties. Instead, enable encryption when using SNMPv3.

## Example
```python
from pysnmp.hlapi import UsmUserData

UsmUserData("user")
```

Use instead:
```python
from pysnmp.hlapi import UsmUserData

UsmUserData("user", "authkey", "privkey")
```
```