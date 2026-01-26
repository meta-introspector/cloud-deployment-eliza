# e5b94879:packages_client_src_components_agent-log-viewer.tsx:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-log-viewer.tsx:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { Database, LoaderIcon, Search, Clock, Trash2, Filter, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useElizaAgents } from '../hooks/use-eliza';
import { getElizaClient } from '../lib/api-client-config';
import SocketIOManager, { type LogStreamData } from '../lib/socketio-manager';
import { useConfirmation } from '@/hooks/use-confirmation';
import ConfirmationDialog from './confirmation-dialog';

// Types
interface LogEntry {
  level: number;
  time: number;
  msg: string;
  agentId?: string;
  agentName?: string;
  roomId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface LogResponse {
  logs: LogEntry[];
  count: number;
  total: number;
  level: string;
  levels: string[];
}

interface AgentLogViewerProps {
  agentName?: string;
  level?: string;
}

// Log level mappings
const LOG_LEVEL_NUMBERS = {
  10: 'TRACE',
  20: 'DEBUG',
  27: 'SUCCESS',
  28: 'PROGRESS',
  29: 'LOG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL',
} as const;

// Helper functions
function getLevelName(level: number): string {
  return LOG_LEVEL_NUMBERS[level as keyof typeof LOG_LEVEL_NUMBERS] || 'UNKNOWN';
}

function getLevelColor(level: number): string {
  if (level >= 50) return 'bg-red-600/80'; // ERROR/FATAL - more muted red
  if (level >= 40) return 'bg-amber-600/80'; // WARN - more muted amber
  if (level >= 27) return 'bg-emerald-600/80'; // SUCCESS - more muted green
  return 'bg-slate-500'; // INFO/DEBUG/TRACE - neutral gray instead of blue
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function generateLogChart(logs: LogEntry[]) {
  // Group logs by hour for the last 24 hours
  const now = Date.now();
  const hours = 24;
  const hourlyData: Record<string, { info: number; errors: number }> = {};

  // Initialize all hours
  for (let i = hours - 1; i >= 0; i--) {
    const hourStart = new Date(now - i * 60 * 60 * 1000);
    hourStart.setMinutes(0, 0, 0);
    const key = hourStart.toISOString();
    hourlyData[key] = { info: 0, errors: 0 };
  }

  // Count logs by hour - filter logs to last 24 hours only
  const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
  logs.forEach((log) => {
    // Only count logs from the last 24 hours
    if (log.time >= twentyFourHoursAgo) {
      const logDate = new Date(log.time);
      logDate.setMinutes(0, 0, 0);
      const key = logDate.toISOString();

      if (hourlyData[key]) {
        if (log.level >= 50) {
          hourlyData[key].errors++;
        } else {
          hourlyData[key].info++;
        }
      }
    }
  });

  return Object.entries(hourlyData).map(([timestamp, counts]) => ({
    timestamp: new Date(timestamp),
    ...counts,
    total: counts.info + counts.errors,
  }));
}

function LogChart({ data }: { data: ReturnType<typeof generateLogChart> }) {
  const maxValue = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <span className="text-sm text-muted-foreground">
              Info{' '}
              <span className="font-mono">
                {data.reduce((sum, d) => sum + d.info, 0).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600/80"></div>
            <span className="text-sm text-muted-foreground">
              Errors{' '}
              <span className="font-mono">
                {data.reduce((sum, d) => sum + d.errors, 0).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {data[data.length - 1]?.timestamp.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
```