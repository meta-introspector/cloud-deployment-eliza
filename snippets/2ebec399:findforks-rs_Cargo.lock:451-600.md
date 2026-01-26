# 2ebec399:findforks-rs_Cargo.lock:451-600

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:451-600
**Novelty Score:** 47.51
**Concepts:** 

```
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a0bea761b46ae2b24eb4aef630d8d1c398157b6fc29e6350ecf090a0b70c952c"
dependencies = [
 "futures-util",
 "http",
 "hyper",
 "hyper-util",
 "log",
 "rustls",
 "rustls-native-certs",
 "rustls-pki-types",
 "tokio",
 "tokio-rustls",
 "tower-service",
]

[[package]]
name = "hyper-timeout"
version = "0.5.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2b90d566bffbce6a75bd8b09a05aa8c2cb1fabb6cb348f8840c9e4c90a0d83b0"
dependencies = [
 "hyper",
 "hyper-util",
 "pin-project-lite",
 "tokio",
 "tower-service",
]

[[package]]
name = "hyper-util"
version = "0.1.19"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "727805d60e7938b76b826a6ef209eb70eaa1812794f9424d4a4e2d740662df5f"
dependencies = [
 "bytes",
 "futures-channel",
 "futures-core",
 "futures-util",
 "http",
 "http-body",
 "hyper",
 "libc",
 "pin-project-lite",
 "socket2",
 "tokio",
 "tower-service",
 "tracing",
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
```