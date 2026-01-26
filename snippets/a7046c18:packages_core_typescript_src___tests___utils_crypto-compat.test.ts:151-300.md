# a7046c18:packages_core_typescript_src___tests___utils_crypto-compat.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/crypto-compat.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const iv = createTestIV();
      const plaintext = new Uint8Array(0);

      const encrypted = await encryptAsync(key, iv, plaintext);
      const decrypted = await decryptAsync(key, iv, encrypted);

      expect(decrypted).toEqual(plaintext);
    });

    it("should handle large data", async () => {
      const key = await createTestKey();
      const iv = createTestIV();
      const plaintext = new Uint8Array(10000);
      for (let i = 0; i < plaintext.length; i++) {
        plaintext[i] = i % 256;
      }

      const encrypted = await encryptAsync(key, iv, plaintext);
      const decrypted = await decryptAsync(key, iv, encrypted);

      expect(decrypted).toEqual(plaintext);
    });

    it("should produce different ciphertext with different IVs", async () => {
      const key = await createTestKey();
      const iv1 = createTestIV();
      const iv2 = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        iv2[i] = 15 - i;
      }
      const plaintext = new TextEncoder().encode("Same message");

      const encrypted1 = await encryptAsync(key, iv1, plaintext);
      const encrypted2 = await encryptAsync(key, iv2, plaintext);

      expect(encrypted1).not.toEqual(encrypted2);

      // Both should decrypt correctly
      const decrypted1 = await decryptAsync(key, iv1, encrypted1);
      const decrypted2 = await decryptAsync(key, iv2, encrypted2);
      expect(decrypted1).toEqual(plaintext);
      expect(decrypted2).toEqual(plaintext);
    });

    it("should throw on invalid key length", async () => {
      const invalidKey = new Uint8Array(16); // Wrong size
      const iv = createTestIV();
      const data = new TextEncoder().encode("test");

      await expect(encryptAsync(invalidKey, iv, data)).rejects.toThrow(
        /invalid key length/i,
      );

      await expect(decryptAsync(invalidKey, iv, data)).rejects.toThrow(
        /invalid key length/i,
      );
    });

    it("should throw on invalid IV length", async () => {
      const key = await createTestKey();
      const invalidIV = new Uint8Array(8); // Wrong size
      const data = new TextEncoder().encode("test");

      await expect(encryptAsync(key, invalidIV, data)).rejects.toThrow(
        /invalid iv length/i,
      );

      await expect(decryptAsync(key, invalidIV, data)).rejects.toThrow(
        /invalid iv length/i,
      );
    });

    it("should fail decryption with wrong key", async () => {
      const key1 = await createHashAsync("sha256", "key1");
      const key2 = await createHashAsync("sha256", "key2");
      const iv = createTestIV();
      const plaintext = new TextEncoder().encode("Secret");

      const encrypted = await encryptAsync(key1, iv, plaintext);

      // Decryption with wrong key should fail or produce garbage
      try {
        const decrypted = await decryptAsync(key2, iv, encrypted);
        const text = new TextDecoder().decode(decrypted);
        // If it doesn't throw, it should at least not match original
        expect(text).not.toBe("Secret");
      } catch (error) {
        // Decryption may throw an error with wrong key, which is acceptable
        expect(error).toBeDefined();
      }
    });

    it("should be deterministic for same key, IV, and data", async () => {
      const key = await createTestKey();
      const iv = createTestIV();
      const plaintext = new TextEncoder().encode("Deterministic test");

      const encrypted1 = await encryptAsync(key, iv, plaintext);
      const encrypted2 = await encryptAsync(key, iv, plaintext);

      expect(encrypted1).toEqual(encrypted2);
    });
  });

  describe("createCipheriv / createDecipheriv (Node.js synchronous)", () => {
    const createTestKey = async (): Promise<Uint8Array> => {
      return await createHashAsync("sha256", "test-key-seed");
    };

    const createTestIV = (): Uint8Array => {
      const iv = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        iv[i] = i;
      }
      return iv;
    };

    it("should encrypt and decrypt with Node.js API", async () => {
      const key = await createTestKey();
      const iv = createTestIV();
      const plaintext = "Secret message";

      const cipher = createCipheriv("aes-256-cbc", key, iv);
      let encrypted = cipher.update(plaintext, "utf8", "hex");
      encrypted += cipher.final("hex");

      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe("string");

      const decipher = createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      expect(decrypted).toBe(plaintext);
    });

    it("should throw on unsupported algorithm", async () => {
      const key = await createTestKey();
      const iv = createTestIV();

      expect(() => {
        createCipheriv("aes-128-cbc" as string, key, iv);
      }).toThrow(/unsupported algorithm/i);

      expect(() => {
        createDecipheriv("aes-128-cbc" as string, key, iv);
      }).toThrow(/unsupported algorithm/i);
    });
  });

```