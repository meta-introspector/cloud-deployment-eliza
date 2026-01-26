# 12812d74:packages_cli_src_commands_scenario_src_UserSimulator.ts:151-195

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/cli/src/commands/scenario/src/UserSimulator.ts:151-195
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
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