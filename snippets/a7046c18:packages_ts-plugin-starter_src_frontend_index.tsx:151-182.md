# a7046c18:packages_ts-plugin-starter_src_frontend_index.tsx:151-182

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/frontend/index.tsx:151-182
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  shortLabel?: string; // Optional short label for mobile
}

interface PanelProps {
  agentId: string;
}

/**
 * Example panel component for the plugin system
 */
const PanelComponent: React.FC<PanelProps> = ({ agentId }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Example Panel</h2>
      <div>Hello {agentId}!</div>
    </div>
  );
};

// Export the panel configuration for integration with the agent UI
export const panels: AgentPanel[] = [
  {
    name: "Example",
    path: "example",
    component: PanelComponent,
    icon: "Book",
    public: false,
    shortLabel: "Example",
  },
];

export * from "./utils";
```