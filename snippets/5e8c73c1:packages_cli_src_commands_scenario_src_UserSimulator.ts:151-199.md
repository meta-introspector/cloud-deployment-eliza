# 5e8c73c1:packages_cli_src_commands_scenario_src_UserSimulator.ts:151-199

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/UserSimulator.ts:151-199
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Generate a fallback response when LLM fails
   * @private
   */
  private generateFallbackResponse(_agentResponse: string, context: SimulationContext): string {
    const { persona, objective } = this.config;

    // Simple fallback responses based on persona type
    if (persona.toLowerCase().includes('frustrated') || persona.toLowerCase().includes('angry')) {
      return "I'm still not getting the help I need. Can you please provide a clearer solution?";
    }

    if (persona.toLowerCase().includes('confused') || persona.toLowerCase().includes('beginner')) {
      return "I'm not sure I understand. Could you explain that differently?";
    }

    if (persona.toLowerCase().includes('technical') || persona.toLowerCase().includes('expert')) {
      return 'Can you provide more specific technical details?';
    }

    // Default fallback
    if (context.turnNumber === 1) {
      return `I need help with ${objective}. Can you assist me?`;
    }

    return 'Could you help me understand what I should do next?';
  }

  /**
   * Update the user simulator configuration during conversation
   * Useful for dynamic persona changes
   */
  updateConfig(newConfig: Partial<UserSimulatorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration (useful for debugging)
   */
  getConfig(): UserSimulatorConfig {
    return { ...this.config };
  }
}
```