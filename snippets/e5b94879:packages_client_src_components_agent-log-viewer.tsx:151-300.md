# e5b94879:packages_client_src_components_agent-log-viewer.tsx:151-300

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-log-viewer.tsx:151-300
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          - (UTC-7)
        </div>
      </div>

      <div className="h-32 flex items-end gap-1 bg-muted/30 rounded p-4">
        {data.map((point, index) => {
          return (
            <div key={index} className="flex-1 flex flex-col justify-end">
              <div
                key={`${point.timestamp.getTime()}-info`}
                style={{ height: `${(point.info / maxValue) * 100}%` }}
                className="bg-slate-500 rounded-sm min-h-[2px] transition-all duration-200"
                title={`${point.timestamp.toLocaleTimeString()}: ${point.info} info logs`}
              />
              <div
                key={`${point.timestamp.getTime()}-errors`}
                style={{ height: `${(point.errors / maxValue) * 100}%` }}
                className="bg-red-600/80 rounded-sm min-h-[2px] transition-all duration-200"
                title={`${point.timestamp.toLocaleTimeString()}: ${point.errors} error logs`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>
          {data[0]?.timestamp.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <span>
          {data[data.length - 1]?.timestamp.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="text-center">
          <h3 className="font-medium">Loading Logs</h3>
          <p className="text-sm text-muted-foreground">Fetching system logs...</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  selectedLevel,
  searchQuery,
}: {
  selectedLevel: string;
  searchQuery: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Database className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium mb-2">No Logs Found</h3>
      <p className="text-muted-foreground max-w-md">
        {searchQuery
          ? `No logs match "${searchQuery}". Try adjusting your search or filter.`
          : selectedLevel === 'all'
            ? 'No logs available. Logs will appear here as the system generates them.'
            : `No ${selectedLevel.toUpperCase()} logs found.`}
      </p>
    </div>
  );
}

export function AgentLogViewer({ agentName, level }: AgentLogViewerProps) {
  const [selectedLevel, setSelectedLevel] = useState(level || 'all');
  const [selectedAgentName, setSelectedAgentName] = useState(agentName || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7 days');
  const [isLive, setIsLive] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [wsLogs, setWsLogs] = useState<LogEntry[]>([]);
  const [useWebSocket, setUseWebSocket] = useState(false);
  const queryClient = useQueryClient();

  const { confirm, isOpen, onOpenChange, onConfirm, options } = useConfirmation();

  // Use real hooks from the existing codebase
  const {
    data: logResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<LogResponse>({
    queryKey: ['logs', selectedLevel, selectedAgentName],
    queryFn: async () => {
      const elizaClient = getElizaClient();
      return await elizaClient.system.getGlobalLogs({
        level: selectedLevel === 'all' ? '' : selectedLevel,
        agentName: selectedAgentName === 'all' ? undefined : selectedAgentName,
      });
    },
    refetchInterval: isLive && !useWebSocket ? 5000 : false,
    staleTime: 1000,
    enabled: true, // Always enable the query
  });

  const { agents } = useElizaAgents();

  // WebSocket log streaming integration
  const handleLogStream = useCallback(
    (logEntry: LogStreamData) => {
      // Filter logs based on current filters
      const shouldInclude =
        (selectedLevel === 'all' ||
          getLevelName(logEntry.level).toLowerCase() === selectedLevel.toLowerCase()) &&
        (selectedAgentName === 'all' || logEntry.agentName === selectedAgentName);

      if (shouldInclude) {
        setWsLogs((prev) => {
          const newLogs = [logEntry, ...prev].slice(0, 1000); // Keep last 1000 logs
          return newLogs;
        });
      }
    },
    [selectedLevel, selectedAgentName]
  );

  // Setup WebSocket event listeners
  useEffect(() => {
    if (isLive && useWebSocket) {
      const socketManager = SocketIOManager.getInstance();

      // Subscribe to log stream
      socketManager.subscribeToLogStream().catch(console.error);

      // Listen for log events
      socketManager.on('logStream', handleLogStream);

```