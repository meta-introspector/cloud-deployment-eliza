# a7046c18:packages_core_interop_rust_ffi_exports.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/ffi_exports.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! FFI Exports for elizaOS Rust Plugins
//!
//! This module provides macros and utilities for exposing Rust plugins
//! to Python and other FFI-capable languages.
//!
//! # Example
//!
//! ```rust
//! use elizaos_core::interop::ffi_exports::*;
//! use elizaos_core::types::Plugin;
//!
//! // Create your plugin
//! let plugin = Plugin::new("my-plugin", "A cool plugin");
//!
//! // Export it for FFI
//! elizaos_export_plugin!(plugin);
//! ```

use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};
use std::sync::Mutex;

/// Global plugin instance storage
static PLUGIN_INSTANCE: Mutex<Option<Box<dyn PluginExport>>> = Mutex::new(None);

/// Trait for plugins that can be exported via FFI
pub trait PluginExport: Send + Sync {
    /// Get the plugin manifest as JSON
    fn get_manifest(&self) -> String;

    /// Initialize the plugin with config JSON
    fn init(&self, config_json: &str) -> Result<(), String>;

    /// Validate an action
    fn validate_action(&self, name: &str, memory_json: &str, state_json: &str) -> bool;

    /// Invoke an action and return result JSON
    fn invoke_action(
        &self,
        name: &str,
        memory_json: &str,
        state_json: &str,
        options_json: &str,
    ) -> String;

    /// Get provider data and return result JSON
    fn get_provider(&self, name: &str, memory_json: &str, state_json: &str) -> String;

    /// Validate an evaluator
    fn validate_evaluator(&self, name: &str, memory_json: &str, state_json: &str) -> bool;

    /// Invoke an evaluator and return result JSON
    fn invoke_evaluator(&self, name: &str, memory_json: &str, state_json: &str) -> String;
}

/// Register a plugin for FFI export
pub fn register_plugin<P: PluginExport + 'static>(plugin: P) {
    let mut instance = PLUGIN_INSTANCE.lock().unwrap();
    *instance = Some(Box::new(plugin));
}

/// Helper to convert C string to Rust string
fn cstr_to_string(ptr: *const c_char) -> Option<String> {
    if ptr.is_null() {
        return None;
    }
    unsafe {
        match CStr::from_ptr(ptr).to_str() {
            Ok(s) => Some(s.to_string()),
            Err(_) => None,
        }
    }
}

/// Helper to convert Rust string to C string (caller must free)
fn string_to_cstr(s: String) -> *mut c_char {
    match CString::new(s) {
        Ok(cs) => cs.into_raw(),
        Err(_) => std::ptr::null_mut(),
    }
}

// ============================================================================
// FFI Export Functions
// ============================================================================

/// Get the plugin manifest as JSON
///
/// # Safety
/// The returned string must be freed with `elizaos_free_string`
#[no_mangle]
pub extern "C" fn elizaos_get_manifest() -> *mut c_char {
    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => string_to_cstr(plugin.get_manifest()),
        None => string_to_cstr(r#"{"error": "No plugin registered"}"#.to_string()),
    }
}

/// Initialize the plugin with configuration
///
/// # Safety
/// `config_json` must be a valid null-terminated C string
#[no_mangle]
pub extern "C" fn elizaos_init(config_json: *const c_char) -> c_int {
    let config = match cstr_to_string(config_json) {
        Some(s) => s,
        None => return -1,
    };

    let instance = PLUGIN_INSTANCE.lock().unwrap();
    match &*instance {
        Some(plugin) => match plugin.init(&config) {
            Ok(()) => 0,
            Err(_) => -1,
        },
        None => -1,
    }
}

/// Validate an action
///
/// # Safety
/// All string parameters must be valid null-terminated C strings
#[no_mangle]
pub extern "C" fn elizaos_validate_action(
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
            if plugin.validate_action(&name, &memory, &state) {
                1
            } else {
                0
            }
        }
        None => 0,
    }
}

```