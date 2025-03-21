import { useAgentManagement } from '@/hooks/use-agent-management';
import { formatAgentName } from '@/lib/utils';
import type { Agent } from '@elizaos/core';
import { Cog, Loader2, Play, Square, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  agents: Agent[];
}

export default function ProfileOverlay({ isOpen, onClose, agent }: ProfileOverlayProps) {
  if (!isOpen) return null;

  const { startAgent, stopAgent, isAgentStarting, isAgentStopping } = useAgentManagement();

  const navigate = useNavigate();

  const isActive = (agent as Agent & { status?: string }).status === 'active';
  const isStarting = isAgentStarting(agent.id);
  const isStopping = isAgentStopping(agent.id);
  const isProcessing = isStarting || isStopping;

  // Button state configuration
  const buttonConfig = {
    label: isActive ? 'Stop' : 'Start',
    icon: isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />,
    variant: isActive ? 'destructive' : 'default',
  };

  if (isStarting) {
    buttonConfig.label = 'Starting...';
    buttonConfig.icon = <Loader2 className="animate-spin" />;
  } else if (isStopping) {
    buttonConfig.label = 'Stopping...';
    buttonConfig.icon = <Loader2 className="animate-spin" />;
  }

  // Handle agent start/stop
  const handleAgentToggle = () => {
    if (isProcessing) return;

    if (!isActive) {
      startAgent(agent);
    } else {
      stopAgent(agent);
    }
  };

  // Navigate to settings
  const navigateToSettings = () => {
    navigate(`/settings/${agent.id}`);
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
                    {agent.settings?.avatar ? (
                      <img
                        src={agent.settings.avatar}
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      formatAgentName(agent.name)
                    )}
                  </div>
                  <div
                    className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background ${
                      isActive ? 'bg-green-500' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-center mr-4">
                  <div className="text-xl font-bold truncate max-w-48">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (agent.id) {
                              navigator.clipboard.writeText(agent.id);
                            }
                          }}
                          onKeyUp={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              if (agent.id) {
                                navigator.clipboard.writeText(agent.id);
                              }
                            }
                          }}
                        >
                          ID: {agent.id ?? 'N/A'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Click to copy agent ID</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-auto">
          <div className="rounded-md bg-muted p-4 mb-6 h-60 overflow-y-auto">
            <p className="font-medium text-sm mb-2">About Me</p>
            <p className="font-light text-sm text-gray-500">{agent.system}</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-medium text-sm mb-2">Status</p>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                />
                <span className="text-sm">{isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Created</p>
              <p className="text-sm text-gray-500">
                {agent?.createdAt
                  ? new Date(agent.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Plugins</p>
              <div className="flex flex-wrap gap-2">
                {agent?.plugins?.length > 0 ? (
                  agent.plugins.map((plugin, index) => {
                    // Extract plugin name by removing the prefix
                    const pluginName = plugin
                      .replace('@elizaos/plugin-', '')
                      .replace('@elizaos-plugins/plugin-', '');
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                      >
                        {pluginName}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No plugins enabled</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 flex items-center justify-center"
              onClick={navigateToSettings}
            >
              <Cog className="w-4 h-4" />
            </Button>

            <Button
              variant={buttonConfig.variant}
              onClick={handleAgentToggle}
              disabled={isProcessing}
            >
              {buttonConfig.icon}
              <span className="ml-2">{buttonConfig.label}</span>
            </Button>
          </div>

          {isActive && (
            <Button variant="default" className="h-9" onClick={() => navigate(`/chat/${agent.id}`)}>
              Message
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
