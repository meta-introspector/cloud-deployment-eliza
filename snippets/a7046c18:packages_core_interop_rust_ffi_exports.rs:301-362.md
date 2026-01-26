# a7046c18:packages_core_interop_rust_ffi_exports.rs:301-362

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/ffi_exports.rs:301-362
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        pub extern "C" fn elizaos_plugin_init() {
            $crate::interop::ffi_exports::register_plugin($plugin);
        }
    };
}

#[cfg(test)]
mod tests {
    use super::*;

    struct TestPlugin {
        name: String,
    }

    impl PluginExport for TestPlugin {
        fn get_manifest(&self) -> String {
            format!(r#"{{"name": "{}", "description": "Test plugin"}}"#, self.name)
        }

        fn init(&self, _config: &str) -> Result<(), String> {
            Ok(())
        }

        fn validate_action(&self, _name: &str, _memory: &str, _state: &str) -> bool {
            true
        }

        fn invoke_action(&self, _name: &str, _memory: &str, _state: &str, _options: &str) -> String {
            r#"{"success": true, "text": "Hello from test"}"#.to_string()
        }

        fn get_provider(&self, _name: &str, _memory: &str, _state: &str) -> String {
            r#"{"text": "Provider data"}"#.to_string()
        }

        fn validate_evaluator(&self, _name: &str, _memory: &str, _state: &str) -> bool {
            true
        }

        fn invoke_evaluator(&self, _name: &str, _memory: &str, _state: &str) -> String {
            r#"{"success": true}"#.to_string()
        }
    }

    #[test]
    fn test_plugin_registration() {
        let plugin = TestPlugin {
            name: "test".to_string(),
        };
        register_plugin(plugin);

        let manifest_ptr = elizaos_get_manifest();
        assert!(!manifest_ptr.is_null());

        unsafe {
            let manifest = CStr::from_ptr(manifest_ptr).to_str().unwrap();
            assert!(manifest.contains("test"));
            elizaos_free_string(manifest_ptr);
        }
    }
}

```