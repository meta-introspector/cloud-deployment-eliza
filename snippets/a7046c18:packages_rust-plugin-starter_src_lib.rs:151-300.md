# a7046c18:packages_rust-plugin-starter_src_lib.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/src/lib.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        Self {
            config: HashMap::new(),
            initialized: false,
        }
    }

    /// Get the plugin manifest
    pub fn manifest(&self) -> serde_json::Value {
        serde_json::json!({
            "name": "rust-plugin-starter",
            "description": "A starter template for Rust plugins",
            "version": "1.0.0",
            "language": "rust",
            "actions": [
                {
                    "name": "HELLO_RUST",
                    "description": "Says hello from Rust",
                    "similes": ["GREET_RUST", "RUST_HELLO"]
                }
            ],
            "providers": [
                {
                    "name": "RUST_INFO",
                    "description": "Provides info about the Rust plugin"
                }
            ]
        })
    }

    /// Initialize the plugin
    pub fn init(&mut self, config_json: &str) -> Result<(), String> {
        let config: HashMap<String, String> =
            serde_json::from_str(config_json).map_err(|e| e.to_string())?;
        self.config = config;
        self.initialized = true;
        Ok(())
    }

    /// Validate an action
    pub fn validate_action(&self, name: &str, _memory: &Memory, _state: Option<&State>) -> bool {
        matches!(name, "HELLO_RUST")
    }

    /// Invoke an action
    pub fn invoke_action(
        &self,
        name: &str,
        memory: &Memory,
        _state: Option<&State>,
        _options: Option<&HandlerOptions>,
    ) -> ActionResult {
        match name {
            "HELLO_RUST" => {
                let greeting = memory
                    .content
                    .text
                    .as_deref()
                    .unwrap_or("friend");
                ActionResult::success_with_text(format!("Hello from Rust, {}! 🦀", greeting))
            }
            _ => ActionResult::failure(format!("Unknown action: {}", name)),
        }
    }

    /// Get provider data
    pub fn get_provider(&self, name: &str, _memory: &Memory, _state: &State) -> ProviderResult {
        match name {
            "RUST_INFO" => ProviderResult {
                text: Some("This is a Rust plugin running via interop!".to_string()),
                values: Some({
                    let mut map = HashMap::new();
                    map.insert("language".to_string(), serde_json::json!("rust"));
                    map.insert("initialized".to_string(), serde_json::json!(self.initialized));
                    map
                }),
                data: None,
            },
            _ => ProviderResult::default(),
        }
    }

    /// Validate an evaluator
    pub fn validate_evaluator(
        &self,
        _name: &str,
        _memory: &Memory,
        _state: Option<&State>,
    ) -> bool {
        false
    }

    /// Invoke an evaluator
    pub fn invoke_evaluator(
        &self,
        _name: &str,
        _memory: &Memory,
        _state: Option<&State>,
    ) -> Option<ActionResult> {
        None
    }
}

// ============================================================================
// FFI Exports (for Python)
// ============================================================================

#[cfg(feature = "ffi")]
mod ffi {
    use super::*;
    use std::ffi::{CStr, CString};
    use std::os::raw::{c_char, c_int};
    use std::sync::Mutex;

    static PLUGIN: Mutex<Option<StarterPlugin>> = Mutex::new(None);

    fn ensure_plugin() -> std::sync::MutexGuard<'static, Option<StarterPlugin>> {
        let mut guard = PLUGIN.lock().unwrap();
        if guard.is_none() {
            *guard = Some(StarterPlugin::new());
        }
        guard
    }

    fn cstr_to_string(ptr: *const c_char) -> Option<String> {
        if ptr.is_null() {
            return None;
        }
        unsafe { CStr::from_ptr(ptr).to_str().ok().map(String::from) }
    }

    fn string_to_cstr(s: String) -> *mut c_char {
        CString::new(s).map(|cs| cs.into_raw()).unwrap_or(std::ptr::null_mut())
    }

    #[no_mangle]
    pub extern "C" fn elizaos_get_manifest() -> *mut c_char {
        let plugin = ensure_plugin();
        let manifest = plugin.as_ref().unwrap().manifest();
        string_to_cstr(serde_json::to_string(&manifest).unwrap_or_default())
    }

    #[no_mangle]
    pub extern "C" fn elizaos_init(config_json: *const c_char) -> c_int {
        let config = cstr_to_string(config_json).unwrap_or_else(|| "{}".to_string());
        let mut plugin = ensure_plugin();
        match plugin.as_mut().unwrap().init(&config) {
            Ok(()) => 0,
            Err(_) => -1,
        }
    }
```