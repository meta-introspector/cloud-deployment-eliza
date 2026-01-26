# e5b94879:packages_client_src_components_agent-log-viewer.tsx:301-450

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-log-viewer.tsx:301-450
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
      return () => {
        socketManager.off('logStream', handleLogStream);
        socketManager.unsubscribeFromLogStream().catch(console.error);
      };
    }
  }, [isLive, useWebSocket, handleLogStream]);

  // Toggle WebSocket usage when live mode changes
  useEffect(() => {
    if (isLive) {
      // When enabling live mode, try to start WebSocket. Fallback to polling if WebSocket fails
      if (SocketIOManager.isConnected()) {
        setUseWebSocket(true);
      } else {
        // WebSocket not available, continue with API polling
        setUseWebSocket(false);
      }
    } else {
      // When disabling live mode, stop WebSocket and clear WebSocket logs
      setUseWebSocket(false);
      setWsLogs([]);
    }
  }, [isLive]);

  // Update WebSocket filters when selectedAgentName or selectedLevel changes
  useEffect(() => {
    if (useWebSocket && isLive) {
      const socketManager = SocketIOManager.getInstance();
      socketManager
        .updateLogStreamFilters({
          agentName: selectedAgentName,
          level: selectedLevel,
        })
        .catch(console.error);
    }
  }, [selectedAgentName, selectedLevel, useWebSocket, isLive]);

  // Combine API logs and WebSocket logs
  const apiLogs = logResponse?.logs || [];

  // Smart fallback: If WebSocket has significantly fewer logs than API, use API logs
  // This handles cases where WebSocket streaming isn't working properly
  let combinedLogs;
  if (useWebSocket && isLive && wsLogs.length > 0) {
    // If WebSocket has logs, use them
    combinedLogs = wsLogs;
  } else {
    // Use API logs (either not using WebSocket, or WebSocket has no logs)
    combinedLogs = apiLogs;
  }

  // Sort logs by timestamp in descending order (newest first)
  const logs = combinedLogs.sort((a, b) => b.time - a.time);
  const levels = logResponse?.levels || [];
  const agentNames = agents?.map((agent) => agent.name) || [];

  // Filter and search logs
  const filteredLogs = logs.filter((log: LogEntry) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        log.msg,
        log.agentName,
        log.roomId,
        getLevelName(log.level),
        ...Object.entries(log)
          .filter(([key]) => !Number.isNaN(Number(key)))
          .map(([_, value]) => String(value)),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    }
    return true;
  });

  const chartData = generateLogChart(filteredLogs);

  const handleClearLogs = () => {
    confirm(
      {
        title: 'Clear All Logs',
        description:
          'Are you sure you want to permanently delete all system logs? This action cannot be undone.',
        confirmText: 'Delete',
        variant: 'destructive',
      },
      async () => {
        try {
          setIsClearing(true);
          const elizaClient = getElizaClient();
          await elizaClient.system.deleteGlobalLogs();
          queryClient.invalidateQueries({ queryKey: ['logs'] });

          // Also clear WebSocket logs if in WebSocket mode
          if (useWebSocket) {
            setWsLogs([]);
          }
        } catch (error) {
          console.error('Failed to clear logs:', error);
        } finally {
          setIsClearing(false);
        }
      }
    );
  };

  const handleRefresh = () => {
    if (useWebSocket && isLive) {
      // In WebSocket mode, clear current logs and let them re-populate
      setWsLogs([]);
    } else if (refetch) {
      // In API mode, refetch from server
      refetch();
    }
  };

  // Loading state
  if (isLoading && logs.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] min-h-[400px] w-full">
        <LoadingIndicator />
      </div>
    );
  }

  // Error state
  if (error) {
    const isEndpointNotFound =
      error.message?.includes('404') ||
      error.message?.includes('endpoint not found') ||
      error.message?.includes('Not Found');
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] min-h-[400px] w-full">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center max-w-md">
            <Database className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-medium mb-2">
              {isEndpointNotFound ? 'Global Logs API Not Available' : 'Failed to Load Logs'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isEndpointNotFound
                ? 'The server does not have the global logs API endpoint configured. You can still view individual agent logs from the agent details pages.'
                : `There was an error loading the system logs: ${error.message}`}
            </p>
            {!isEndpointNotFound && (
              <Button variant="outline" size="sm" onClick={() => refetch?.()}>
                <RefreshCw className="h-4 w-4 mr-2" />
```