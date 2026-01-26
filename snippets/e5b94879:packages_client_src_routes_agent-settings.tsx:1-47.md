# e5b94879:packages_client_src_routes_agent-settings.tsx:1-47

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/routes/agent-settings.tsx:1-47
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AgentSettings from '@/components/agent-settings';
import { useElizaAgent } from '@/hooks/use-eliza';
import { Loader2 } from 'lucide-react';
import type { UUID, Agent } from '@elizaos/core';

export default function AgentSettingsRoute() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agent: agentData, isLoading } = useElizaAgent(agentId as UUID | undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Agent not found</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const agent: Agent = {
    ...agentData,
    createdAt: agentData.createdAt ?? Date.now(),
    bio: agentData.bio ?? [],
    topics: agentData.topics ?? [],
    adjectives: agentData.adjectives ?? [],
    style: agentData.style ?? { all: [], chat: [], post: [] },
    settings: agentData.settings ?? { secrets: {} },
  } as Agent;

  return (
    <div className="flex w-full justify-center px-4 sm:px-6 overflow-y-auto">
      <div className="w-full md:max-w-4xl py-6">
        <AgentSettings agent={agent} agentId={agentId as UUID} onSaveComplete={() => {}} />
      </div>
    </div>
  );
}
```