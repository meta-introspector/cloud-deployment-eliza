# a7046c18:packages_plugin-sql_rust_Cargo.lock:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/Cargo.lock:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7f24254aa9a54b5c858eaee2f5bccdb46aaf0e486a595ed5fd8f86ba55232a70"

[[package]]
name = "hkdf"
version = "0.12.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7b5f8eb2ad728638ea2c7d47a21db23b7b58a72ed6a38256b8a1849f15fbbdf7"
dependencies = [
 "hmac",
]

[[package]]
name = "hmac"
version = "0.12.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6c49c37c09c17a53d937dfbb742eb3a961d65a994e6bcdcf37e7399d0cc8ab5e"
dependencies = [
 "digest",
]

[[package]]
name = "home"
version = "0.5.12"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cc627f471c528ff0c4a49e1d5e60450c8f6461dd6d10ba9dcd3a61d3dff7728d"
dependencies = [
 "windows-sys 0.61.2",
]

[[package]]
name = "iana-time-zone"
version = "0.1.64"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "33e57f83510bb73707521ebaffa789ec8caf86f9657cad665b092b581d40e9fb"
dependencies = [
 "android_system_properties",
 "core-foundation-sys",
 "iana-time-zone-haiku",
 "js-sys",
 "log",
 "wasm-bindgen",
 "windows-core",
]

[[package]]
name = "iana-time-zone-haiku"
version = "0.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "f31827a206f56af32e590ba56d5d2d085f558508192593743f16b2306495269f"
dependencies = [
 "cc",
]

[[package]]
name = "icu_collections"
version = "2.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4c6b649701667bbe825c3b7e6388cb521c23d88644678e83c0c4d0a621a34b43"
dependencies = [
 "displaydoc",
 "potential_utf",
 "yoke",
 "zerofrom",
 "zerovec",
]

[[package]]
name = "icu_locale_core"
version = "2.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "edba7861004dd3714265b4db54a3c390e880ab658fec5f7db895fae2046b5bb6"
dependencies = [
 "displaydoc",
 "litemap",
 "tinystr",
 "writeable",
 "zerovec",
]

[[package]]
name = "icu_normalizer"
version = "2.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "5f6c8828b67bf8908d82127b2054ea1b4427ff0230ee9141c54251934ab1b599"
dependencies = [
 "icu_collections",
 "icu_normalizer_data",
 "icu_properties",
 "icu_provider",
 "smallvec",
 "zerovec",
]

[[package]]
name = "icu_normalizer_data"
version = "2.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
```