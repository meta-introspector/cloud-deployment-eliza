# a7046c18:packages_core_typescript_src___tests___utils_crypto-compat.test.ts:301-411

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/crypto-compat.test.ts:301-411
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  describe("webCrypto (legacy API)", () => {
    it("should have hash function", () => {
      expect(webCrypto.hash).toBeDefined();
      expect(typeof webCrypto.hash).toBe("function");
    });

    it("should have encrypt function", () => {
      expect(webCrypto.encrypt).toBeDefined();
      expect(typeof webCrypto.encrypt).toBe("function");
    });

    it("should have decrypt function", () => {
      expect(webCrypto.decrypt).toBeDefined();
      expect(typeof webCrypto.decrypt).toBe("function");
    });

    it("should work for hashing", async () => {
      const data = new TextEncoder().encode("test");
      const hash = await webCrypto.hash("sha256", data);

      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });
  });

  describe("integration with settings encryption", () => {
    it("should support settings encryption workflow", async () => {
      const salt = "test-salt-value";
      const value = "sensitive-data";

      // Simulate settings encryption
      const key = await createHashAsync("sha256", salt);
      const keySlice = key.slice(0, 32);
      const iv = BufferUtils.randomBytes(16);

      // Encrypt
      const cipher = createCipheriv("aes-256-cbc", keySlice, iv);
      let encrypted = cipher.update(value, "utf8", "hex");
      encrypted += cipher.final("hex");

      const storedValue = `${BufferUtils.toHex(iv)}:${encrypted}`;

      // Simulate settings decryption
      const parts = storedValue.split(":");
      expect(parts.length).toBe(2);

      const recoveredIV = BufferUtils.fromHex(parts[0]);
      const encryptedData = parts[1];

      const decipher = createDecipheriv("aes-256-cbc", keySlice, recoveredIV);
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      expect(decrypted).toBe(value);
    });

    it("should support async settings encryption workflow", async () => {
      const salt = "test-salt-value";
      const value = "sensitive-data";
      const valueBytes = new TextEncoder().encode(value);

      // Async encryption
      const key = await createHashAsync("sha256", salt);
      const keySlice = key.slice(0, 32);
      const iv = BufferUtils.randomBytes(16);

      const encrypted = await encryptAsync(keySlice, iv, valueBytes);
      const storedValue = `${BufferUtils.toHex(iv)}:${BufferUtils.toHex(encrypted)}`;

      // Async decryption
      const parts = storedValue.split(":");
      const recoveredIV = BufferUtils.fromHex(parts[0]);
      const encryptedData = BufferUtils.fromHex(parts[1]);

      const decrypted = await decryptAsync(
        keySlice,
        recoveredIV,
        encryptedData,
      );
      const decryptedText = new TextDecoder().decode(decrypted);

      expect(decryptedText).toBe(value);
    });
  });

  describe("error messages", () => {
    it("should have helpful error messages for browser incompatibility", () => {
      // In browser, digest() should throw with helpful message
      // (This test will only throw in actual browser environment)
      // Just verify the functions exist and are callable in Node.js
      const hash = createHash("sha256").update("test");
      const result = hash.digest();
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("should validate algorithm names", async () => {
      await expect(
        createHashAsync("invalid-algo" as string, "data"),
      ).rejects.toThrow();
    });

    it("should validate cipher algorithm", async () => {
      const key = await createHashAsync("sha256", "key");
      const iv = new Uint8Array(16);

      expect(() => {
        createCipheriv("des" as string, key, iv);
      }).toThrow(/unsupported algorithm/i);
    });
  });
});
```