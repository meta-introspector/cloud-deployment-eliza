# a7046c18:packages_core_rust_Cargo.lock:2251-2335

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:2251-2335
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[[package]]
name = "zerocopy"
version = "0.8.33"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "668f5168d10b9ee831de31933dc111a459c97ec93225beb307aed970d1372dfd"
dependencies = [
 "zerocopy-derive",
]

[[package]]
name = "zerocopy-derive"
version = "0.8.33"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2c7962b26b0a8685668b671ee4b54d007a67d4eaf05fda79ac0ecf41e32270f1"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "zerofrom"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "50cc42e0333e05660c3587f3bf9d0478688e15d870fab3346451ce7f8c9fbea5"
dependencies = [
 "zerofrom-derive",
]

[[package]]
name = "zerofrom-derive"
version = "0.1.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d71e5d6e06ab090c67b5e44993ec16b72dcbaabc526db883a360057678b48502"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
 "synstructure",
]

[[package]]
name = "zeroize"
version = "1.8.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b97154e67e32c85465826e8bcc1c59429aaaf107c1e4a9e53c8d8ccd5eff88d0"

[[package]]
name = "zerotrie"
version = "0.2.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2a59c17a5562d507e4b54960e8569ebee33bee890c70aa3fe7b97e85a9fd7851"
dependencies = [
 "displaydoc",
 "yoke",
 "zerofrom",
]

[[package]]
name = "zerovec"
version = "0.11.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c28719294829477f525be0186d13efa9a3c602f7ec202ca9e353d310fb9a002"
dependencies = [
 "yoke",
 "zerofrom",
 "zerovec-derive",
]

[[package]]
name = "zerovec-derive"
version = "0.11.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "eadce39539ca5cb3985590102671f2567e659fca9666581ad3411d59207951f3"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "zmij"
version = "1.0.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2fc5a66a20078bf1251bde995aa2fdcc4b800c70b5d92dd2c62abc5c60f679f8"
```