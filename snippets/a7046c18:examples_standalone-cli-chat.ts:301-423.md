# a7046c18:examples_standalone-cli-chat.ts:301-423

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/standalone-cli-chat.ts:301-423
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        (result.responseContent && result.responseContent.text
          ? result.responseContent.text
          : "") ||
        "",
      thinkingTimeMs,
    };
  }
}

// ============================================================================
// USER INTERFACE
// ============================================================================

class ChatInterface {
  constructor(
    private messageProcessor: MessageProcessor,
    private character: Character,
  ) {}

  private displayWelcome(): void {
    clack.intro("🤖 elizaOS Interactive Chat");
    clack.note(
      `Ready to chat with ${this.character.name}!`,
      'Type your messages below. Use Ctrl+C or type "quit"/"exit" to end.',
    );
  }

  private async getUserInput(): Promise<string | symbol> {
    return clack.text({
      message: "You:",
      placeholder: "Type your message here...",
    });
  }

  private isExitCommand(input: string | symbol): boolean {
    if (clack.isCancel(input)) return true;
    if (typeof input === "string") {
      return CONSTANTS.EXIT_COMMANDS.includes(input.toLowerCase());
    }
    return false;
  }

  private async displayThinkingAndProcess(
    userInput: string,
  ): Promise<MessageProcessingResult> {
    const spinner = clack.spinner();
    spinner.start(`${this.character.name} is thinking...`);

    try {
      const result = await this.messageProcessor.processMessage(userInput);
      const thinkingTime = TimeUtils.formatThinkingTime(result.thinkingTimeMs);
      spinner.stop(`Thought for ${thinkingTime}`);
      return result;
    } catch (error) {
      spinner.stop("❌ Error processing message");
      throw error;
    }
  }

  private displayResponse(response: string): void {
    if (!response.trim()) return;

    const wrappedResponse = TextUtils.wrapText(response);
    clack.note(wrappedResponse, `${this.character.name}:`);
  }

  async startChatLoop(): Promise<void> {
    this.displayWelcome();

    while (true) {
      try {
        const userInput = await this.getUserInput();

        if (this.isExitCommand(userInput)) {
          clack.outro("Thanks for chatting! 👋");
          break;
        }

        if (typeof userInput === "string" && userInput.trim()) {
          const result = await this.displayThinkingAndProcess(userInput);
          this.displayResponse(result.response);
        }
      } catch (error) {
        console.error("Error in chat loop:", error);
        clack.note("An error occurred. Please try again.", "❌ Error");
      }
    }
  }
}

// ============================================================================
// APPLICATION ENTRY POINT
// ============================================================================

class StandaloneChatApp {
  static async run(): Promise<void> {
    try {
      const session = await AgentInitializer.initialize();
      const messageProcessor = new MessageProcessor(session);
      const chatInterface = new ChatInterface(
        messageProcessor,
        session.character,
      );

      await chatInterface.startChatLoop();
      await session.runtime.stop();
    } catch (error) {
      console.error("Fatal error:", error);
      process.exit(1);
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

if (import.meta.main) {
  StandaloneChatApp.run().catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
}
```