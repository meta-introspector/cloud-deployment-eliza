# a7046c18:scripts_analyze-code-quality.sh:451-498

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/analyze-code-quality.sh:451-498
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    grep -r -E "(describe\.only|it\.only|test\.only|jest\.|vitest\.|expect\.extend)" packages --include="*.ts" --include="*.tsx" --include="*.test.*" --include="*.spec.*" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -20 || echo "None found"
} >> "${REPORT_FILE}"

# Generate summary
print_info "Generating summary..."
{
    echo -e "\n---\n"
    echo "## Summary"
    echo ""
    echo "### Issue Counts"
    echo ""

    # Count issues in each category
    dead_code_count=$(grep -c "^- " "${REPORT_FILE}" 2>/dev/null || echo 0)
    console_count=$(grep -A20 "Console.log Statements" "${REPORT_FILE}" | grep -c ":" 2>/dev/null || echo 0)
    todo_count=$(grep -A20 "TODO/FIXME" "${REPORT_FILE}" | grep -c ":" 2>/dev/null || echo 0)
    security_count=$(grep -A100 "## Security Analysis" "${REPORT_FILE}" | grep -c ":" 2>/dev/null || echo 0)
    any_type_count=$(grep -A30 "Usage of 'any' Type" "${REPORT_FILE}" | grep -c ":" 2>/dev/null || echo 0)
    docs_accuracy_count=$(grep -A100 "## Documentation Accuracy" "${REPORT_FILE}" | grep -c "^- " 2>/dev/null || echo 0)

    echo "- Dead code files: $dead_code_count"
    echo "- Console.log statements: $console_count"
    echo "- TODO/FIXME comments: $todo_count"
    echo "- Security concerns: $security_count"
    echo "- 'any' type usage: $any_type_count"
    echo "- Documentation issues: $docs_accuracy_count"
    echo ""
    echo "### Next Steps"
    echo ""
    echo "1. Review the findings above and prioritize fixes"
    echo "2. Focus on security issues and missing tests first"
    echo "3. Address type safety violations and dead code"
    echo "4. Update documentation for complex functions"
    echo "5. Fix broken links and outdated examples in docs"
    echo "6. Ensure all code follows repository standards"
} >> "${REPORT_FILE}"

print_success "Analysis complete!"
print_info "Full report saved to: ${REPORT_FILE}"
echo ""
print_info "To view the report, run:"
echo "  cat ${REPORT_FILE}"
echo ""
print_info "To view specific sections:"
echo "  grep -A20 'Dead Code Analysis' ${REPORT_FILE}"
echo "  grep -A20 'Security Analysis' ${REPORT_FILE}"
echo "  grep -A20 'Test Coverage Analysis' ${REPORT_FILE}"
echo "  grep -A20 'Documentation Accuracy' ${REPORT_FILE}"
```