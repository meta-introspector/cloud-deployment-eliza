# a7046c18:packages_docs_plugin-registry_bootstrap_complete-documentation.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/complete-documentation.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

4. **FOLLOW_ROOM** (`followRoom.ts`)

   - Subscribes agent to room updates
   - Enables notifications for room activity

5. **UNFOLLOW_ROOM** (`unfollowRoom.ts`)

   - Unsubscribes from room updates
   - Stops notifications

6. **MUTE_ROOM** (`muteRoom.ts`)

   - Temporarily disables responses in a room
   - Agent still processes messages but doesn't respond

7. **UNMUTE_ROOM** (`unmuteRoom.ts`)
   - Re-enables responses in a muted room

#### Advanced Actions

8. **SEND_MESSAGE** (`sendMessage.ts`)

   - Sends messages to specific rooms
   - Can target different channels

9. **UPDATE_CONTACT** (`updateEntity.ts`)

   - Updates contact/entity information in the database
   - Modifies user profiles, metadata

10. **CHOOSE_OPTION** (`choice.ts`)

    - Presents multiple choice options
    - Used for interactive decision making

11. **UPDATE_ROLE** (`roles.ts`)

    - Manages user roles and permissions
    - Updates access levels

12. **UPDATE_SETTINGS** (`settings.ts`)

    - Modifies agent or room settings
    - Configures behavior parameters

13. **GENERATE_IMAGE** (`imageGeneration.ts`)
    - Creates images using AI models
    - Attaches generated images to responses

### Providers

Providers supply contextual information to the agent during response generation:

#### Core Providers

1. **RECENT_MESSAGES** (`recentMessages.ts`)

   ```typescript
   // Provides conversation history and context
   {
     recentMessages: Memory[],
     recentInteractions: Memory[],
     formattedConversation: string
   }
   ```

2. **TIME** (`time.ts`)

   - Current date and time
   - Timezone information
   - Temporal context

3. **CHARACTER** (`character.ts`)

   - Agent's personality traits
   - Background information
   - Behavioral guidelines

4. **ENTITIES** (`entities.ts`)

   - Information about users in the room
   - Entity relationships
   - User metadata

5. **RELATIONSHIPS** (`relationships.ts`)

   - Social graph data
   - Interaction history
   - Relationship tags

6. **WORLD** (`world.ts`)

   - Environment context
   - Server/world information
   - Room details

7. **ANXIETY** (`anxiety.ts`)

   - Agent's emotional state
   - Stress levels
   - Mood indicators

8. **ATTACHMENTS** (`attachments.ts`)

   - Media content analysis
   - Image descriptions
   - Document summaries

9. **CAPABILITIES** (`capabilities.ts`)

   - Available actions
   - Service capabilities
   - Feature flags

10. **ACTIONS** (`actions.ts`)

    - Available action definitions
    - Action metadata
    - Action examples

11. **PROVIDERS** (`providers.ts`)

    - List of available providers
    - Provider metadata
    - Provider ordering

12. **EVALUATORS** (`evaluators.ts`)

    - Available evaluator definitions
    - Evaluator metadata
    - Evaluation examples

13. **SETTINGS** (`settings.ts`)

    - Agent configuration
    - Runtime settings
    - Plugin settings

14. **ROLES** (`roles.ts`)

    - User role information
    - Permission levels
    - Role assignments

15. **CHOICE** (`choice.ts`)

    - Pending choice options
    - User selection context
    - Choice metadata
```