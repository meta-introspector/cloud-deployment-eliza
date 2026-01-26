# e5b94879:packages_client_src_components_profile-overlay.tsx:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/profile-overlay.tsx:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { useAgentManagement } from '@/hooks/use-agent-management';
import { useToast } from '@/hooks/use-toast';
import { exportCharacterAsJson } from '@/lib/export-utils';
import { formatAgentName, moment } from '@/lib/utils';
import type { Agent, UUID } from '@elizaos/core';
import { AgentStatus } from '@elizaos/core';
import { Brain, Loader2, Play, X, Download, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useElizaAgent } from '../hooks/use-eliza';
import StopAgentButton from './stop-agent-button';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: UUID;
}

/**
 * Displays a modal overlay with detailed information and controls for a specific agent.
 *
 * Renders an interactive profile card for the agent identified by {@link agentId}, including avatar, status, metadata, capabilities, plugins, and action buttons for starting, stopping, messaging, and navigating to settings. The overlay is visible when {@link isOpen} is true and can be closed via the provided callback.
 *
 * @param isOpen - Whether the overlay is visible.
 * @param onClose - Callback invoked to close the overlay.
 * @param agentId - UUID of the agent whose profile is displayed.
 *
 * @returns The profile overlay component, or null if not open.
 */
export default function ProfileOverlay({ isOpen, onClose, agentId }: ProfileOverlayProps) {
  if (!isOpen) return null;

  const { startAgent, isAgentStarting, isAgentStopping } = useAgentManagement();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { agent } = useElizaAgent(agentId);

  const isActive = agent?.status === AgentStatus.ACTIVE;
  const isStarting = isAgentStarting(agentId);
  const isStopping = isAgentStopping(agentId);
  const isProcessing = isStarting || isStopping;

  // Start button configuration
  const startButtonConfig = {
    label: 'Start',
    icon: <Play className="w-4 h-4" />,
  };

  if (isStarting) {
    startButtonConfig.label = 'Starting...';
    startButtonConfig.icon = <Loader2 className="animate-spin w-4 h-4" />;
  }

  // Handle agent start
  const handleAgentStart = () => {
    if (isProcessing) return;
    startAgent(agent!);
  };

  // Handle character export
  const handleExportCharacter = () => {
    if (!agent) return;

    // Ensure agent has required properties for export
    const agentForExport = {
      ...agent,
      createdAt: agent.createdAt || Date.now(),
      updatedAt: agent.updatedAt || Date.now(),
    } as Agent;

    exportCharacterAsJson(agentForExport, toast);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClose();
        }
      }}
    >
      <Card
        className="flex flex-col w-full max-w-md md:max-w-xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="p-0 space-y-0">
          <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 w-full flex items-end bg-gradient-to-b from-primary/20 to-background">
            <div className="flex w-full justify-between items-end">
              <div className="flex flex-col gap-2">
                <div className="w-24 h-24 flex justify-center items-center relative">
                  <div className="text-4xl bg-muted rounded-full h-full w-full flex justify-center items-center overflow-hidden border-4 border-background">
                    {typeof agent?.settings?.avatar === 'string' ? (
                      <img
                        src={agent.settings.avatar}
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      formatAgentName(agent?.name ?? '')
                    )}
                  </div>
                  <div
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${
                      isActive ? 'bg-emerald-500' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-center mr-4">
                  <div className="text-xl font-bold truncate max-w-48">{agent?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (agent?.id) {
                              navigator.clipboard.writeText(agent.id);
                            }
                          }}
                          onKeyUp={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              if (agent?.id) {
                                navigator.clipboard.writeText(agent.id);
                              }
                            }
                          }}
                        >
                          ID: {agent?.id ?? 'N/A'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Click to copy agent ID</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
```