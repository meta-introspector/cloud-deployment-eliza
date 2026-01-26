# a7046c18:packages_docs_link_checker.py:301-364

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/link_checker.py:301-364
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    def generate_report(self, results: Dict) -> str:
        """Generate a summary report"""
        report = f"""# Link Checking Report

## Summary
- **Total files checked**: {results['total_files']}
- **Total links found**: {results['total_links']}
- **Broken links found**: {results['broken_links']}
- **Links fixed automatically**: {results['fixed_links']}
- **Files modified**: {results['files_modified']}

## Fixes Applied
"""
        
        for fix in self.fixes_applied:
            report += f"- **{fix['file']}**: `{fix['old_url']}` → `{fix['new_url']}` (confidence: {fix['confidence']})\n"
        
        report += f"""
## Remaining Broken Links
"""
        
        remaining_broken = [link for link in self.broken_links if not any(
            fix["old_url"] == link["link"]["url"] and fix["file"] == link["file"]
            for fix in self.fixes_applied
        )]
        
        for link in remaining_broken:
            report += f"- **{link['file']}**: `{link['link']['url']}` ({link['link_type']})\n"
        
        return report

def main():
    """Main function to run the link checker"""
    checker = LinkChecker()
    
    print("Starting link check...")
    results = checker.check_all_links()
    
    print(f"\n✅ Link check complete!")
    print(f"📊 Total files: {results['total_files']}")
    print(f"🔗 Total links: {results['total_links']}")
    print(f"❌ Broken links: {results['broken_links']}")
    print(f"✅ Fixed links: {results['fixed_links']}")
    print(f"📝 Files modified: {results['files_modified']}")
    
    # Generate report
    report = checker.generate_report(results)
    with open("link_check_report.md", "w") as f:
        f.write(report)
    
    # Save detailed results as JSON
    with open("link_check_results.json", "w") as f:
        json.dump({
            "summary": results,
            "fixes_applied": checker.fixes_applied,
            "broken_links": checker.broken_links
        }, f, indent=2)
    
    print(f"\n📋 Report saved to: link_check_report.md")
    print(f"📋 Detailed results saved to: link_check_results.json")

if __name__ == "__main__":
    main()
```