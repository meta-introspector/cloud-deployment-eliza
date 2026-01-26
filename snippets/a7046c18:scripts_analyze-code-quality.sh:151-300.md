# a7046c18:scripts_analyze-code-quality.sh:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/analyze-code-quality.sh:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        /^(export\s+)?(async\s+)?\w+\s*\([^)]*\)\s*[:=]\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?\w+\s*[:=]\s*(async\s*)?\([^)]*\)\s*[:=]\s*(async\s*)?\(/ {
            if (!in_function) {
                in_function = 1
                function_start = NR
                function_name = $0
                brace_count = 0
                # Count opening braces on this line
                gsub(/[^{]/, "", $0)
                brace_count += length($0)
            }
            next
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
                    if (function_length > 50) {
                        print FILENAME ":" function_start "-" NR " (" function_length " lines) - " substr(function_name, 1, 60)
                    }
                    in_function = 0
                    function_start = 0
                    function_name = ""
                    brace_count = 0
                }
            }
        }
        ' "$file" 2>/dev/null
    done | head -20 || echo "Analysis completed"

    echo ""
    echo "### Complex Conditions (>3 &&/||)"
    grep -r "if.*&&.*&&.*&&\|if.*||.*||.*||" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -10 || echo "None found"
} >> "${REPORT_FILE}"

# Step 3: Security Analysis
print_info "Analyzing security issues..."
{
    echo -e "\n---\n"
    echo "## Security Analysis"
    echo ""

    echo "### Potential Hardcoded Secrets"
    grep -r -E "(api_key|apiKey|API_KEY|secret|password|token|private_key|privateKey)\s*[:=]\s*[\"'][^\"']+[\"']" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v -E "(process\.env|import|interface|type|:\s*string|test|spec|example)" | head -20 || echo "None found"

    echo ""
    echo "### Eval() Usage"
    grep -r "eval\s*(" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null || echo "None found"

    echo ""
    echo "### Potential SQL Injection Risks"
    grep -r -E "(query|execute)\s*\(.*\$\{.*\}|query.*\+.*\+" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -10 || echo "None found"

    echo ""
    echo "### Potential ReDoS Vulnerabilities"
    grep -r -E "new RegExp\(|\/.*(\+|\*|\{[0-9]*,\}).*(\+|\*|\{[0-9]*,\}).*\/" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -10 || echo "None found"
} >> "${REPORT_FILE}"

# Step 4: Test Coverage Analysis
print_info "Analyzing test coverage..."
{
    echo -e "\n---\n"
    echo "## Test Coverage Analysis"
    echo ""

    echo "### Files Without Tests"
    find packages -name "*.ts" -o -name "*.tsx" | grep -v -E "(test|spec|\.d\.ts|node_modules|dist)" | while read file; do
        basename="${file%.*}"
        dirname=$(dirname "$file")
        if ! find "$dirname" -name "$(basename "$basename").test.*" -o -name "$(basename "$basename").spec.*" 2>/dev/null | grep -q .; then
            if ! find "$dirname/__tests__" -name "*$(basename "$basename")*" 2>/dev/null | grep -q .; then
                echo "- $file"
            fi
        fi
    done | head -50 || echo "Analysis completed"

    echo ""
    echo "### Test Files With Few Tests"
    find packages -name "*.test.ts" -o -name "*.spec.ts" -o -name "*.test.tsx" -o -name "*.spec.tsx" | grep -v node_modules | while read file; do
        test_count=$(grep -c -E "(test|it|describe)\s*\(" "$file" 2>/dev/null || echo 0)
        if [ "$test_count" -lt 3 ]; then
            echo "- $file (only $test_count test blocks)"
        fi
    done 2>/dev/null || echo "Analysis completed"
} >> "${REPORT_FILE}"

# Step 5: Type Safety Analysis
print_info "Analyzing type safety..."
{
    echo -e "\n---\n"
    echo "## Type Safety Analysis"
    echo ""

    echo "### Usage of 'any' Type"
    grep -r -E ":\s*any(\s|$|,|\)|\[)" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -30 || echo "None found"

    echo ""
    echo "### Functions Without Return Types"
    grep -r -E "(function|const)\s+\w+\s*\([^)]*\)\s*\{" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v -E ":\s*\w+|=>" | head -20 || echo "None found"

    echo ""
    echo "### Type Assertions (as keyword)"
    grep -r -E "\s+as\s+\w+" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | grep -v -E "(import|export|const\s+\w+\s+as)" | head -20 || echo "None found"

    echo ""
    echo "### @ts-ignore Usage"
    grep -r "@ts-ignore" packages --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null || echo "None found"
} >> "${REPORT_FILE}"

# Step 6: Documentation Analysis
print_info "Analyzing documentation..."
{
    echo -e "\n---\n"
    echo "## Documentation Analysis"
    echo ""

    echo "### Exported Functions Without Documentation"
    find packages -name "*.ts" -o -name "*.tsx" | grep -v -E "(node_modules|dist|test|spec)" | while read file; do
        awk '/export\s+(async\s+)?function|export\s+const\s+\w+\s*=\s*(async\s*)?\(/ {
            if (prev !~ /\/\*\*/ && prev !~ /\/\//) {
                print FILENAME":"NR" - "substr($0, 1, 60)"..."
            }
        } {prev=$0}' "$file" 2>/dev/null
    done | head -30 || echo "Analysis completed"

    echo ""
    echo "### Complex Functions Without Comments (>20 lines)"
    find packages -name "*.ts" -o -name "*.tsx" | grep -v -E "(node_modules|dist|test|spec)" | while read file; do
        awk '
        BEGIN {
            brace_count = 0
            in_function = 0
            function_start = 0
            function_name = ""
```