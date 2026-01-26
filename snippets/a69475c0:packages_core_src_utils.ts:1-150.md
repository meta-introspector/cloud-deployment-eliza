# a69475c0:packages_core_src_utils.ts:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import Handlebars from 'handlebars';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { z } from 'zod';

import logger from './logger';
import { getEnv } from './utils/environment';
import type { Content, Entity, IAgentRuntime, Memory, State, TemplateType } from './types';
import { ModelType, UUID, ContentType } from './types';

// Text Utils

/**
 * Convert all double-brace bindings in a Handlebars template
 * to triple-brace bindings, so the output is NOT HTML-escaped.
 *
 * - Ignores block/partial/comment tags that start with # / ! >.
 * - Ignores the else keyword.
 * - Ignores bindings that are already triple-braced.
 *
 * @param  tpl  Handlebars template source
 * @return      Transformed template
 */
function upgradeDoubleToTriple(tpl: string) {
  return tpl.replace(
    // ────────╮ negative-LB: not already "{{{"
    //          │   {{     ─ opening braces
    //          │    ╰──── negative-LA: not {, #, /, !, >
    //          ▼
    /(?<!{){{(?![{#\/!>])([\s\S]*?)}}/g,
    (_match: string, inner: string) => {
      // keep the block keyword {{else}} unchanged
      if (inner.trim() === 'else') return `{{${inner}}}`;
      return `{{{${inner}}}}`;
    }
  );
}

/**
 * Composes a context string by replacing placeholders in a template with corresponding values from the state.
 *
 * This function takes a template string with placeholders in the format `{{placeholder}}` and a state object.
 * It replaces each placeholder with the value from the state object that matches the placeholder's name.
 * If a matching key is not found in the state object for a given placeholder, the placeholder is replaced with an empty string.
 *
 * @param {Object} params - The parameters for composing the context.
 * @param {State} params.state - The state object containing values to replace the placeholders in the template.
 * @param {TemplateType} params.template - The template string or function containing placeholders to be replaced with state values.
 * @returns {string} The composed context string with placeholders replaced by corresponding state values.
 *
 * @example
 * // Given a state object and a template
 * const state = { userName: "Alice", userAge: 30 };
 * const template = "Hello, {{userName}}! You are {{userAge}} years old";
 *
 * // Composing the context with simple string replacement will result in:
 * // "Hello, Alice! You are 30 years old."
 * const contextSimple = composePromptFromState({ state, template });
 *
 * // Using composePromptFromState with a template function for dynamic template
 * const template = ({ state }) => {
 * const tone = Math.random() > 0.5 ? "kind" : "rude";
 *   return `Hello, {{userName}}! You are {{userAge}} years old. Be ${tone}`;
 * };
 * const contextSimple = composePromptFromState({ state, template });
 */

/**
 * Function to compose a prompt using a provided template and state.
 * It compiles the template (upgrading double braces to triple braces for non-HTML escaping)
 * and then populates it with values from the state. Additionally, it processes the
 * resulting string with `composeRandomUser` to replace placeholders like `{{nameX}}`.
 *
 * @param {Object} options - Object containing state and template information.
 * @param {State} options.state - The state object containing values to fill the template.
 * @param {TemplateType} options.template - The template string or function to be used for composing the prompt.
 * @returns {string} The composed prompt output, with state values and random user names populated.
 */
export const composePrompt = ({
  state,
  template,
}: {
  state: { [key: string]: string };
  template: TemplateType;
}) => {
  const templateStr = typeof template === 'function' ? template({ state }) : template;
  const templateFunction = Handlebars.compile(upgradeDoubleToTriple(templateStr));
  const output = composeRandomUser(templateFunction(state), 10);
  return output;
};

/**
 * Function to compose a prompt using a provided template and state.
 *
 * @param {Object} options - Object containing state and template information.
 * @param {State} options.state - The state object containing values to fill the template.
 * @param {TemplateType} options.template - The template to be used for composing the prompt.
 * @returns {string} The composed prompt output.
 */
export const composePromptFromState = ({
  state,
  template,
}: {
  state: State;
  template: TemplateType;
}) => {
  const templateStr = typeof template === 'function' ? template({ state }) : template;
  const templateFunction = Handlebars.compile(upgradeDoubleToTriple(templateStr));

  // get any keys that are in state but are not named text, values or data
  const stateKeys = Object.keys(state);
  const filteredKeys = stateKeys.filter((key) => !['text', 'values', 'data'].includes(key));

  // this flattens out key/values in text/values/data
  const filteredState = filteredKeys.reduce((acc: Record<string, unknown>, key) => {
    acc[key] = state[key];
    return acc;
  }, {});

  // and then we flat state.values again
  const output = composeRandomUser(templateFunction({ ...filteredState, ...state.values }), 10);
  return output;
};

/**
 * Adds a header to a body of text.
 *
 * This function takes a header string and a body string and returns a new string with the header prepended to the body.
 * If the body string is empty, the header is returned as is.
 *
 * @param {string} header - The header to add to the body.
 * @param {string} body - The body to which to add the header.
 * @returns {string} The body with the header prepended.
 *
 * @example
 * // Given a header and a body
 * const header = "Header";
 * const body = "Body";
 *
 * // Adding the header to the body will result in:
 * // "Header\nBody"
 * const text = addHeader(header, body);
 */
export const addHeader = (header: string, body: string) => {
  return body.length > 0 ? `${header ? `${header}\n` : header}${body}\n` : '';
};

/**
 * Generates a string with random user names populated in a template.
 *
```