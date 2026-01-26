# e5b94879:packages_client_src_components_profile-overlay.tsx:151-281

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/profile-overlay.tsx:151-281
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-auto">
          <div className="rounded-md bg-muted p-4 mb-6 max-h-60 overflow-y-auto">
            <p className="font-medium text-sm mb-2">About Me</p>
            <p className="font-light text-sm text-gray-500">{agent?.system}</p>
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
              <p className="font-medium text-sm mb-2">Model</p>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {typeof agent?.settings?.model === 'string'
                    ? agent.settings.model
                    : agent?.settings?.model !== undefined
                      ? String(agent.settings.model)
                      : 'Default'}
                </span>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Created</p>
              <p className="text-sm text-gray-500">
                {agent?.createdAt ? moment(agent.createdAt).format('LLL') : moment().format('LLL')}
              </p>
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Plugins</p>
              <div className="flex flex-wrap gap-2">
                {agent?.plugins && agent.plugins.length > 0 ? (
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
            {isActive ? (
              <StopAgentButton agent={agent} showIcon={true} size="default" className="h-9" />
            ) : (
              <Button
                variant="default"
                onClick={handleAgentStart}
                disabled={isProcessing}
                className="h-9"
              >
                {startButtonConfig.icon}
                <span className="ml-2">{startButtonConfig.label}</span>
              </Button>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleExportCharacter}
                  disabled={!agent}
                  className="h-9"
                  size="sm"
                >
                  Export
                  <Download size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Export character as JSON</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/settings/${agentId}`)}
                  disabled={!agent}
                  className="h-9"
                  size="sm"
                >
                  <Settings size={16} className="mr-1" />
                  Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Configure agent settings</p>
              </TooltipContent>
            </Tooltip>
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
```