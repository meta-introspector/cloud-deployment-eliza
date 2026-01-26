# a7046c18:packages_plugin-sql_rust_Cargo.lock:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 "futures-util",
 "hashlink",
 "hex",
 "indexmap",
 "log",
 "memchr",
 "once_cell",
 "paste",
 "percent-encoding",
 "serde",
 "serde_json",
 "sha2",
 "smallvec",
 "sqlformat",
 "thiserror 1.0.69",
 "tokio",
 "tokio-stream",
 "tracing",
 "url",
 "uuid",
]

[[package]]
name = "sqlx-macros"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4ea40e2345eb2faa9e1e5e326db8c34711317d2b5e08d0d5741619048a803127"
dependencies = [
 "proc-macro2",
 "quote",
 "sqlx-core",
 "sqlx-macros-core",
 "syn 1.0.109",
]

[[package]]
name = "sqlx-macros-core"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5833ef53aaa16d860e92123292f1f6a3d53c34ba8b1969f152ef1a7bb803f3c8"
dependencies = [
 "dotenvy",
 "either",
 "heck",
 "hex",
 "once_cell",
 "proc-macro2",
 "quote",
 "serde",
 "serde_json",
 "sha2",
 "sqlx-core",
 "sqlx-mysql",
 "sqlx-postgres",
 "sqlx-sqlite",
 "syn 1.0.109",
 "tempfile",
 "tokio",
 "url",
]

[[package]]
name = "sqlx-mysql"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1ed31390216d20e538e447a7a9b959e06ed9fc51c37b514b46eb758016ecd418"
dependencies = [
 "atoi",
 "base64",
 "bitflags",
 "byteorder",
 "bytes",
 "chrono",
 "crc",
 "digest",
 "dotenvy",
 "either",
 "futures-channel",
 "futures-core",
 "futures-io",
 "futures-util",
 "generic-array",
 "hex",
 "hkdf",
 "hmac",
 "itoa",
 "log",
 "md-5",
 "memchr",
 "once_cell",
 "percent-encoding",
 "rand",
 "rsa",
 "serde",
 "sha1",
 "sha2",
 "smallvec",
 "sqlx-core",
 "stringprep",
 "thiserror 1.0.69",
 "tracing",
 "uuid",
 "whoami",
]

[[package]]
name = "sqlx-postgres"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7c824eb80b894f926f89a0b9da0c7f435d27cdd35b8c655b114e58223918577e"
dependencies = [
 "atoi",
 "base64",
 "bitflags",
 "byteorder",
 "chrono",
 "crc",
 "dotenvy",
 "etcetera",
 "futures-channel",
 "futures-core",
 "futures-io",
 "futures-util",
 "hex",
 "hkdf",
 "hmac",
 "home",
 "itoa",
 "log",
 "md-5",
 "memchr",
 "once_cell",
 "rand",
 "serde",
 "serde_json",
 "sha2",
 "smallvec",
 "sqlx-core",
 "stringprep",
 "thiserror 1.0.69",
 "tracing",
 "uuid",
 "whoami",
]

[[package]]
name = "sqlx-sqlite"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b244ef0a8414da0bed4bb1910426e890b19e5e9bccc27ada6b797d05c55ae0aa"
```