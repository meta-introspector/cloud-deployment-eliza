# a7046c18:packages_core_rust_Cargo.lock:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 "futures-task",
 "futures-util",
]

[[package]]
name = "futures-intrusive"
version = "0.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1d930c203dd0b6ff06e0201a4a2fe9149b43c684fd4420555b26d21b1a02956f"
dependencies = [
 "futures-core",
 "lock_api",
 "parking_lot",
]

[[package]]
name = "futures-io"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9e5c1b78ca4aae1ac06c48a526a655760685149f0d465d21f37abfe57ce075c6"

[[package]]
name = "futures-macro"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "162ee34ebcb7c64a8abebc059ce0fee27c2262618d7b60ed8faf72fef13c3650"
dependencies = [
 "proc-macro2",
 "quote",
 "syn 2.0.114",
]

[[package]]
name = "futures-sink"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e575fab7d1e0dcb8d0c7bcf9a63ee213816ab51902e6d244a95819acacf1d4f7"

[[package]]
name = "futures-task"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f90f7dce0722e95104fcb095585910c0977252f286e354b5e3bd38902cd99988"

[[package]]
name = "futures-util"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9fa08315bb612088cc391249efdc3bc77536f16c91f6cf495e6fbe85b20a4a81"
dependencies = [
 "futures-channel",
 "futures-core",
 "futures-io",
 "futures-macro",
 "futures-sink",
 "futures-task",
 "memchr",
 "pin-project-lite",
 "pin-utils",
 "slab",
]

[[package]]
name = "generic-array"
version = "0.14.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "85649ca51fd72272d7821adaf274ad91c288277713d9c18820d8499a7ff69e9a"
dependencies = [
 "typenum",
 "version_check",
]

[[package]]
name = "getrandom"
version = "0.2.16"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "335ff9f135e4384c8150d6f27c6daed433577f86b4750418338c01a1a2528592"
dependencies = [
 "cfg-if",
 "js-sys",
 "libc",
 "wasi",
 "wasm-bindgen",
]

[[package]]
name = "getrandom"
version = "0.3.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "899def5c37c4fd7b2664648c28120ecec138e4d395b459e5ca34f9cce2dd77fd"
dependencies = [
 "cfg-if",
 "libc",
 "r-efi",
 "wasip2",
]

[[package]]
name = "handlebars"
version = "6.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9b3f9296c208515b87bd915a2f5d1163d4b3f863ba83337d7713cf478055948e"
dependencies = [
 "derive_builder",
 "log",
 "num-order",
 "pest",
 "pest_derive",
 "serde",
 "serde_json",
 "thiserror 2.0.17",
]

[[package]]
name = "hashbrown"
version = "0.14.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e5274423e17b7c9fc20b6e7e208532f9b19825d82dfd615708b70edd83df41f1"
dependencies = [
 "ahash",
 "allocator-api2",
]

[[package]]
name = "hashbrown"
version = "0.16.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "841d1cc9bed7f9236f321df977030373f4a4163ae1a7dbfe1a51a2c1a51d9100"

[[package]]
name = "hashlink"
version = "0.8.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e8094feaf31ff591f651a2664fb9cfd92bba7a60ce3197265e9482ebe753c8f7"
dependencies = [
 "hashbrown 0.14.5",
]

[[package]]
name = "heck"
version = "0.4.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "95505c38b4572b2d910cecb0281560f54b440a19336cbbcb27bf6ce6adc6f5a8"
dependencies = [
 "unicode-segmentation",
]

[[package]]
name = "hex"
version = "0.4.3"
```