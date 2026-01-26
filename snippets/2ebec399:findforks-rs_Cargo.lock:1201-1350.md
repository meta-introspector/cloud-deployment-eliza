# 2ebec399:findforks-rs_Cargo.lock:1201-1350

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:1201-1350
**Novelty Score:** 47.51
**Concepts:** 

```
name = "subtle"
version = "2.6.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "13c2bddecc57b384dee18652358fb23172facb8a2c51ccc10d74c157bdea3292"

[[package]]
name = "syn"
version = "2.0.114"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "d4d107df263a3013ef9b1879b0df87d706ff80f65a86ea879bd9c31f9b307c2a"
dependencies = [
 "proc-macro2",
 "quote",
 "unicode-ident",
]

[[package]]
name = "synstructure"
version = "0.13.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "728a70f3dbaf5bab7f0c4b1ac8d7ae5ea60a4b5549c8a5914361c99147a709d2"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "thiserror"
version = "2.0.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "4288b5bcbc7920c07a1149a35cf9590a2aa808e0bc1eafaade0b80947865fbc4"
dependencies = [
 "thiserror-impl",
]

[[package]]
name = "thiserror-impl"
version = "2.0.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ebc4ee7f67670e9b64d05fa4253e753e016c6c95ff35b89b7941d6b856dec1d5"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "time"
version = "0.3.46"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9da98b7d9b7dad93488a84b8248efc35352b0b2657397d4167e7ad67e5d535e5"
dependencies = [
 "deranged",
 "itoa",
 "num-conv",
 "powerfmt",
 "serde_core",
 "time-core",
 "time-macros",
]

[[package]]
name = "time-core"
version = "0.1.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "7694e1cfe791f8d31026952abf09c69ca6f6fa4e1a1229e18988f06a04a12dca"

[[package]]
name = "time-macros"
version = "0.2.26"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "78cc610bac2dcee56805c99642447d4c5dbde4d01f752ffea0199aee1f601dc4"
dependencies = [
 "num-conv",
 "time-core",
]

[[package]]
name = "tinystr"
version = "0.8.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "42d3e9c45c09de15d06dd8acf5f4e0e399e85927b7f00711024eb7ae10fa4869"
dependencies = [
 "displaydoc",
 "zerovec",
]

[[package]]
name = "tokio"
version = "1.49.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "72a2903cd7736441aac9df9d7688bd0ce48edccaadf181c3b90be801e81d3d86"
dependencies = [
 "bytes",
 "libc",
 "mio",
 "parking_lot",
 "pin-project-lite",
 "signal-hook-registry",
 "socket2",
 "tokio-macros",
 "windows-sys 0.61.2",
]

[[package]]
name = "tokio-macros"
version = "2.6.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "af407857209536a95c8e56f8231ef2c2e2aff839b22e07a1ffcbc617e9db9fa5"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "tokio-rustls"
version = "0.25.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "775e0c0f0adb3a2f22a00c4745d728b479985fc15ee7ca6a2608388c5569860f"
dependencies = [
 "rustls",
 "rustls-pki-types",
 "tokio",
]

[[package]]
name = "tokio-util"
version = "0.7.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9ae9cec805b01e8fc3fd2fe289f89149a9b66dd16786abd8b19cfa7b48cb0098"
dependencies = [
 "bytes",
 "futures-core",
 "futures-sink",
 "pin-project-lite",
 "tokio",
]

[[package]]
name = "tower"
version = "0.4.13"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b8fa9be0de6cf49e536ce1851f987bd21a43b771b09473c3549a6c853db37c1c"
dependencies = [
 "futures-core",
 "futures-util",
 "pin-project",
 "pin-project-lite",
```