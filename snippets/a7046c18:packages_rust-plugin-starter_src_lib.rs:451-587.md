# a7046c18:packages_rust-plugin-starter_src_lib.rs:451-587

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/src/lib.rs:451-587
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[wasm_bindgen]
    pub fn get_manifest() -> String {
        let plugin = ensure_plugin();
        serde_json::to_string(&plugin.as_ref().unwrap().manifest()).unwrap_or_default()
    }

    #[wasm_bindgen]
    pub fn init(config_json: &str) {
        let mut plugin = ensure_plugin();
        let _ = plugin.as_mut().unwrap().init(config_json);
    }

    #[wasm_bindgen]
    pub fn validate_action(name: &str, memory_json: &str, state_json: &str) -> bool {
        let memory: Memory = serde_json::from_str(memory_json).unwrap_or_default();
        let state: Option<State> = serde_json::from_str(state_json).ok();

        let plugin = ensure_plugin();
        plugin.as_ref().unwrap().validate_action(name, &memory, state.as_ref())
    }

    #[wasm_bindgen]
    pub fn invoke_action(
        name: &str,
        memory_json: &str,
        state_json: &str,
        options_json: &str,
    ) -> String {
        let memory: Memory = serde_json::from_str(memory_json).unwrap_or_default();
        let state: Option<State> = serde_json::from_str(state_json).ok();
        let options: Option<HandlerOptions> = serde_json::from_str(options_json).ok();

        let plugin = ensure_plugin();
        let result = plugin.as_ref().unwrap().invoke_action(
            name,
            &memory,
            state.as_ref(),
            options.as_ref(),
        );
        serde_json::to_string(&result).unwrap_or_default()
    }

    #[wasm_bindgen]
    pub fn get_provider(name: &str, memory_json: &str, state_json: &str) -> String {
        let memory: Memory = serde_json::from_str(memory_json).unwrap_or_default();
        let state: State = serde_json::from_str(state_json).unwrap_or_default();

        let plugin = ensure_plugin();
        let result = plugin.as_ref().unwrap().get_provider(name, &memory, &state);
        serde_json::to_string(&result).unwrap_or_default()
    }

    #[wasm_bindgen]
    pub fn validate_evaluator(name: &str, memory_json: &str, state_json: &str) -> bool {
        let memory: Memory = serde_json::from_str(memory_json).unwrap_or_default();
        let state: Option<State> = serde_json::from_str(state_json).ok();

        let plugin = ensure_plugin();
        plugin.as_ref().unwrap().validate_evaluator(name, &memory, state.as_ref())
    }

    #[wasm_bindgen]
    pub fn invoke_evaluator(name: &str, memory_json: &str, state_json: &str) -> String {
        let memory: Memory = serde_json::from_str(memory_json).unwrap_or_default();
        let state: Option<State> = serde_json::from_str(state_json).ok();

        let plugin = ensure_plugin();
        match plugin.as_ref().unwrap().invoke_evaluator(name, &memory, state.as_ref()) {
            Some(r) => serde_json::to_string(&r).unwrap_or_default(),
            None => "null".to_string(),
        }
    }

    #[wasm_bindgen]
    pub fn alloc(size: usize) -> *mut u8 {
        let mut buf = Vec::with_capacity(size);
        let ptr = buf.as_mut_ptr();
        std::mem::forget(buf);
        ptr
    }

    #[wasm_bindgen]
    pub fn dealloc(ptr: *mut u8, size: usize) {
        unsafe {
            let _ = Vec::from_raw_parts(ptr, 0, size);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plugin_creation() {
        let plugin = StarterPlugin::new();
        assert!(!plugin.initialized);
    }

    #[test]
    fn test_plugin_init() {
        let mut plugin = StarterPlugin::new();
        let result = plugin.init("{}");
        assert!(result.is_ok());
        assert!(plugin.initialized);
    }

    #[test]
    fn test_action_validation() {
        let plugin = StarterPlugin::new();
        let memory = Memory::default();
        assert!(plugin.validate_action("HELLO_RUST", &memory, None));
        assert!(!plugin.validate_action("UNKNOWN_ACTION", &memory, None));
    }

    #[test]
    fn test_action_invocation() {
        let plugin = StarterPlugin::new();
        let mut memory = Memory::default();
        memory.content.text = Some("World".to_string());

        let result = plugin.invoke_action("HELLO_RUST", &memory, None, None);
        assert!(result.success);
        assert!(result.text.unwrap().contains("Hello from Rust"));
    }

    #[test]
    fn test_provider() {
        let plugin = StarterPlugin::new();
        let memory = Memory::default();
        let state = State::default();

        let result = plugin.get_provider("RUST_INFO", &memory, &state);
        assert!(result.text.is_some());
    }
}

```