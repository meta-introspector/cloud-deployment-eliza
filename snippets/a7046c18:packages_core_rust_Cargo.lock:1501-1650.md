# a7046c18:packages_core_rust_Cargo.lock:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

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
 "whoami",
]

[[package]]
name = "sqlx-sqlite"
version = "0.7.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b244ef0a8414da0bed4bb1910426e890b19e5e9bccc27ada6b797d05c55ae0aa"
dependencies = [
 "atoi",
 "flume",
 "futures-channel",
 "futures-core",
 "futures-executor",
 "futures-intrusive",
 "futures-util",
 "libsqlite3-sys",
 "log",
 "percent-encoding",
 "serde",
 "sqlx-core",
 "tracing",
 "url",
 "urlencoding",
]

[[package]]
name = "stable_deref_trait"
version = "1.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6ce2be8dc25455e1f91df71bfa12ad37d7af1092ae736f3a6cd0e37bc7810596"

[[package]]
name = "stringprep"
version = "0.1.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7b4df3d392d81bd458a8a621b8bffbd2302a12ffe288a9d931670948749463b1"
dependencies = [
 "unicode-bidi",
 "unicode-normalization",
 "unicode-properties",
]

[[package]]
name = "strsim"
version = "0.11.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7da8b5736845d9f2fcb837ea5d9e2628564b3b043a70948a3f0b778838c5fb4f"

[[package]]
name = "subtle"
version = "2.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "13c2bddecc57b384dee18652358fb23172facb8a2c51ccc10d74c157bdea3292"

[[package]]
name = "syn"
version = "1.0.109"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72b64191b275b66ffe2469e8af2c1cfe3bafa67b529ead792a6d0160888b4237"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-ident",
]

[[package]]
name = "syn"
version = "2.0.114"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d4d107df263a3013ef9b1879b0df87d706ff80f65a86ea879bd9c31f9b307c2a"
dependencies = [
```