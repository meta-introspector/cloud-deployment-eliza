# a7046c18:packages_core_typescript_src___tests___prompts.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/prompts.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import {
  booleanFooter,
  imageDescriptionTemplate,
  messageHandlerTemplate,
  postCreationTemplate,
  shouldRespondTemplate,
} from "../prompts";

describe("Prompts", () => {
  describe("Template Structure", () => {
    it("shouldRespondTemplate should contain required placeholders and XML structure", () => {
      expect(shouldRespondTemplate).toContain("{{agentName}}");
      expect(shouldRespondTemplate).toContain("{{providers}}");
      expect(shouldRespondTemplate).toContain("<response>");
      expect(shouldRespondTemplate).toContain("</response>");
      expect(shouldRespondTemplate).toContain("<name>");
      expect(shouldRespondTemplate).toContain("<reasoning>");
      expect(shouldRespondTemplate).toContain("<action>");
      expect(shouldRespondTemplate).toMatch(/RESPOND \| IGNORE \| STOP/);

      // Check for important rules section
      expect(shouldRespondTemplate).toContain(
        "IMPORTANT RULES FOR RESPONDING:",
      );
      expect(shouldRespondTemplate).toContain("directly mentioned");
      expect(shouldRespondTemplate).toContain("Talking TO {{agentName}}");
      expect(shouldRespondTemplate).toContain("Talking ABOUT {{agentName}}");
    });

    it("messageHandlerTemplate should contain required placeholders and structure", () => {
      expect(messageHandlerTemplate).toContain("{{agentName}}");
      expect(messageHandlerTemplate).toContain("{{providers}}");
      expect(messageHandlerTemplate).toContain("<response>");
      expect(messageHandlerTemplate).toContain("</response>");
      expect(messageHandlerTemplate).toContain("<thought>");
      expect(messageHandlerTemplate).toContain("<actions>");
      expect(messageHandlerTemplate).toContain("<providers>");
      expect(messageHandlerTemplate).toContain("<text>");

      // Check for important action ordering rules
      expect(messageHandlerTemplate).toContain(
        "IMPORTANT ACTION ORDERING RULES",
      );
      expect(messageHandlerTemplate).toContain(
        "Actions are executed in the ORDER you list them",
      );

      // Ensure code block formatting rules are explicitly included
      expect(messageHandlerTemplate).toContain(
        "IMPORTANT CODE BLOCK FORMATTING RULES",
      );
      expect(messageHandlerTemplate).toContain("fenced code blocks");
      expect(messageHandlerTemplate).toContain("single backticks");

      // Check for provider selection rules
      expect(messageHandlerTemplate).toContain(
        "IMPORTANT PROVIDER SELECTION RULES",
      );
      expect(messageHandlerTemplate).toContain("ATTACHMENTS");
      expect(messageHandlerTemplate).toContain("ENTITIES");
    });

    it("postCreationTemplate should contain required placeholders and examples", () => {
      expect(postCreationTemplate).toContain("{{agentName}}");
      expect(postCreationTemplate).toContain("{{twitterUserName}}");
      expect(postCreationTemplate).toContain("{{providers}}");
      expect(postCreationTemplate).toContain("{{adjective}}");
      expect(postCreationTemplate).toContain("{{topic}}");
      expect(postCreationTemplate).toContain("<response>");
      expect(postCreationTemplate).toContain("</response>");
      expect(postCreationTemplate).toContain("<thought>");
      expect(postCreationTemplate).toContain("<post>");
      expect(postCreationTemplate).toContain("<imagePrompt>");

      // Check for example outputs
      expect(postCreationTemplate).toMatch(/Example task outputs:/);
      expect(postCreationTemplate).toContain("A post about");
    });

    it("booleanFooter should be a simple instruction", () => {
      expect(booleanFooter).toBe("Respond with only a YES or a NO.");
      expect(booleanFooter).toMatch(/^Respond with only a YES or a NO\.$/);
    });

    it("imageDescriptionTemplate should contain proper XML structure", () => {
      expect(imageDescriptionTemplate).toContain("<task>");
      expect(imageDescriptionTemplate).toContain("<instructions>");
      expect(imageDescriptionTemplate).toContain("<output>");
      expect(imageDescriptionTemplate).toContain("<response>");
      expect(imageDescriptionTemplate).toContain("</response>");
      expect(imageDescriptionTemplate).toContain("<title>");
      expect(imageDescriptionTemplate).toContain("<description>");
      expect(imageDescriptionTemplate).toContain("<text>");

      // Check for important instructions
      expect(imageDescriptionTemplate).toContain("Analyze the provided image");
      expect(imageDescriptionTemplate).toContain(
        "Be objective and descriptive",
      );
    });
  });

  describe("Template Consistency", () => {
    const templates = [
      shouldRespondTemplate,
      messageHandlerTemplate,
      postCreationTemplate,
      imageDescriptionTemplate,
    ];

    it("all templates should have consistent XML output format instructions", () => {
      templates.forEach((template) => {
        expect(template).toContain(
          "Do NOT include any thinking, reasoning, or <think> sections",
        );
        expect(template).toContain(
          "IMPORTANT: Your response must ONLY contain the <response></response> XML block",
        );
      });
    });

    it("all templates should use proper XML closing tags", () => {
      templates.forEach((template) => {
        // Extract only the XML response format sections (not instructions mentioning tags)
        const responseBlocks =
          template.match(/<response>[\s\S]*?<\/response>/g) || [];

        responseBlocks.forEach((block) => {
          // Get all open tags within response blocks
          const openTags = (block.match(/<[^/][^>]+>/g) || [])
            .filter((tag) => !tag.includes("/>"))
            .filter((tag) => !tag.includes("think")); // Exclude mentioned-but-not-present tags

          const closeTags = block.match(/<\/[^>]+>/g) || [];

          // For each unique open tag, there should be a corresponding close tag
          openTags.forEach((openTag) => {
            const tagName = openTag.match(/<([^\s>]+)/)?.[1];
            if (
              tagName &&
              !["br", "hr", "img", "input", "meta", "link"].includes(tagName)
            ) {
              expect(
                closeTags.some((closeTag) => closeTag.includes(tagName)),
              ).toBe(true);
            }
          });
        });

```