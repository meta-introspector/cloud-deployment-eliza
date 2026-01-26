# e5b94879:packages_client_src_routes_agent-detail.tsx:1-28

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/routes/agent-detail.tsx:1-28
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import React from 'react';
import { useParams } from 'react-router-dom';
import { useElizaAgent } from '@/hooks/use-eliza';
import type { UUID } from '@elizaos/core';

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agent, isLoading, error } = useElizaAgent(id as UUID | undefined);

  if (isLoading) return <div>Loading agent details...</div>;
  if (error) return <div>Error loading agent: {(error as Error).message}</div>;
  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">{agent.name}</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4 shadow-sm">
          <h2 className="text-xl font-semibold">Agent Details</h2>
          <p className="text-sm text-gray-500">ID: {agent.id}</p>
          {/* Additional agent details can be added here */}
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
```