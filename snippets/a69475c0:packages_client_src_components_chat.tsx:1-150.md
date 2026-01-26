# a69475c0:packages_client_src_components_chat.tsx:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/client/src/components/chat.tsx:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
import CopyButton from '@/components/copy-button';
import DeleteButton from '@/components/delete-button';
import RetryButton from '@/components/retry-button';
import MediaContent from '@/components/media-content';
import ProfileOverlay from '@/components/profile-overlay';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { useConfirmation } from '@/hooks/use-confirmation';
import { ChatBubbleMessage, ChatBubbleTimestamp } from '@/components/ui/chat/chat-bubble';
import ChatTtsButton from '@/components/ui/chat/chat-tts-button';
import { Response as AiResponse } from '@/components/ai-elements/response';
import { useAutoScroll } from '@/components/ui/chat/hooks/useAutoScroll';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SplitButton } from '@/components/ui/split-button';
import { Tool, type ToolPart } from '@/components/actionTool';
import { CHAT_SOURCE, GROUP_CHAT_SOURCE, USER_NAME } from '@/constants';
import { useFileUpload } from '@/hooks/use-file-upload';
import {
  useAgent,
  useAgentsWithDetails,
  useChannelDetails,
  useChannelMessages,
  useChannelParticipants,
  useClearChannelMessages,
  useDeleteChannelMessage,
  type UiMessage,
} from '@/hooks/use-query-hooks';
import { useSocketChat } from '@/hooks/use-socket-chat';
import { useToast } from '@/hooks/use-toast';
import { getElizaClient } from '@/lib/api-client-config';
import clientLogger from '@/lib/logger';
import { parseMediaFromText, removeMediaUrlsFromText, type MediaInfo } from '@/lib/media-utils';
import {
  cn,
  generateGroupName,
  getAgentAvatar,
  getEntityId,
  moment,
  randomUUID,
} from '@/lib/utils';
import type { Agent, Media, UUID } from '@elizaos/core';
import {
  AgentStatus,
  ChannelType,
  ContentType as CoreContentType,
  validateUuid,
} from '@elizaos/core';
import { useQueryClient } from '@tanstack/react-query';
import {
  Trash,
  StopCircle,
  ArrowUpFromLine,
  Edit,
  Eraser,
  Clock,
  ChevronDown,
  Loader2,
  PanelRight,
  PanelRightClose,
  Plus,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgentSidebar } from './agent-sidebar';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessageListComponent } from './ChatMessageListComponent';
import GroupPanel from './group-panel';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreateDmChannel, useDmChannelsForAgent } from '@/hooks/use-dm-channels';
import { useCurrentMessageServer } from '@/hooks/use-current-server';
import { useSidebarState } from '@/hooks/use-sidebar-state';
import { usePanelWidthState } from '@/hooks/use-panel-width-state';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { MessageChannel } from '@/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAgentManagement } from '@/hooks/use-agent-management';
import { useDeleteAgent } from '@/hooks/use-delete-agent';
import { exportCharacterAsJson } from '@/lib/export-utils';
moment.extend(relativeTime);

// Fallback server ID used when no actual server ID is available from the API
// This should only be used as a last resort - prefer passing the real messageServerId from props
const DEFAULT_MESSAGE_SERVER_ID = '00000000-0000-0000-0000-000000000000' as UUID;

// Helper function to convert action message to ToolPart format
const convertActionMessageToToolPart = (message: UiMessage): ToolPart => {
  // rawMessage is unknown, but we need to access its properties
  interface RawMessageWithActionStatus {
    actionStatus?: string;
    actions?: string[];
    action?: string;
    thought?: string;
    text?: string;
    actionId?: string;
    actionResult?: unknown;
  }
  const rawMessage = (message.rawMessage as RawMessageWithActionStatus) || {};

  // Map actionStatus to ToolPart state
  const mapActionStatusToState = (status: string): ToolPart['state'] => {
    switch (status) {
      case 'pending':
      case 'executing':
      case 'running':
        return 'input-streaming';
      case 'completed':
      case 'success':
        return 'output-available';
      case 'failed':
      case 'error':
        return 'output-error';
      default:
        return 'input-available';
    }
  };

  // Get the primary action name (first action or fallback to message type)
  const actionName = rawMessage.actions?.[0] || rawMessage.action || 'ACTION';
  const actionStatus = rawMessage.actionStatus || 'completed';
  const actionId = rawMessage.actionId;

  // Create input data from available action properties
  const inputData: Record<string, unknown> = {};
  if (rawMessage.actions) inputData.actions = rawMessage.actions;
  if (rawMessage.action) inputData.action = rawMessage.action;
  if (rawMessage.thought) inputData.thought = rawMessage.thought;

  // Create output data based on status and content
  const outputData: Record<string, unknown> = {};
  if (rawMessage.text) outputData.result = rawMessage.text;
  if (actionStatus) outputData.status = actionStatus;
  if (rawMessage.thought) outputData.thought = rawMessage.thought;
  if (rawMessage.actionResult) outputData.actionResult = rawMessage.actionResult;

  // Handle error cases
  const isError = actionStatus === 'failed' || actionStatus === 'error';
  const errorText = isError ? rawMessage.text || 'Action failed' : undefined;

  return {
```