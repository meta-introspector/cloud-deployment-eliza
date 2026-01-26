# a7046c18:packages_docs_link_checker.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/link_checker.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            else:
                self.external_cache[url] = (False, f"HTTP {response.status_code}")
                return False, f"HTTP {response.status_code}"
        except Exception as e:
            self.external_cache[url] = (False, str(e))
            return False, str(e)
    
    def check_file_links(self, file_path: Path) -> List[Dict]:
        """Check all links in a file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return [{"error": f"Could not read file: {e}"}]
        
        links = self.extract_links(content)
        results = []
        
        for link in links:
            url = link["url"]
            link_type = self.classify_link(url)
            
            result = {
                "file": str(file_path),
                "link": link,
                "link_type": link_type,
                "valid": True,
                "suggestion": None,
                "confidence": "high"
            }
            
            if link_type == "internal_absolute":
                valid, suggestion = self.check_internal_link(url)
                result["valid"] = valid
                result["suggestion"] = suggestion
                if suggestion:
                    result["confidence"] = "high" if difflib.SequenceMatcher(None, url, suggestion).ratio() > 0.9 else "medium"
            
            elif link_type == "external":
                valid, error = self.check_external_link(url)
                result["valid"] = valid
                result["error"] = error
                if not valid:
                    result["confidence"] = "low"  # External links need manual review
            
            elif link_type == "anchor":
                # For now, skip anchor checking within documents
                result["valid"] = True
                result["confidence"] = "high"
            
            results.append(result)
        
        return results
    
    def apply_fix(self, file_path: Path, link_result: Dict) -> bool:
        """Apply a fix to a broken link"""
        if link_result["valid"] or not link_result["suggestion"]:
            return False
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            return False
        
        link = link_result["link"]
        old_url = link["url"]
        new_url = link_result["suggestion"]
        
        # Replace the URL in the content
        if link["type"] == "markdown":
            old_link = f'[{link["text"]}]({old_url})'
            new_link = f'[{link["text"]}]({new_url})'
            new_content = content.replace(old_link, new_link)
        elif link["type"] == "href":
            old_href = f'href="{old_url}"'
            new_href = f'href="{new_url}"'
            new_content = content.replace(old_href, new_href)
        else:
            return False
        
        # Only apply if content changed
        if new_content != content:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                # Track the fix
                self.fixes_applied.append({
                    "file": str(file_path),
                    "old_url": old_url,
                    "new_url": new_url,
                    "confidence": link_result["confidence"],
                    "type": link_result["link_type"]
                })
                return True
            except Exception as e:
                return False
        
        return False
    
    def check_all_links(self) -> Dict:
        """Check all links in all MDX files"""
        results = {
            "total_files": 0,
            "total_links": 0,
            "broken_links": 0,
            "fixed_links": 0,
            "files_modified": 0,
            "detailed_results": []
        }
        
        mdx_files = list(self.docs_dir.rglob("*.mdx"))
        results["total_files"] = len(mdx_files)
        
        for file_path in mdx_files:
            print(f"Checking links in: {file_path}")
            file_results = self.check_file_links(file_path)
            
            file_broken = 0
            file_fixed = 0
            
            for link_result in file_results:
                if "error" in link_result:
                    continue
                
                results["total_links"] += 1
                
                if not link_result["valid"]:
                    results["broken_links"] += 1
                    file_broken += 1
                    self.broken_links.append(link_result)
                    
                    # Apply fix if confidence is high or medium
                    if link_result["confidence"] in ["high", "medium"] and link_result["suggestion"]:
                        if self.apply_fix(file_path, link_result):
                            results["fixed_links"] += 1
                            file_fixed += 1
            
            if file_fixed > 0:
                results["files_modified"] += 1
            
            results["detailed_results"].append({
                "file": str(file_path),
                "results": file_results,
                "broken_count": file_broken,
                "fixed_count": file_fixed
            })
        
        return results
```