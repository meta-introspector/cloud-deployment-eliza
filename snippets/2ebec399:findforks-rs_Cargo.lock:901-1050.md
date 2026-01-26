# 2ebec399:findforks-rs_Cargo.lock:901-1050

**Commit:** 2ebec3991ceaad058b3d758c0d39323c4999c79e
**Author:** mike dupont
**Date:** Mon Jan 26 13:39:52 2026 -0500
**File:** findforks-rs/Cargo.lock:901-1050
**Novelty Score:** 47.51
**Concepts:** 

```
 "unicode-ident",
]

[[package]]
name = "quote"
version = "1.0.44"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "21b2ebcf727b7760c461f091f9f0f539b77b8e87f2fd88131e7f1b433b3cece4"
dependencies = [
 "proc-macro2",
]

[[package]]
name = "redox_syscall"
version = "0.5.18"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "ed2bf2547551a7053d6fdfafda3f938979645c44812fbfcda098faae3f1a362d"
dependencies = [
 "bitflags",
]

[[package]]
name = "ring"
version = "0.17.14"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a4689e6c2294d81e88dc6261c768b63bc4fcdb852be6d1352498b114f61383b7"
dependencies = [
 "cc",
 "cfg-if",
 "getrandom",
 "libc",
 "untrusted",
 "windows-sys 0.52.0",
]

[[package]]
name = "rustls"
version = "0.22.4"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "bf4ef73721ac7bcd79b2b315da7779d8fc09718c6b3d2d1b2d94850eb8c18432"
dependencies = [
 "log",
 "ring",
 "rustls-pki-types",
 "rustls-webpki",
 "subtle",
 "zeroize",
]

[[package]]
name = "rustls-native-certs"
version = "0.7.3"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "e5bfb394eeed242e909609f56089eecfe5fda225042e8b171791b9c95f5931e5"
dependencies = [
 "openssl-probe",
 "rustls-pemfile",
 "rustls-pki-types",
 "schannel",
 "security-framework",
]

[[package]]
name = "rustls-pemfile"
version = "2.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "dce314e5fee3f39953d46bb63bb8a46d40c2f8fb7cc5a3b6cab2bde9721d6e50"
dependencies = [
 "rustls-pki-types",
]

[[package]]
name = "rustls-pki-types"
version = "1.14.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "be040f8b0a225e40375822a563fa9524378b9d63112f53e19ffff34df5d33fdd"
dependencies = [
 "zeroize",
]

[[package]]
name = "rustls-webpki"
version = "0.102.8"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "64ca1bc8749bd4cf37b5ce386cc146580777b4e8572c7b97baf22c83f444bee9"
dependencies = [
 "ring",
 "rustls-pki-types",
 "untrusted",
]

[[package]]
name = "rustversion"
version = "1.0.22"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "b39cdef0fa800fc44525c84ccb54a029961a8215f9619753635a9c0d2538d46d"

[[package]]
name = "ryu"
version = "1.0.22"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "a50f4cf475b65d88e057964e0e9bb1f0aa9bbb2036dc65c64596b42932536984"

[[package]]
name = "schannel"
version = "0.1.28"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "891d81b926048e76efe18581bf793546b4c0eaf8448d72be8de2bbee5fd166e1"
dependencies = [
 "windows-sys 0.61.2",
]

[[package]]
name = "scopeguard"
version = "1.2.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "94143f37725109f92c262ed2cf5e59bce7498c01bcc1502d7b9afe439a4e9f49"

[[package]]
name = "secrecy"
version = "0.8.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "9bd1c54ea06cfd2f6b63219704de0b9b4f72dcc2b8fdef820be6cd799780e91e"
dependencies = [
 "zeroize",
]

[[package]]
name = "security-framework"
version = "2.11.1"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "897b2245f0b511c87893af39b033e5ca9cce68824c4d7e7630b5a1d339658d02"
dependencies = [
 "bitflags",
 "core-foundation",
 "core-foundation-sys",
 "libc",
 "security-framework-sys",
]

[[package]]
name = "security-framework-sys"
version = "2.15.0"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "cc1f0cbffaac4852523ce30d8bd3c5cdc873501d96ff467ca09b6767bb8cd5c0"
dependencies = [
 "core-foundation-sys",
 "libc",
]

```