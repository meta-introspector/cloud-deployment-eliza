# e5b94879:packages_client_src_components_chat.tsx:301-450

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/chat.tsx:301-450
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
            <>
              <CopyButton text={message.text} />
              <ChatTtsButton agentId={agentForTts.id} text={message.text} />
            </>
          )}
          {isUser && message.text && !message.isLoading && onRetry && (
            <RetryButton onClick={() => onRetry(message.text || '')} />
          )}
          <DeleteButton onClick={() => onDelete(message.id as string)} />
        </div>
      </div>
    </div>
  );
}

export default function Chat({
  chatType,
  contextId,
  messageServerId,
  initialDmChannelId,
}: UnifiedChatViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current server ID from backend if not provided as prop
  const { data: currentMessageServerId, isLoading: isLoadingMessageServerId } =
    useCurrentMessageServer();

  // Use persistent sidebar state
  const { isVisible: showSidebar, setSidebarVisible, toggleSidebar } = useSidebarState();
  const {
    mainPanelSize,
    sidebarPanelSize,
    isFloatingMode: isFloatingModeFromWidth,
    setMainPanelSize,
    setSidebarPanelSize,
  } = usePanelWidthState();

  // Consolidate all chat UI state into a single object (excluding showSidebar which is now managed separately)
  const [chatState, setChatState] = useState<ChatUIState>({
    showGroupEditPanel: false,
    showProfileOverlay: false,
    input: '',
    inputDisabled: false,
    selectedGroupAgentId: null,
    currentDmChannelId: null,
    isCreatingDM: false,
    isMobile: false,
  });

  const location = useLocation();
  const state = location.state as ChatLocationState | null;
  const forceNew = state?.forceNew || false;

  const navigate = useNavigate();

  const [shouldForceNew, setShouldForceNew] = useState(forceNew);

  // Determine if we should use floating mode - either from width detection OR mobile
  const isFloatingMode = isFloatingModeFromWidth || chatState.isMobile;

  // Confirmation dialogs
  const { confirm, isOpen, onOpenChange, onConfirm, options } = useConfirmation();

  const { stopAgent, isAgentStopping } = useAgentManagement();

  // Helper to update chat state
  const updateChatState = useCallback((updates: Partial<ChatUIState>) => {
    setChatState((prev) => ({ ...prev, ...updates }));
  }, []);

  const currentClientEntityId = getEntityId();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputDisabledRef = useRef<boolean>(false);
  const hasHandledInitialUrl = useRef<boolean>(false);
  const chatTitleRef = useRef<string>('');

  // For DM, we need agent data. For GROUP, we need channel data
  const { data: agentDataResponse, isLoading: isLoadingAgent } = useAgent(
    chatType === ChannelType.DM ? contextId : undefined,
    { enabled: chatType === ChannelType.DM }
  );

  const targetAgentData: Agent | undefined = agentDataResponse?.data;

  const { handleDelete: handleDeleteAgent, isDeleting: isDeletingAgent } = useDeleteAgent(
    targetAgentData || ({} as Agent) // Provide safe default if undefined
  );

  // Calculate finalMessageServerIdForHooks FIRST, before using it in hooks below
  const finalMessageServerIdForHooks: UUID | undefined = useMemo(() => {
    // Priority: messageServerId prop > fetched currentMessageServerId > fallback to DEFAULT_MESSAGE_SERVER_ID
    return messageServerId || currentMessageServerId || DEFAULT_MESSAGE_SERVER_ID;
  }, [messageServerId, currentMessageServerId]);
  // Use the new hooks for DM channel management - NOW using finalMessageServerIdForHooks
  const { data: agentDmChannels = [], isLoading: isLoadingAgentDmChannels } = useDmChannelsForAgent(
    chatType === ChannelType.DM ? contextId : undefined,
    finalMessageServerIdForHooks
  );

  const createDmChannelMutation = useCreateDmChannel();

  // Group chat specific data
  const { data: channelDetailsData } = useChannelDetails(
    chatType === ChannelType.GROUP ? contextId : undefined
  );
  const { data: participantsData } = useChannelParticipants(
    chatType === ChannelType.GROUP ? contextId : undefined
  );
  const participants = participantsData?.data;

  const { data: agentsResponse } = useAgentsWithDetails();
  const allAgents = agentsResponse?.agents || [];

  const latestChannel = agentDmChannels[0]; // adjust sorting if needed

  // Get the final channel ID for hooks
  const finalChannelIdForHooks: UUID | undefined =
    chatType === ChannelType.DM
      ? chatState.currentDmChannelId || undefined
      : contextId || undefined;

  const { data: latestChannelMessages = [], isLoading: isLoadingLatestChannelMessages } =
    useChannelMessages(latestChannel?.id, finalMessageServerIdForHooks);

  const {
    messages,
    isLoading: isLoadingMessages,
    addMessage,
    updateMessage,
    removeMessage,
    sendMessage,
  } = useElizaChat({
    channelId: finalChannelIdForHooks,
    serverId: finalMessageServerIdForHooks,
    agentId: chatType === ChannelType.DM ? contextId : undefined,
    chatType,
    onMessageAdded: (message: UiMessage) => {
      updateChatTitle();
      if (message.isAgent) safeScrollToBottom();
    },
    onMessageUpdated: (_id: UUID, updates: Partial<UiMessage>) => {
      if (!updates.isLoading && updates.isLoading !== undefined) safeScrollToBottom();
    },
    onInputDisabledChange: (disabled: boolean) => updateChatState({ inputDisabled: disabled }),
  });

```