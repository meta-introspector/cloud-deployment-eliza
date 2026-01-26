# a7046c18:packages_docs_plugin-registry_registry.mdx:151-213

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/registry.mdx:151-213
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                <span 
                  key={tag}
                  className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {plugin.tags.length > 3 && (
                <span className="inline-block text-gray-500 text-xs px-1">
                  +{plugin.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    ));
  })()
}
</CardGroup>

## How to Use Plugins

To install and use any of these plugins in your elizaOS project:

1. **Install the plugin** using bun or elizaos cli:
   ```bash
   bun install @elizaos/plugin-name
   # or
   elizaos plugins add @elizaos/plugin-name
   ```

2. **Import and register** the plugin in your agent configuration:
   ```typescript
   import { pluginName } from '@elizaos/plugin-name';
   
   const character = {
     // ... your character configuration
     plugins: [pluginName]
   };
   ```

3. **Configure the plugin** if it requires environment variables or additional setup (check the plugin's documentation for specific requirements)

## Contributing to the Registry

The plugin registry is community-driven. To add your plugin:

1. **Publish your plugin** to npm with the `@elizaos/plugin-` prefix
2. **Submit a pull request** to the [elizaOS Plugin Registry](https://github.com/elizaos-plugins/registry)
3. **Ensure compatibility** with elizaOS v1.x

<Tip>
For detailed guidance on creating and publishing plugins, check out our [Create a Plugin](/guides/create-a-plugin) and [Publish a Plugin](/guides/publish-a-plugin) guides.
</Tip>

## Registry Status

This registry automatically updates every few hours to reflect the latest plugins available in the elizaOS ecosystem. If you don't see a recently published plugin, please wait a few hours for the next sync.

<Warning>
Always review plugin documentation and source code before installation, especially for plugins that handle sensitive operations like wallet management or external API calls.
</Warning>
```