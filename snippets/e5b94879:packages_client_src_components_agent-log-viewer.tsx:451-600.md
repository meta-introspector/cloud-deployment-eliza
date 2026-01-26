# e5b94879:packages_client_src_components_agent-log-viewer.tsx:451-600

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-log-viewer.tsx:451-600
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-100px)] min-h-[400px] w-full">
        {/* Header Controls */}
        <div className="flex items-center gap-3 mb-6 px-4 pt-4 flex-none">
          {/* Filter dropdown */}
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-32 h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Full-text log search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Agent filter */}
          {agentNames && agentNames.length > 0 && !agentName && (
            <Select value={selectedAgentName} onValueChange={setSelectedAgentName}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL AGENTS</SelectItem>
                {agentNames?.map((name) => (
                  <SelectItem key={name} value={name!}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Time range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 h-9">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 hour">1 hour</SelectItem>
              <SelectItem value="6 hours">6 hours</SelectItem>
              <SelectItem value="24 hours">24 hours</SelectItem>
              <SelectItem value="7 days">7 days</SelectItem>
              <SelectItem value="30 days">30 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh */}
          <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 w-9 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Live toggle */}
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="h-9 px-3"
            title={
              isLive
                ? useWebSocket
                  ? 'Live mode (WebSocket)'
                  : 'Live mode (Polling)'
                : 'Live mode disabled'
            }
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
            />
            Live
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden px-4 pb-4">
          {filteredLogs.length === 0 ? (
            <EmptyState selectedLevel={selectedLevel} searchQuery={searchQuery} />
          ) : (
            <div className="space-y-6">
              {/* Analytics Chart */}
              <LogChart data={chartData} />

              {/* Log Table */}
              <div className="border rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-muted/50 border-b px-4 py-3">
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                    <div className="text-sm font-medium text-muted-foreground">Message</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {filteredLogs.slice(0, 100).map((log, index) => (
                    <div
                      key={`${log.time}-${log.msg}-${index}`}
                      className="grid grid-cols-[200px_1fr] gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Timestamp with level indicator */}
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-6 rounded-full ${getLevelColor(log.level)}`} />
                        <div className="text-sm font-mono text-muted-foreground">
                          {formatTimestamp(log.time)}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="font-mono text-sm leading-relaxed break-all">{log.msg}</div>
                        {log.agentName && (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {log.agentName}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show more indicator */}
                {filteredLogs.length > 100 && (
                  <div className="border-t bg-muted/30 px-4 py-3 text-center">
                    <span className="text-sm text-muted-foreground">
```