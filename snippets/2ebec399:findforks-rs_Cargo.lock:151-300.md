# 2ebec399:findforks-rs_Cargo.lock:151-300

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:151-300
**Novelty Score:** 47.51
**Concepts:** 

```
 "windows-link",
]

[[package]]
name = "clap"
version = "4.5.54"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c6e6ff9dcd79cff5cd969a17a545d79e84ab086e444102a591e288a8aa3ce394"
dependencies = [
 "clap_builder",
 "clap_derive",
]

[[package]]
name = "clap_builder"
version = "4.5.54"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "fa42cf4d2b7a41bc8f663a7cab4031ebafa1bf3875705bfaf8466dc60ab52c00"
dependencies = [
 "anstream",
 "anstyle",
 "clap_lex",
 "strsim",
]

[[package]]
name = "clap_derive"
version = "4.5.49"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2a0b5487afeab2deb2ff4e03a807ad1a03ac532ff5a2cee5d86884440c7f7671"
dependencies = [
 "heck",
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "clap_lex"
version = "0.7.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c3e64b0cc0439b12df2fa678eae89a1c56a529fd067a9115f7827f1fffd22b32"

[[package]]
name = "colorchoice"
version = "1.0.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b05b61dc5112cbb17e4b6cd61790d9845d13888356391624cbe7e41efeac1e75"

[[package]]
name = "core-foundation"
version = "0.9.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "91e195e091a93c46f7102ec7818a2aa394e1e1771c3ab4825963fa03e45afb8f"
dependencies = [
 "core-foundation-sys",
 "libc",
]

[[package]]
name = "core-foundation-sys"
version = "0.8.7"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "773648b94d0e5d620f64f280777445740e61fe701025087ec8b57f45c791888b"

[[package]]
name = "deranged"
version = "0.5.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ececcb659e7ba858fb4f10388c250a7252eb0a27373f1a72b8748afdd248e587"
dependencies = [
 "powerfmt",
]

[[package]]
name = "displaydoc"
version = "0.2.5"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "97369cbbc041bc366949bc74d34658d6cda5621039731c6310521892a3a20ae0"
dependencies = [
 "proc-macro2",
 "quote",
 "syn",
]

[[package]]
name = "either"
version = "1.15.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "48c757948c5ede0e46177b7add2e67155f70e33c07fea8284df6576da70b3719"

[[package]]
name = "errno"
version = "0.3.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "39cab71617ae0d63f51a36d69f866391735b51691dbda63cf6f96d042b63efeb"
dependencies = [
 "libc",
 "windows-sys 0.61.2",
]

[[package]]
name = "find-msvc-tools"
version = "0.1.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "8591b0bcc8a98a64310a2fae1bb3e9b8564dd10e381e6e28010fde8e8e8568db"

[[package]]
name = "findforks"
version = "0.1.0"
dependencies = [
 "anyhow",
 "clap",
 "octocrab",
 "serde",
 "serde_json",
 "tokio",
 "url",
]

[[package]]
name = "form_urlencoded"
version = "1.2.2"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cb4cb245038516f5f85277875cdaa4f7d2c9a0fa0468de06ed190163b1581fcf"
dependencies = [
 "percent-encoding",
]

[[package]]
name = "futures"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "65bc07b1a8bc7c85c5f2e110c476c7389b4554ba72af57d8445ea63a576b0876"
dependencies = [
 "futures-channel",
 "futures-core",
 "futures-executor",
 "futures-io",
 "futures-sink",
 "futures-task",
 "futures-util",
]

[[package]]
name = "futures-channel"
version = "0.3.31"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "2dff15bf788c671c1934e366d07e30c1814a8ef514e1af724a602e8a2fbe1b10"
dependencies = [
```