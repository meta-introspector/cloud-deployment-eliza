# 5e8c73c1:packages_plugin-bootstrap_src_providers_character.ts:151-208

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/character.ts:151-208
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    const messageDirections =
      (character?.style?.all?.length && character?.style?.all?.length > 0) ||
      (character?.style?.chat?.length && character?.style?.chat?.length > 0)
        ? addHeader(
            `# Message Directions for ${character.name}`,
            (() => {
              const all = character?.style?.all || [];
              const chat = character?.style?.chat || [];
              return [...all, ...chat].join('\n');
            })()
          )
        : '';

    const directions = isPostFormat ? postDirections : messageDirections;
    const examples = isPostFormat ? characterPostExamples : characterMessageExamples;

    const values = {
      agentName,
      bio,
      system,
      topic,
      topics,
      adjective,
      messageDirections,
      postDirections,
      directions,
      examples,
      characterPostExamples,
      characterMessageExamples,
    };

    const data = {
      bio,
      adjective,
      topic,
      topics,
      character,
      directions,
      examples,
      system,
    };

    const topicSentence = topicString
      ? `${character.name} is currently interested in ${topicString}`
      : '';
    const adjectiveSentence = adjectiveString ? `${character.name} is ${adjectiveString}` : '';
    // Combine all text sections
    const text = [bio, adjectiveSentence, topicSentence, topics, directions, examples, system]
      .filter(Boolean)
      .join('\n\n');

    return {
      values,
      data,
      text,
    };
  },
};
```