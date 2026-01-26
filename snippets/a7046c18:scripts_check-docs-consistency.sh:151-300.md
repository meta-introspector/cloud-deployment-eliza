# a7046c18:scripts_check-docs-consistency.sh:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/check-docs-consistency.sh:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        file=$(echo "$line" | cut -d: -f1)
        command=$(echo "$line" | grep -oE "(npm|yarn|pnpm|npx)[^\"'\`]*")
        echo "- $file: Uses '$command' (should use bun)"
    done | head -15
} >> "${REPORT_FILE}"

# Step 4: Check for Broken Internal Links
print_section "Broken Internal Links"
{
    echo -e "\n---\n"
    echo "## Broken Internal Links"
    echo ""

    # Find all markdown links
    grep -r "\[.*\]([^)]*)" "$DOCS_DIR" --include="*.md" 2>/dev/null | while read -r line; do
        file=$(echo "$line" | cut -d: -f1)
        # Extract all links from the line
        echo "$line" | grep -oE '\[[^]]+\]\([^)]+\)' | while read -r link_match; do
            link=$(echo "$link_match" | sed -E 's/\[[^]]+\]\(([^)]+)\)/\1/')

            # Skip external links
            if [[ ! "$link" =~ ^https?:// ]] && [[ ! "$link" =~ ^mailto: ]]; then
                # Handle relative links
                if [[ "$link" =~ ^\.\.?/ ]]; then
                    target_path=$(cd "$(dirname "$file")" && realpath -m "$link" 2>/dev/null || echo "")
                    if [ -n "$target_path" ] && [ ! -f "$target_path" ] && [ ! -d "$target_path" ]; then
                        echo "- $file: broken link to '$link'"
                    fi
                elif [[ "$link" =~ ^/ ]]; then
                    # Absolute path from docs root
                    target_path="$DOCS_DIR$link"
                    if [ ! -f "$target_path" ] && [ ! -d "$target_path" ]; then
                        echo "- $file: broken link to '$link'"
                    fi
                elif [[ "$link" =~ ^# ]]; then
                    # Anchor link - skip for now
                    :
                else
                    # Relative to current directory
                    target_path="$(dirname "$file")/$link"
                    if [ ! -f "$target_path" ] && [ ! -d "$target_path" ]; then
                        echo "- $file: broken link to '$link'"
                    fi
                fi
            fi
        done
    done | sort -u | head -20
} >> "${REPORT_FILE}"

# Step 5: Check API Documentation Coverage
print_section "API Documentation Coverage"
{
    echo -e "\n---\n"
    echo "## API Documentation Coverage"
    echo ""

    echo "### Core API Functions"
    # Check if major exported functions are documented
    find packages/core/src -name "*.ts" -not -path "*/test/*" -not -name "*.test.ts" | while read -r file; do
        # Extract exported functions
        grep -E "^export (async )?function \w+|^export const \w+ = (async )?\(" "$file" 2>/dev/null | \
        sed -E 's/export (async )?function (\w+).*/\2/; s/export const (\w+).*/\1/' | \
        while read -r func_name; do
            if [[ ! "$func_name" =~ ^(test|mock|stub) ]]; then
                check_entity_documented "$func_name" "Function"
            fi
        done
    done | sort -u | head -20

    echo ""
    echo "### CLI Commands"
    # Check if CLI commands are documented
    if [ -d "packages/cli/src/commands" ]; then
        find packages/cli/src/commands -name "*.ts" -not -name "*.test.ts" | while read -r cmd_file; do
            cmd_name=$(basename "$cmd_file" .ts)
            if [ ! -f "$DOCS_DIR/cli/$cmd_name.md" ]; then
                echo "- CLI command '$cmd_name' has no documentation page"
            fi
        done
    fi
} >> "${REPORT_FILE}"

# Step 6: Check Documentation Freshness
print_section "Documentation Freshness"
{
    echo -e "\n---\n"
    echo "## Documentation Freshness"
    echo ""

    echo "### Documentation files not updated in >60 days"
    find "$DOCS_DIR" -name "*.md" -mtime +60 -type f 2>/dev/null | while read -r file; do
        last_modified=$(stat -f "%Sm" -t "%Y-%m-%d" "$file" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1)
        echo "- $file (last modified: $last_modified)"
    done | head -15

    echo ""
    echo "### Code files modified more recently than their documentation"
    # For each documented feature, check if code was modified more recently
    for doc_file in $(find "$DOCS_DIR" -name "*.md" -type f); do
        doc_topic=$(basename "$doc_file" .md)
        doc_modified=$(stat -f "%m" "$doc_file" 2>/dev/null || stat -c "%Y" "$doc_file" 2>/dev/null)

        # Find related code files
        find packages -name "*${doc_topic}*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" 2>/dev/null | while read -r code_file; do
            code_modified=$(stat -f "%m" "$code_file" 2>/dev/null || stat -c "%Y" "$code_file" 2>/dev/null)

            if [ -n "$doc_modified" ] && [ -n "$code_modified" ] && [ "$code_modified" -gt "$doc_modified" ]; then
                echo "- $doc_file may be outdated (related code $code_file was modified more recently)"
            fi
        done
    done | head -10
} >> "${REPORT_FILE}"

# Step 7: Check for Missing Critical Documentation
print_section "Missing Critical Documentation"
{
    echo -e "\n---\n"
    echo "## Missing Critical Documentation"
    echo ""

    echo "### Configuration and Environment Variables"
    # Check if all env vars used in code are documented
    grep -r "process\.env\." packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | \
    grep -oE "process\.env\.[A-Z_]+" | \
    sed 's/process\.env\.//' | \
    sort -u | while read -r env_var; do
        if ! grep -r "$env_var" "$DOCS_DIR" --include="*.md" >/dev/null 2>&1; then
            echo "- Environment variable '$env_var' is not documented"
        fi
    done | head -15

    echo ""
    echo "### Error Codes and Messages"
    # Check if custom error classes are documented
    grep -r "class.*Error.*extends" packages --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | \
    sed -E 's/.*class ([A-Za-z]+Error).*/\1/' | \
    sort -u | while read -r error_class; do
        check_entity_documented "$error_class" "Error Class"
    done | head -10
} >> "${REPORT_FILE}"

# Step 8: Generate Summary
print_section "Generating Summary"
{
    echo -e "\n---\n"
    echo "## Summary"
    echo ""

    # Count issues
    undocumented_count=$(grep -c "is not documented" "${REPORT_FILE}" 2>/dev/null || echo 0)
```