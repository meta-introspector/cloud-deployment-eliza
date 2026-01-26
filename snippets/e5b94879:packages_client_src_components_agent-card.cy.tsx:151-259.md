# e5b94879:packages_client_src_components_agent-card.cy.tsx:151-259

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-card.cy.tsx:151-259
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
    // Click the card button
    cy.get('[data-testid="card-button"]').click();

    // Verify onChat was called
    cy.wrap(onChat).should('have.been.calledWith', mockAgent);
  });

  it('shows agent avatar when provided', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

    // Should show avatar
    cy.get('[data-testid="agent-avatar"]').should('exist');
    cy.get('[data-testid="agent-avatar"]').should(
      'have.attr',
      'src',
      'https://example.com/avatar.png'
    );
  });

  it('shows initials fallback when no avatar', () => {
    const onChat = cy.stub();
    const agentWithoutAvatar = {
      ...mockAgent,
      settings: {},
    };

    cy.mount(<TestAgentCard agent={agentWithoutAvatar} onChat={onChat} />);

    // Should show initials fallback
    cy.get('[data-testid="agent-initials"]').should('contain.text', 'TE');
  });

  it('displays agent status correctly', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

    // Check status is displayed
    cy.get('[data-testid="agent-status"]').should('contain.text', 'inactive');
  });

  it('handles different button states', () => {
    const onChat = cy.stub();

    // Test inactive agent - should show start button
    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);
    cy.get('[data-testid="start-button"]').should('exist');

    // Test active agent - should show chat button
    cy.mount(<TestAgentCard agent={activeAgent} onChat={onChat} />);
    cy.get('[data-testid="chat-button"]').should('exist');
  });

  it('handles long agent names', () => {
    const onChat = cy.stub();
    const longNameAgent = {
      ...mockAgent,
      name: 'This is a very long agent name that should be displayed',
    };

    cy.mount(<TestAgentCard agent={longNameAgent} onChat={onChat} />);

    // Check that name is displayed
    cy.get('[data-testid="agent-name"]').should('contain.text', 'This is a very long agent name');
  });

  it('renders with proper structure', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={mockAgent} onChat={onChat} />);

    // Check basic structure elements exist
    cy.get('[data-testid="agent-card"]').should('exist');
    cy.get('[data-testid="agent-name"]').should('exist');
    cy.get('[data-testid="status-indicator"]').should('exist');
    cy.get('[data-testid="agent-status"]').should('exist');
  });

  it('handles button interactions', () => {
    const onChat = cy.stub();

    cy.mount(<TestAgentCard agent={activeAgent} onChat={onChat} />);

    // Click chat button
    cy.get('[data-testid="chat-button"]').click();
    cy.wrap(onChat).should('have.been.calledWith', activeAgent);

    // Click card button
    cy.get('[data-testid="card-button"]').click();
    cy.wrap(onChat).should('have.been.calledWith', activeAgent);
  });

  it('shows appropriate content for different agent states', () => {
    const onChat = cy.stub();

    // Test with different agent configurations
    const testCases = [
      { agent: mockAgent, expectedButton: 'start-button' },
      { agent: activeAgent, expectedButton: 'chat-button' },
    ];

    testCases.forEach(({ agent, expectedButton }) => {
      cy.mount(<TestAgentCard agent={agent} onChat={onChat} />);
      cy.get(`[data-testid="${expectedButton}"]`).should('exist');
    });
  });
});
```