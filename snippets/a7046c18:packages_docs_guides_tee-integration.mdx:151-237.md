# a7046c18:packages_docs_guides_tee-integration.mdx:151-237

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/tee-integration.mdx:151-237
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## API Endpoints

### Get TEE Status

```bash
GET /api/tee/status
```

Response:
```json
{
  "status": "active",
  "tee_enabled": true,
  "vendor": "phala"
}
```

### Get TEE Agents

```bash
GET /api/tee/agents
```

Response:
```json
{
  "agents": [
    {
      "id": "...",
      "agentId": "...",
      "agentName": "SecureAgent",
      "publicKey": "...",
      "attestation": "..."
    }
  ],
  "attestation": "..."
}
```

## Key Derivation

TEE enables secure key derivation within the enclave:

```typescript
// Keys are derived from the enclave's secure environment
const deriveEcdsaKeypair = (deriveKeyResponse: DeriveKeyResponse): PrivateKeyAccount
const deriveEd25519Keypair = (deriveKeyResponse: DeriveKeyResponse): Keypair
```

Keys derived in TEE:
- Cannot be extracted from the enclave
- Are tied to the specific enclave instance
- Can be verified through attestation

## Security Considerations

<Warning>
- **Secret salt**: Use a strong, unique salt for each deployment
- **Attestation verification**: Always verify attestation quotes in production
- **Key rotation**: Plan for key rotation when updating enclave code
</Warning>

### Best Practices

1. **Development**: Use `TEE_MODE=LOCAL` for testing
2. **Staging**: Use `TEE_MODE=DOCKER` for integration tests
3. **Production**: Use `TEE_MODE=PRODUCTION` with real hardware
4. **Secrets**: Never commit `WALLET_SECRET_SALT` to version control

## See Also

<CardGroup cols={2}>
  <Card title="TEE CLI Reference" icon="terminal" href="/cli-reference/tee">
    Complete TEE deployment commands
  </Card>
  <Card title="Deploy a Project" icon="rocket" href="/guides/deploy-a-project">
    General deployment guide
  </Card>
  <Card title="Services" icon="server" href="/runtime/services">
    Background services and integrations
  </Card>
  <Card title="Phala Documentation" icon="book" href="https://docs.phala.network/">
    Official Phala Cloud docs
  </Card>
</CardGroup>
```