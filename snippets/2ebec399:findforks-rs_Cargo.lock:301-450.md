# 2ebec399:findforks-rs_Cargo.lock:301-450

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:301-450
**Novelty Score:** 47.51
**Concepts:** 

```
 "futures-core",
 "futures-sink",
]

[[package]]
name = "futures-core"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "05f29059c0c2090612e8d742178b0580d2dc940c837851ad723096f87af6663e"

[[package]]
name = "futures-executor"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1e28d1d997f585e54aebc3f97d39e72338912123a67330d723fdbb564d646c9f"
dependencies = [
 "futures-core",
 "futures-task",
 "futures-util",
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
 "syn",
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
name = "getrandom"
version = "0.2.17"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ff2abc00be7fca6ebc474524697ae276ad847ad0a6b3faa4bcb027e9a4614ad0"
dependencies = [
 "cfg-if",
 "js-sys",
 "libc",
 "wasi",
 "wasm-bindgen",
]

[[package]]
name = "heck"
version = "0.5.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2304e00983f87ffb38b55b444b5e3b60a884b5d30c0fca7d82fe33449bbe55ea"

[[package]]
name = "http"
version = "1.4.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e3ba2a386d7f85a81f119ad7498ebe444d2e22c2af0b86b069416ace48b3311a"
dependencies = [
 "bytes",
 "itoa",
]

[[package]]
name = "http-body"
version = "1.0.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "1efedce1fb8e6913f23e0c92de8e62cd5b772a67e7b3946df930a62566c93184"
dependencies = [
 "bytes",
 "http",
]

[[package]]
name = "http-body-util"
version = "0.1.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b021d93e26becf5dc7e1b75b1bed1fd93124b374ceb73f43d4d4eafec896a64a"
dependencies = [
 "bytes",
 "futures-core",
 "http",
 "http-body",
 "pin-project-lite",
]

[[package]]
name = "httparse"
version = "1.10.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "6dbf3de79e51f3d586ab4cb9d5c3e2c14aa28ed23d180cf89b4df0454a69cc87"

[[package]]
name = "hyper"
version = "1.8.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2ab2d4f250c3d7b1c9fcdff1cece94ea4e2dfbec68614f7b87cb205f24ca9d11"
dependencies = [
 "atomic-waker",
 "bytes",
 "futures-channel",
 "futures-core",
 "http",
 "http-body",
 "httparse",
 "itoa",
 "pin-project-lite",
 "pin-utils",
 "smallvec",
 "tokio",
 "want",
]

[[package]]
name = "hyper-rustls"
version = "0.26.0"
```