# a7046c18:packages_docs_plugin-registry_registry.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/registry.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Plugin Registry"
description: "Browse the complete collection of available elizaOS plugins. This registry is updated in real-time with the latest 1.x compatible plugins from the community."
---



<Info>
This registry automatically syncs with the official [elizaOS Plugin Registry](https://github.com/elizaos-plugins/registry) to show you the most up-to-date plugins available for your elizaOS agents.
</Info>

## Available Plugins

<CardGroup cols={2}>
{
  (() => {
    const [plugins, setPlugins] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
      const fetchPlugins = async () => {
        try {
          const response = await fetch('https://raw.githubusercontent.com/elizaos-plugins/registry/refs/heads/main/generated-registry.json');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch plugins: ${response.status}`);
          }
          
          const data = await response.json();
          
          const v1Plugins = Object.entries(data.registry)
            .filter(([_, plugin]) => plugin.supports && plugin.supports.v1)
            .map(([name, plugin]) => ({
              name,
              description: plugin.description || 'No description available',
              repo: plugin.git?.repo,
              version: plugin.npm?.v1,
              repoUrl: plugin.git?.repo ? `https://github.com/${plugin.git.repo}` : null,
              displayName: name
                .replace('@elizaos/plugin-', '')
                .replace('@elizaos/client-', '')
                .replace('@elizaos/adapter-', '')
                .replace(/^plugin-/, '')
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase()),
              category: plugin.category || 'General',
              tags: plugin.tags || [],
              stars: plugin.stargazers_count || 0,
              language: plugin.language
            }))
            .sort((a, b) => {
              // Sort by stars (descending), then by name (ascending) as tiebreaker
              if (b.stars !== a.stars) {
                return b.stars - a.stars;
              }
              return a.name.localeCompare(b.name);
            });

          setPlugins(v1Plugins);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch plugins:', error);
          setError(error.message);
          setLoading(false);
        }
      };

      fetchPlugins();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading v1 compatible plugins...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">
            <div className="font-semibold">Failed to load plugins</div>
            <div className="text-sm mt-1">{error}</div>
            <div className="text-sm mt-2">
              Please try refreshing the page or visit the{' '}
              <a 
                href="https://github.com/elizaos-plugins/registry" 
                className="underline hover:text-red-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                official registry
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (plugins.length === 0) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">
            No v1 compatible plugins found in the registry.
          </div>
        </div>
      );
    }

    return plugins.map(plugin => (
      <Card 
        key={plugin.name}
        title={plugin.displayName}
        icon="puzzle-piece"
        href={plugin.repoUrl}
      >
        <div className="space-y-2">
          <div className="text-sm font-mono text-gray-600">
            {plugin.name}
          </div>
          
          {plugin.description && (
            <div className="text-sm">
              {plugin.description}
            </div>
          )}
          
          <div className="flex items-center align-center gap-2 flex-wrap">
            
            {plugin.stars > 0 && (
              <span className="inline-flex items-center align-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
                <Icon icon="star"  size={12} /> {plugin.stars}
              </span>
            )}
            
            {plugin.version && (
              <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                v{plugin.version}
              </span>
            )}
           
         
          </div>
          
          {plugin.tags && plugin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {plugin.tags.slice(0, 3).map(tag => (
```