# a7046c18:packages_core_rust_Cargo.lock:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/Cargo.lock:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
checksum = "7aedcccd01fc5fe81e6b489c15b247b8b0690feb23304303a9e560f37efc560a"

[[package]]
name = "icu_properties"
version = "2.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "020bfc02fe870ec3a66d93e677ccca0562506e5872c650f893269e08615d74ec"
dependencies = [
 "icu_collections",
 "icu_locale_core",
 "icu_properties_data",
 "icu_provider",
 "zerotrie",
 "zerovec",
]

[[package]]
name = "icu_properties_data"
version = "2.1.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "616c294cf8d725c6afcd8f55abc17c56464ef6211f9ed59cccffe534129c77af"

[[package]]
name = "icu_provider"
version = "2.1.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "85962cf0ce02e1e0a629cc34e7ca3e373ce20dda4c4d7294bbd0bf1fdb59e614"
dependencies = [
 "displaydoc",
 "icu_locale_core",
 "writeable",
 "yoke",
 "zerofrom",
 "zerotrie",
 "zerovec",
]

[[package]]
name = "ident_case"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b9e0384b61958566e926dc50660321d12159025e767c18e043daf26b70104c39"

[[package]]
name = "idna"
version = "1.1.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3b0875f23caa03898994f6ddc501886a45c7d3d62d04d2d90788d47be1b1e4de"
dependencies = [
 "idna_adapter",
 "smallvec",
 "utf8_iter",
]

[[package]]
name = "idna_adapter"
version = "1.2.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "3acae9609540aa318d1bc588455225fb2085b9ed0c4f6bd0d9d5bcd86f1a0344"
dependencies = [
 "icu_normalizer",
 "icu_properties",
]

[[package]]
name = "indexmap"
version = "2.13.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7714e70437a7dc3ac8eb7e6f8df75fd8eb422675fc7678aff7364301092b1017"
dependencies = [
 "equivalent",
 "hashbrown 0.16.1",
]

[[package]]
name = "itoa"
```