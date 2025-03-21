import { UUID } from '@elizaos/core';
import { Avatar, AvatarImage } from './ui/avatar';
import { formatAgentName } from '@/lib/utils';

interface AgentAvatarStackProps {
  agentIds: UUID[];
  agentNames: string[];
  agentAvatars: Record<string, string | null>;
  size?: 'sm' | 'md' | 'lg';
  maxStack?: number;
}

export default function AgentAvatarStack({
  agentIds,
  agentNames,
  agentAvatars,
  size = 'md',
  maxStack = 2,
}: AgentAvatarStackProps) {
  const displayAgents = agentIds.slice(0, maxStack);
  const isMultiple = displayAgents.length > 1;

  const baseSize = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;
  const avatarSizeClass = isMultiple
    ? size === 'sm'
      ? 'size-5'
      : size === 'lg'
        ? 'size-9'
        : 'size-7'
    : size === 'sm'
      ? 'size-6'
      : size === 'lg'
        ? 'size-10'
        : 'size-8';

  const avatarOffset = Math.floor(baseSize * (0.6 / maxStack));

  const getAvatarContent = (agentId: UUID, index: number) => {
    const avatarSrc = agentAvatars[agentId] || '/elizaos-icon.png';
    return agentAvatars[agentId] ? (
      <AvatarImage src={avatarSrc} alt="Agent avatar" />
    ) : (
      <div className="rounded-full bg-gray-600 w-full h-full flex-shrink-0 flex items-center justify-center">
        {formatAgentName(agentNames[index])}
      </div>
    );
  };

  return (
    <div
      className="relative flex items-center text-xs"
      style={{ height: baseSize, width: baseSize }}
    >
      {displayAgents.length === 1 ? (
        <Avatar className={`${avatarSizeClass} rounded-full overflow-hidden`}>
          {getAvatarContent(displayAgents[0], 0)}
        </Avatar>
      ) : (
        displayAgents.map((agentId, index) => (
          <Avatar
            key={agentId}
            className={`${avatarSizeClass} rounded-full overflow-hidden absolute border border-2 border-card`}
            style={{
              zIndex: index,
              left: `${index * avatarOffset}px`,
              top: `${index * avatarOffset}px`,
            }}
          >
            {getAvatarContent(agentId, index)}
          </Avatar>
        ))
      )}
    </div>
  );
}
