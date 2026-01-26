# e5b94879:packages_client_src_components_agent-card.cy.tsx:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-card.cy.tsx:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
/// <reference types="cypress" />
/// <reference path="../../cypress/support/types.d.ts" />

import React from 'react';
import type { Agent } from '@elizaos/core';
import { AgentStatus } from '@elizaos/core';

// Create a minimal test component that represents AgentCard functionality
const TestAgentCard: React.FC<{
  agent: Partial<Agent>;
  onChat: (agent: Partial<Agent>) => void;
}> = ({ agent, onChat }) => {
  if (!agent || !agent.id) {
    return <div data-testid="agent-card-error">Agent data not available.</div>;
  }

  const agentName = agent.name || 'Unnamed Agent';
  const isActive = agent.status === AgentStatus.ACTIVE;

  return (
    <div data-testid="agent-card" className="agent-card">
      <div data-testid="agent-name">{agentName}</div>
      <div
        data-testid="status-indicator"
        className={`status-dot ${isActive ? 'active' : 'inactive'}`}
      />
      <div data-testid="agent-status">
        {agent.status === AgentStatus.ACTIVE
          ? 'active'
          : agent.status === AgentStatus.INACTIVE
            ? 'inactive'
            : 'unknown'}
      </div>
      {agent.settings?.avatar && (
        <img
          data-testid="agent-avatar"
          src={
            typeof agent.settings.avatar === 'string' ? agent.settings.avatar : '/elizaos-icon.png'
          }
          alt={agentName}
        />
      )}
      {!agent.settings?.avatar && (
        <div data-testid="agent-initials">{agentName.substring(0, 2).toUpperCase()}</div>
      )}
      {isActive ? (
        <button data-testid="chat-button" onClick={() => onChat(agent)}>
          Chat
        </button>
      ) : (
        <button data-testid="start-button">Start</button>
      )}
      <button data-testid="card-button" onClick={() => onChat(agent)} className="card-clickable">
        Card Click
      </button>
    </div>
  );
};

describe('AgentCard Component', () => {
  const mockAgent: Partial<Agent> = {
    id: '12345678-1234-1234-1234-123456789012',
    name: 'Test Agent',
    username: 'testagent',
    status: AgentStatus.INACTIVE,
    settings: {
      avatar: 'https://example.com/avatar.png',
    },
    bio: 'Test agent bio',
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const activeAgent: Partial<Agent> = {
    ...mockAgent,
    status: AgentStatus.ACTIVE,
  };

  it('renders agent information correctly', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

    // Check agent name is displayed
    cy.get('[data-testid="agent-name"]').should('contain.text', 'Test Agent');

    // Check status indicator exists
    cy.get('[data-testid="status-indicator"]').should('exist');

    // Check agent card exists
    cy.get('[data-testid="agent-card"]').should('exist');
  });

  it('displays active agent correctly', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={activeAgent} onChat={onChat} />);

    // Status should show active
    cy.get('[data-testid="agent-status"]').should('contain.text', 'active');

    // Chat button should be visible
    cy.get('[data-testid="chat-button"]').should('exist');
  });

  it('handles missing agent data gracefully', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={{}} onChat={onChat} />);

    // Should show error message
    cy.get('[data-testid="agent-card-error"]').should('contain.text', 'Agent data not available');
  });

  it('shows start button for inactive agents', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

    // Start button should be visible
    cy.get('[data-testid="start-button"]').should('contain.text', 'Start');
  });

  it('shows chat button for active agents', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={activeAgent} onChat={onChat} />);

    // Chat button should be visible
    cy.get('[data-testid="chat-button"]').should('contain.text', 'Chat');
  });

  it('handles chat button click for active agents', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={activeAgent} onChat={onChat} />);

    // Click chat button
    cy.get('[data-testid="chat-button"]').click();

    // Verify onChat was called
    cy.wrap(onChat).should('have.been.calledWith', activeAgent);
  });

  it('navigates when card is clicked', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

```