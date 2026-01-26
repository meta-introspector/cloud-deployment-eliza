# a7046c18:packages_core_rust_src_plugin.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/plugin.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if visiting.contains(canonical_name) {
            error!(
                "Circular dependency detected for plugin: {}",
                canonical_name
            );
            anyhow::bail!(
                "Circular dependency detected for plugin: {}",
                canonical_name
            );
        }

        visiting.insert(canonical_name.clone());

        // Process dependencies
        let deps: Vec<String> = plugin.definition.dependencies.clone().unwrap_or_default();

        for dep in deps {
            visit(
                &dep,
                lookup,
                visited,
                visiting,
                resolution_order,
                is_test_mode,
            )?;
        }

        // Process test dependencies if in test mode
        if is_test_mode {
            let test_deps: Vec<String> = plugin
                .definition
                .test_dependencies
                .clone()
                .unwrap_or_default();

            for dep in test_deps {
                visit(
                    &dep,
                    lookup,
                    visited,
                    visiting,
                    resolution_order,
                    is_test_mode,
                )?;
            }
        }

        visiting.remove(canonical_name);
        visited.insert(canonical_name.clone());
        resolution_order.push(canonical_name.clone());

        Ok(())
    }

    // Visit all plugins
    for plugin in plugins.values() {
        if !visited.contains(&plugin.definition.name) {
            visit(
                &plugin.definition.name,
                &lookup,
                &mut visited,
                &mut visiting,
                &mut resolution_order,
                is_test_mode,
            )?;
        }
    }

    // Map back to plugin references
    let final_plugins: Vec<&Plugin> = resolution_order
        .iter()
        .filter_map(|name| plugins.values().find(|p| &p.definition.name == name))
        .collect();

    debug!(
        "Plugins resolved: {:?}",
        final_plugins
            .iter()
            .map(|p| &p.definition.name)
            .collect::<Vec<_>>()
    );

    Ok(final_plugins)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::PluginDefinition;

    fn create_test_plugin(name: &str, deps: Vec<&str>) -> Plugin {
        Plugin {
            definition: PluginDefinition {
                name: name.to_string(),
                description: format!("{} plugin", name),
                dependencies: if deps.is_empty() {
                    None
                } else {
                    Some(deps.into_iter().map(String::from).collect())
                },
                ..Default::default()
            },
            ..Default::default()
        }
    }

    #[test]
    fn test_normalize_plugin_name() {
        assert_eq!(normalize_plugin_name("@elizaos/plugin-discord"), "discord");
        assert_eq!(normalize_plugin_name("@elizaos/plugin-sql"), "sql");
        assert_eq!(normalize_plugin_name("bootstrap"), "bootstrap");
    }

    #[test]
    fn test_validate_plugin() {
        let plugin = PluginDefinition {
            name: "test".to_string(),
            description: "Test plugin".to_string(),
            ..Default::default()
        };

        assert!(validate_plugin(&plugin).is_ok());
    }

    #[test]
    fn test_validate_plugin_empty_name() {
        let plugin = PluginDefinition {
            name: "".to_string(),
            description: "Test plugin".to_string(),
            ..Default::default()
        };

        assert!(validate_plugin(&plugin).is_err());
    }

    #[test]
    fn test_resolve_plugin_dependencies_simple() {
        let mut plugins = HashMap::new();
        plugins.insert("a".to_string(), create_test_plugin("a", vec![]));
        plugins.insert("b".to_string(), create_test_plugin("b", vec!["a"]));
        plugins.insert("c".to_string(), create_test_plugin("c", vec!["b"]));

        let resolved = resolve_plugin_dependencies(&plugins, false).unwrap();
        let names: Vec<&str> = resolved
            .iter()
            .map(|p| p.definition.name.as_str())
            .collect();

        // a should come before b, b should come before c
        let a_pos = names.iter().position(|&n| n == "a").unwrap();
```