# a7046c18:packages_docs_projects_overview.mdx:301-421

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/projects/overview.mdx:301-421
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    **Web Application Template**
    
    Production-ready web interface for agents:
    - Real-time chat with Socket.IO
    - Document management system
    - Automatic API proxying
    - Debug panel for development
    - Ready for Vercel/Netlify deployment
  </Card>
</CardGroup>

<Info>
  **Want more inspiration?** Check out [What You Can Build](/what-you-can-build) to see other agents you can create: trading bots, content creators, business automation, virtual NPCs, and more.
</Info>

## Testing Projects

Projects include comprehensive testing capabilities:

```bash
# Run all tests
elizaos test

# Component tests only
elizaos test --type component

# End-to-end tests
elizaos test --type e2e

# Filter by test name
elizaos test --name "character configuration"
```

<Tip>
  See the [Test a Project](/guides/test-a-project) guide for comprehensive testing strategies.
</Tip>

## Deployment Options

Projects come ready to be deployed out of the box. They include Dockerfiles so you can deploy using containers, or you can easily push your project to GitHub and use a managed cloud service.

See the [Deploy a Project](/guides/deploy-a-project) guide for detailed instructions on all deployment methods.

## FAQ

<AccordionGroup>
  <Accordion title="What's the difference between an agent, a plugin, and a project?">
    **Agent**: A single AI personality with specific capabilities defined by its character configuration and plugins.
    
    **Plugin**: A reusable module that adds specific capabilities (like Twitter integration, web search, or trading features) to agents.
    
    **Project**: The container application that runs one or more agents. It's your development workspace and what you deploy to production.
    
    **Key relationships:**
    - A project **has one or many** agents
    - Agents **import/use** plugins via their character configuration
    - Plugins are **reusable across** projects and agents
    - You can't have a project within a project or a project within a plugin
    - Projects are the top-level containers for agents and plugins
    - Plugin configuration can be defined at the project level (API keys in project `.env`) or agent-specific (in the character's `secrets` array)
    
    Think of it this way: Agents are the "who" (personalities), Plugins are the "what" (capabilities), Projects are the "where" (application container).
  </Accordion>
  
  <Accordion title="Can I develop plugins within a project?">
    Yes! You can create custom plugins in your project's `src/plugins/` directory and test them locally.
    
    You can also develop a standalone plugin with `elizaos create --type plugin`. If you run `elizaos dev` from that plugin directory, it will spin up with a test agent. But ultimately, everyone will want to add that plugin to a project at some point.
    
    See the [Create a Plugin](/guides/create-a-plugin) guide for details.
  </Accordion>
  
  <Accordion title="Do I need the entire elizaOS monorepo to develop?">
    No! That's the beauty of projects. When you create a project with `elizaos create`, you get a standalone workspace with just what you need. The CLI and core packages provide all the framework functionality without the monorepo complexity.
  </Accordion>
  
  <Accordion title="How do agents communicate in multi-agent projects?">
    Agents in the same project can communicate through:
    - Shared memory systems
    - Message passing via the runtime
    - Event-driven coordination
    - Shared service instances
    
    See the [Add Multiple Agents](/guides/add-multiple-agents) guide for patterns.
  </Accordion>
  
  <Accordion title="Can different agents use different model providers?">
    Yes! Each agent can configure its own model provider through settings:
    ```typescript
    settings: {
      modelProvider: 'anthropic', // or 'openai', 'llama', etc.
    }
    ```
  </Accordion>
  
  <Accordion title="What's the best way to deploy my project?">
    It depends on what you're comfortable with. We support managed cloud, Docker, bare metal, whatever you like.
    
    See the [Deploy a Project](/guides/deploy-a-project) guide for detailed information on all deployment options.
  </Accordion>
</AccordionGroup>

## See Also

<CardGroup cols={2}>
  <Card title="Quickstart" icon="play" href="/quickstart">
    Get started in under 5 minutes
  </Card>
  
  <Card title="Customize an Agent" icon="palette" href="/guides/customize-an-agent">
    Learn to configure agent personalities
  </Card>
  
  <Card title="CLI Reference" icon="terminal" href="/cli-reference/overview">
    Complete command reference
  </Card>
  
  <Card title="REST Reference" icon="code" href="/rest-reference">
    REST API documentation
  </Card>
</CardGroup>
```