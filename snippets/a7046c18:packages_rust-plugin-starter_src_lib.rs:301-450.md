# a7046c18:packages_rust-plugin-starter_src_lib.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/src/lib.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    #[no_mangle]
    pub extern "C" fn elizaos_validate_action(
        name: *const c_char,
        memory_json: *const c_char,
        state_json: *const c_char,
    ) -> c_int {
        let name = cstr_to_string(name).unwrap_or_default();
        let memory: Memory = serde_json::from_str(
            &cstr_to_string(memory_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();
        let state: Option<State> = cstr_to_string(state_json)
            .and_then(|s| serde_json::from_str(&s).ok());

        let plugin = ensure_plugin();
        if plugin.as_ref().unwrap().validate_action(&name, &memory, state.as_ref()) {
            1
        } else {
            0
        }
    }

    #[no_mangle]
    pub extern "C" fn elizaos_invoke_action(
        name: *const c_char,
        memory_json: *const c_char,
        state_json: *const c_char,
        options_json: *const c_char,
    ) -> *mut c_char {
        let name = cstr_to_string(name).unwrap_or_default();
        let memory: Memory = serde_json::from_str(
            &cstr_to_string(memory_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();
        let state: Option<State> = cstr_to_string(state_json)
            .and_then(|s| serde_json::from_str(&s).ok());
        let options: Option<HandlerOptions> = cstr_to_string(options_json)
            .and_then(|s| serde_json::from_str(&s).ok());

        let plugin = ensure_plugin();
        let result = plugin.as_ref().unwrap().invoke_action(
            &name,
            &memory,
            state.as_ref(),
            options.as_ref(),
        );
        string_to_cstr(serde_json::to_string(&result).unwrap_or_default())
    }

    #[no_mangle]
    pub extern "C" fn elizaos_get_provider(
        name: *const c_char,
        memory_json: *const c_char,
        state_json: *const c_char,
    ) -> *mut c_char {
        let name = cstr_to_string(name).unwrap_or_default();
        let memory: Memory = serde_json::from_str(
            &cstr_to_string(memory_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();
        let state: State = serde_json::from_str(
            &cstr_to_string(state_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();

        let plugin = ensure_plugin();
        let result = plugin.as_ref().unwrap().get_provider(&name, &memory, &state);
        string_to_cstr(serde_json::to_string(&result).unwrap_or_default())
    }

    #[no_mangle]
    pub extern "C" fn elizaos_validate_evaluator(
        name: *const c_char,
        memory_json: *const c_char,
        state_json: *const c_char,
    ) -> c_int {
        let name = cstr_to_string(name).unwrap_or_default();
        let memory: Memory = serde_json::from_str(
            &cstr_to_string(memory_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();
        let state: Option<State> = cstr_to_string(state_json)
            .and_then(|s| serde_json::from_str(&s).ok());

        let plugin = ensure_plugin();
        if plugin.as_ref().unwrap().validate_evaluator(&name, &memory, state.as_ref()) {
            1
        } else {
            0
        }
    }

    #[no_mangle]
    pub extern "C" fn elizaos_invoke_evaluator(
        name: *const c_char,
        memory_json: *const c_char,
        state_json: *const c_char,
    ) -> *mut c_char {
        let name = cstr_to_string(name).unwrap_or_default();
        let memory: Memory = serde_json::from_str(
            &cstr_to_string(memory_json).unwrap_or_else(|| "{}".to_string()),
        )
        .unwrap_or_default();
        let state: Option<State> = cstr_to_string(state_json)
            .and_then(|s| serde_json::from_str(&s).ok());

        let plugin = ensure_plugin();
        let result = plugin.as_ref().unwrap().invoke_evaluator(&name, &memory, state.as_ref());
        match result {
            Some(r) => string_to_cstr(serde_json::to_string(&r).unwrap_or_default()),
            None => string_to_cstr("null".to_string()),
        }
    }

    #[no_mangle]
    pub extern "C" fn elizaos_free_string(ptr: *mut c_char) {
        if !ptr.is_null() {
            unsafe {
                let _ = CString::from_raw(ptr);
            }
        }
    }
}

// ============================================================================
// WASM Exports (for TypeScript)
// ============================================================================

#[cfg(feature = "wasm")]
mod wasm {
    use super::*;
    use std::sync::Mutex;
    use wasm_bindgen::prelude::*;

    static PLUGIN: Mutex<Option<StarterPlugin>> = Mutex::new(None);

    fn ensure_plugin() -> std::sync::MutexGuard<'static, Option<StarterPlugin>> {
        let mut guard = PLUGIN.lock().unwrap();
        if guard.is_none() {
            *guard = Some(StarterPlugin::new());
        }
        guard
    }

    #[wasm_bindgen(start)]
    pub fn wasm_init() {
        console_error_panic_hook::set_once();
    }

```