# a69475c0:packages_core_src___tests___utils.test.ts:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/utils.test.ts:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
import { afterEach, beforeEach, describe, expect, it, setSystemTime, mock } from 'bun:test';
import { Content, Entity, IAgentRuntime, Memory, ModelType, State } from '../types';
import * as utils from '../utils';
import {
  addHeader,
  composePrompt,
  composePromptFromState,
  formatMessages,
  formatPosts,
  formatTimestamp,
  normalizeJsonString,
  parseBooleanFromText,
  parseJSONObjectFromText,
  parseKeyValueXml,
  safeReplacer,
  splitChunks,
  stringToUuid,
  trimTokens,
  truncateToCompleteSentence,
  validateUuid,
} from '../utils';

describe('Utils Comprehensive Tests', () => {
  describe('parseBooleanFromText', () => {
    it('should return true for affirmative values', () => {
      const affirmativeValues = [
        'YES',
        'Y',
        'TRUE',
        'T',
        '1',
        'ON',
        'ENABLE',
        'yes',
        'y',
        'true',
        't',
        ' YES ',
        ' true ',
      ];

      affirmativeValues.forEach((value) => {
        expect(parseBooleanFromText(value)).toBe(true);
      });
    });

    it('should return false for negative values', () => {
      const negativeValues = [
        'NO',
        'N',
        'FALSE',
        'F',
        '0',
        'OFF',
        'DISABLE',
        'no',
        'n',
        'false',
        'f',
        ' NO ',
        ' false ',
      ];

      negativeValues.forEach((value) => {
        expect(parseBooleanFromText(value)).toBe(false);
      });
    });

    it('should return false for null, undefined, or empty values', () => {
      expect(parseBooleanFromText(null)).toBe(false);
      expect(parseBooleanFromText(undefined)).toBe(false);
      expect(parseBooleanFromText('')).toBe(false);
    });

    it('should return false for unrecognized values', () => {
      expect(parseBooleanFromText('maybe')).toBe(false);
      expect(parseBooleanFromText('123')).toBe(false);
      expect(parseBooleanFromText('YESNO')).toBe(false);
      expect(parseBooleanFromText('random')).toBe(false);
    });
  });

  describe('formatTimestamp', () => {
    beforeEach(() => {
      // Mock Date.now() to ensure consistent tests
      setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      setSystemTime(); // Reset to real time
    });

    it("should return 'just now' for recent timestamps", () => {
      const now = Date.now();
      expect(formatTimestamp(now)).toBe('just now');
      expect(formatTimestamp(now - 30000)).toBe('just now'); // 30 seconds ago
      expect(formatTimestamp(now - 59999)).toBe('just now'); // Just under 1 minute
    });

    it('should return minutes ago for timestamps within an hour', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 60000)).toBe('1 minute ago');
      expect(formatTimestamp(now - 120000)).toBe('2 minutes ago');
      expect(formatTimestamp(now - 1800000)).toBe('30 minutes ago');
      expect(formatTimestamp(now - 3599000)).toBe('59 minutes ago');
    });

    it('should return hours ago for timestamps within 24 hours', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 3600000)).toBe('1 hour ago');
      expect(formatTimestamp(now - 7200000)).toBe('2 hours ago');
      expect(formatTimestamp(now - 43200000)).toBe('12 hours ago');
      expect(formatTimestamp(now - 86399000)).toBe('23 hours ago');
    });

    it('should return days ago for older timestamps', () => {
      const now = Date.now();
      expect(formatTimestamp(now - 86400000)).toBe('1 day ago');
      expect(formatTimestamp(now - 172800000)).toBe('2 days ago');
      expect(formatTimestamp(now - 604800000)).toBe('7 days ago');
    });
  });

  describe('parseJSONObjectFromText', () => {
    it('should parse JSON from code blocks', () => {
      const text = 'Here is some JSON:\n```json\n{"key": "value", "number": 42}\n```';
      const result = parseJSONObjectFromText(text);
      // Note: normalizeJsonString converts numbers to strings
      expect(result).toEqual({ key: 'value', number: '42' });
    });

    it('should parse direct JSON without code blocks', () => {
      const text = '{"name": "Alice", "age": 30}';
      const result = parseJSONObjectFromText(text);
      // Note: normalizeJsonString converts numbers to strings
      expect(result).toEqual({ name: 'Alice', age: '30' });
    });

    it('should return null for invalid JSON', () => {
      expect(parseJSONObjectFromText('not json')).toBeNull();
      expect(parseJSONObjectFromText('{invalid json}')).toBeNull();
      expect(parseJSONObjectFromText('')).toBeNull();
    });

    it('should return null for arrays', () => {
      expect(parseJSONObjectFromText('["item1", "item2"]')).toBeNull();
      expect(parseJSONObjectFromText('```json\n[1, 2, 3]\n```')).toBeNull();
    });

    it('should return null for non-object values', () => {
```