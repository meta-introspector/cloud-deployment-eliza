# a7046c18:scripts_analyze-code-quality.sh:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/analyze-code-quality.sh:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            has_comment = 0
        }
        
        # Function declaration patterns - more specific and comprehensive
        /^(export\s+)?(async\s+)?function\s+\w+\s*\(/ ||
        /^(export\s+)?(async\s+)?const\s+\w+\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?const\s+\w+\s*:\s*\w*\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?let\s+\w+\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?var\s+\w+\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?\w+\s*\([^)]*\)\s*[:=]\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?\w+\s*[:=]\s*(async\s*)?\([^)]*\)\s*[:=]\s*(async\s*)?\(/ {
            if (!in_function) {
                in_function = 1
                function_start = NR
                function_name = $0
                brace_count = 0
                has_comment = 0
                # Count opening braces on this line
                gsub(/[^{]/, "", $0)
                brace_count += length($0)
            }
            next
        }
        
        # Check for comments before function
        /\/\*\*|\/\// {
            if (in_function && NR >= function_start - 3 && NR <= function_start) {
                has_comment = 1
            }
        }
        
        # Handle opening braces
        /{/ {
            if (in_function) {
                # Count opening braces on this line
                gsub(/[^{]/, "", $0)
                brace_count += length($0)
            }
        }
        
        # Handle closing braces - works with indented braces
        /}/ {
            if (in_function) {
                # Count closing braces on this line
                gsub(/[^}]/, "", $0)
                brace_count -= length($0)
                
                # If we have balanced braces, function is complete
                if (brace_count <= 0) {
                    function_length = NR - function_start + 1
                    if (function_length > 20 && !has_comment) {
                        print FILENAME ":" function_start " - Function with " function_length " lines and no documentation"
                    }
                    in_function = 0
                    function_start = 0
                    function_name = ""
                    brace_count = 0
                    has_comment = 0
                }
            }
        }
        ' "$file" 2>/dev/null
    done | head -20 || echo "Analysis completed"
} >> "${REPORT_FILE}"

# Step 7: Documentation Accuracy and Completeness
print_info "Analyzing documentation accuracy..."
{
    echo -e "\n---\n"
    echo "## Documentation Accuracy and Completeness"
    echo ""

    # Check if docs directory exists
    if [ -d "docs" ] || [ -d "packages/docs" ]; then
        DOCS_DIR=$([ -d "docs" ] && echo "docs" || echo "packages/docs")

        echo "### Broken Links in Documentation"
        # Find potential broken internal links
        grep -r "\[.*\]([^)]*)" "$DOCS_DIR" --include="*.md" 2>/dev/null | grep -E "\]\(\.\.?\/|#" | while read line; do
            file=$(echo "$line" | cut -d: -f1)
            link=$(echo "$line" | grep -oE '\]\([^)]+\)' | sed 's/\](\(.*\))/\1/')
            # Check if it's a relative path
            if [[ "$link" =~ ^\.\.?/ ]]; then
                target_path=$(dirname "$file")/"$link"
                if [ ! -f "$target_path" ] && [ ! -d "$target_path" ]; then
                    echo "- $file: broken link to '$link'"
                fi
            fi
        done | head -20 || echo "No broken links found"

        echo ""
        echo "### Missing Documentation for Core Features"
        # Check if important packages have corresponding docs
        for package in packages/core packages/cli packages/client packages/plugin-*; do
            if [ -d "$package" ]; then
                package_name=$(basename "$package")
                if ! grep -r "$package_name" "$DOCS_DIR" --include="*.md" >/dev/null 2>&1; then
                    echo "- No documentation found for package: $package_name"
                fi
            fi
        done || echo "Analysis completed"

        echo ""
        echo "### Outdated Code Examples in Documentation"
        # Look for code blocks that might have outdated imports or syntax
        grep -r "import.*from" "$DOCS_DIR" --include="*.md" 2>/dev/null | grep -E "(packages/core|@ai16z/|elizaos@)" | head -10 || echo "No outdated imports found"

        echo ""
        echo "### Missing API Documentation"
        # Check if key APIs are documented
        echo "Checking for documentation of key APIs..."
        key_apis=("AgentRuntime" "Character" "Memory" "Action" "Provider" "Evaluator" "Service")
        for api in "${key_apis[@]}"; do
            if ! grep -r "$api" "$DOCS_DIR" --include="*.md" >/dev/null 2>&1; then
                echo "- Missing documentation for: $api"
            fi
        done || echo "Analysis completed"

        echo ""
        echo "### Documentation Files Without Updates (>90 days)"
        find "$DOCS_DIR" -name "*.md" -mtime +90 2>/dev/null | head -10 || echo "All documentation recently updated"
    else
        echo "No docs directory found in standard locations"
    fi
} >> "${REPORT_FILE}"

# Step 8: Repository Standards Analysis
print_info "Analyzing repository standards..."
{
    echo -e "\n---\n"
    echo "## Repository Standards Analysis"
    echo ""

    echo "### Non-Bun Package Manager Usage"
    grep -r -E "(npm (install|run)|yarn|pnpm|npx)" packages --include="*.json" --include="*.md" --include="*.yml" --include="*.yaml" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules 2>/dev/null | grep -v -E "(bun|comment|example)" | head -20 || echo "None found"

    echo ""
    echo "### Incorrect Core Package Imports"
    grep -r "from ['\"].*packages/core" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -20 || echo "None found"

    echo ""
    echo "### Class Definitions (Should Use Functional)"
    grep -r -E "^class\s+|export\s+class\s+" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v -E "(Error|Exception)" | head -20 || echo "None found"

    echo ""
    echo "### Non-Bun Test Framework Usage (Should use bun:test)"
    echo "elizaOS uses 'bun:test' exclusively. Found usage of other test frameworks:"
    grep -r -E "(from ['\"]vitest|from ['\"]jest|from ['\"]mocha|import.*vitest|import.*jest|require\(['\"]jest|require\(['\"]vitest)" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -20 || echo "None found"
    echo ""
    echo "Test syntax that should use bun:test instead:"
```