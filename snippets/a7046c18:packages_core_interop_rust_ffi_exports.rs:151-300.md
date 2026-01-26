# a7046c18:packages_core_interop_rust_ffi_exports.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/ffi_exports.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/// Invoke an action
///
/// # Safety
/// All string parameters must be valid null-terminated C strings.
/// The returned string must be freed with `elizaos_free_string`
#[no_mangle]
pub extern "C" fn elizaos_invoke_action(
    name: *const c_char,
    memory_json: *const c_char,
    state_json: *const c_char,
    options_json: *const c_char,
) -> *mut c_char {
    let name = match cstr_to_string(name) {
        Some(s) => s,
        None => return string_to_cstr(r#"{"success": false, "error": "Invalid action name"}"#.to_string()),
    };
    let memory = cstr_to_string(memory_json).unwrap_or_else(|| "null".to_string());
    let state = cstr_to_string(state_json).unwrap_or_else(|| "null".to_string());
    let options = cstr_to_string(options_json).unwrap_or_else(|| "{}".to_string());

    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => string_to_cstr(plugin.invoke_action(&name, &memory, &state, &options)),
        None => string_to_cstr(r#"{"success": false, "error": "No plugin registered"}"#.to_string()),
    }
}

/// Get provider data
///
/// # Safety
/// All string parameters must be valid null-terminated C strings.
/// The returned string must be freed with `elizaos_free_string`
#[no_mangle]
pub extern "C" fn elizaos_get_provider(
    name: *const c_char,
    memory_json: *const c_char,
    state_json: *const c_char,
) -> *mut c_char {
    let name = match cstr_to_string(name) {
        Some(s) => s,
        None => return string_to_cstr(r#"{"text": null, "values": null, "data": null}"#.to_string()),
    };
    let memory = cstr_to_string(memory_json).unwrap_or_else(|| "null".to_string());
    let state = cstr_to_string(state_json).unwrap_or_else(|| "{}".to_string());

    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => string_to_cstr(plugin.get_provider(&name, &memory, &state)),
        None => string_to_cstr(r#"{"text": null, "values": null, "data": null}"#.to_string()),
    }
}

/// Validate an evaluator
///
/// # Safety
/// All string parameters must be valid null-terminated C strings
#[no_mangle]
pub extern "C" fn elizaos_validate_evaluator(
    name: *const c_char,
    memory_json: *const c_char,
    state_json: *const c_char,
) -> c_int {
    let name = match cstr_to_string(name) {
        Some(s) => s,
        None => return 0,
    };
    let memory = cstr_to_string(memory_json).unwrap_or_else(|| "null".to_string());
    let state = cstr_to_string(state_json).unwrap_or_else(|| "null".to_string());

    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => {
            if plugin.validate_evaluator(&name, &memory, &state) {
                1
            } else {
                0
            }
        }
        None => 0,
    }
}

/// Invoke an evaluator
///
/// # Safety
/// All string parameters must be valid null-terminated C strings.
/// The returned string must be freed with `elizaos_free_string`
#[no_mangle]
pub extern "C" fn elizaos_invoke_evaluator(
    name: *const c_char,
    memory_json: *const c_char,
    state_json: *const c_char,
) -> *mut c_char {
    let name = match cstr_to_string(name) {
        Some(s) => s,
        None => return string_to_cstr("null".to_string()),
    };
    let memory = cstr_to_string(memory_json).unwrap_or_else(|| "null".to_string());
    let state = cstr_to_string(state_json).unwrap_or_else(|| "null".to_string());

    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => string_to_cstr(plugin.invoke_evaluator(&name, &memory, &state)),
        None => string_to_cstr("null".to_string()),
    }
}

/// Free a string returned by any of the above functions
///
/// # Safety
/// `ptr` must be a string allocated by this library
#[no_mangle]
pub extern "C" fn elizaos_free_string(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe {
            let _ = CString::from_raw(ptr);
        }
    }
}

// ============================================================================
// Helper Macro for Plugin Export
// ============================================================================

/// Macro to export a plugin for FFI
///
/// This macro should be called in your plugin's lib.rs to make it loadable
/// via FFI from Python or other languages.
///
/// # Example
///
/// ```rust,ignore
/// use elizaos_core::interop::ffi_exports::*;
///
/// struct MyPlugin { /* ... */ }
///
/// impl PluginExport for MyPlugin {
///     // ... implement trait methods ...
/// }
///
/// #[no_mangle]
/// pub extern "C" fn elizaos_plugin_init() {
///     let plugin = MyPlugin::new();
///     register_plugin(plugin);
/// }
/// ```
#[macro_export]
macro_rules! elizaos_export_plugin {
    ($plugin:expr) => {
        #[no_mangle]
```