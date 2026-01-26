# a7046c18:packages_rust-plugin-starter_tests_integration.rs:151-299

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/tests/integration.rs:151-299
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    let result = ActionResult::success_with_text("Done!");
    
    assert!(result.success);
    assert_eq!(result.text, Some("Done!".to_string()));
    assert!(result.error.is_none());
}

#[test]
fn test_action_result_failure() {
    let result = ActionResult::failure("Something went wrong");
    
    assert!(!result.success);
    assert_eq!(result.error, Some("Something went wrong".to_string()));
}

#[test]
fn test_action_result_serialization() {
    let result = ActionResult {
        success: true,
        text: Some("Result text".to_string()),
        data: Some({
            let mut map = std::collections::HashMap::new();
            map.insert("key".to_string(), serde_json::json!("value"));
            map
        }),
        ..Default::default()
    };
    
    let json = serde_json::to_string(&result).unwrap();
    let parsed: ActionResult = serde_json::from_str(&json).unwrap();
    
    assert!(parsed.success);
    assert_eq!(parsed.data.unwrap().get("key").unwrap(), &serde_json::json!("value"));
}

#[test]
fn test_provider_result_serialization() {
    let result = ProviderResult {
        text: Some("Provider context".to_string()),
        values: Some({
            let mut map = std::collections::HashMap::new();
            map.insert("count".to_string(), serde_json::json!(42));
            map
        }),
        data: None,
    };
    
    let json = serde_json::to_string(&result).unwrap();
    let parsed: ProviderResult = serde_json::from_str(&json).unwrap();
    
    assert_eq!(parsed.text, Some("Provider context".to_string()));
    assert_eq!(parsed.values.unwrap().get("count").unwrap(), &serde_json::json!(42));
}

#[test]
fn test_handler_options_serialization() {
    let options = HandlerOptions {
        extra: {
            let mut map = std::collections::HashMap::new();
            map.insert("timeout".to_string(), serde_json::json!(5000));
            map
        },
    };
    
    let json = serde_json::to_string(&options).unwrap();
    let parsed: HandlerOptions = serde_json::from_str(&json).unwrap();
    
    assert_eq!(parsed.extra.get("timeout").unwrap(), &serde_json::json!(5000));
}

#[test]
fn test_content_serialization() {
    let content = Content {
        text: Some("Hello".to_string()),
        actions: Some(vec!["ACTION_1".to_string(), "ACTION_2".to_string()]),
        source: Some("test".to_string()),
        data: None,
    };
    
    let json = serde_json::to_string(&content).unwrap();
    let parsed: Content = serde_json::from_str(&json).unwrap();
    
    assert_eq!(parsed.text, Some("Hello".to_string()));
    assert_eq!(parsed.actions.unwrap().len(), 2);
}

#[test]
fn test_unicode_handling() {
    let mut content = Content::default();
    content.text = Some("Hello 世界! 🦀 مرحبا שָׁלוֹם".to_string());
    
    let json = serde_json::to_string(&content).unwrap();
    let parsed: Content = serde_json::from_str(&json).unwrap();
    
    let text = parsed.text.unwrap();
    assert!(text.contains("世界"));
    assert!(text.contains("🦀"));
}

#[test]
fn test_null_handling() {
    let json = r#"{"text": null, "actions": null, "source": null, "data": null}"#;
    let content: Content = serde_json::from_str(json).unwrap();
    
    assert!(content.text.is_none());
    assert!(content.actions.is_none());
}

#[test]
fn test_empty_arrays() {
    let content = Content {
        text: None,
        actions: Some(vec![]),
        source: None,
        data: None,
    };
    
    let json = serde_json::to_string(&content).unwrap();
    let parsed: Content = serde_json::from_str(&json).unwrap();
    
    assert_eq!(parsed.actions.unwrap().len(), 0);
}

#[test]
fn test_nested_data() {
    let mut content = Content::default();
    content.data = Some({
        let mut map = std::collections::HashMap::new();
        map.insert(
            "nested".to_string(),
            serde_json::json!({
                "level1": {
                    "level2": {
                        "value": "deep"
                    }
                }
            }),
        );
        map
    });
    
    let json = serde_json::to_string(&content).unwrap();
    let parsed: Content = serde_json::from_str(&json).unwrap();
    
    let data = parsed.data.unwrap();
    let nested = &data["nested"]["level1"]["level2"]["value"];
    assert_eq!(nested, &serde_json::json!("deep"));
}

```