# a7046c18:scripts_check-docs-consistency.sh:301-340

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/check-docs-consistency.sh:301-340
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    broken_links_count=$(grep -c "broken link" "${REPORT_FILE}" 2>/dev/null || echo 0)
    outdated_count=$(grep -c "outdated\|old package name\|should be @elizaos" "${REPORT_FILE}" 2>/dev/null || echo 0)
    missing_docs_count=$(grep -c "has no documentation" "${REPORT_FILE}" 2>/dev/null || echo 0)

    echo "### Issue Counts"
    echo "- Undocumented entities: $undocumented_count"
    echo "- Broken internal links: $broken_links_count"
    echo "- Outdated examples: $outdated_count"
    echo "- Missing documentation files: $missing_docs_count"
    echo ""

    echo "### Priority Actions"
    echo "1. Fix all broken internal links"
    echo "2. Update outdated package names (@ai16z/ → @elizaos/)"
    echo "3. Replace npm/yarn/pnpm commands with bun"
    echo "4. Document all exported types and interfaces"
    echo "5. Create documentation for undocumented plugins"
    echo "6. Update stale documentation (>60 days old)"
    echo "7. Document all environment variables"
    echo ""

    echo "### Documentation Standards"
    echo "- All public APIs must be documented"
    echo "- Code examples must use current package names"
    echo "- All commands must use 'bun' not npm/yarn/pnpm"
    echo "- Internal links must be valid"
    echo "- Documentation should be updated with code changes"
} >> "${REPORT_FILE}"

print_success "Documentation consistency check complete!"
print_info "Full report saved to: ${REPORT_FILE}"
echo ""
print_info "Quick summary:"
grep "### Issue Counts" -A 4 "${REPORT_FILE}"
echo ""
print_info "To view specific sections:"
echo "  grep -A10 'Core Classes' ${REPORT_FILE}"
echo "  grep -A10 'Outdated Code Examples' ${REPORT_FILE}"
echo "  grep -A10 'Broken Internal Links' ${REPORT_FILE}"
echo "  grep -A10 'Missing Critical' ${REPORT_FILE}"
```