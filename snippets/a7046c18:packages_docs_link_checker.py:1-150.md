# a7046c18:packages_docs_link_checker.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/link_checker.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env python3
"""
Link Checker and Fixer for elizaOS Documentation
Scans MDX files for broken links and applies automatic fixes
"""

import os
import re
import json
import requests
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Set
from urllib.parse import urljoin, urlparse
import difflib
import time

class LinkChecker:
    def __init__(self, docs_dir: str = "."):
        self.docs_dir = Path(docs_dir)
        self.fixes_applied = []
        self.broken_links = []
        self.external_cache = {}
        self.file_list = []
        self.nav_structure = {}
        
        # Load navigation structure from docs.json
        docs_json_path = self.docs_dir / "docs.json"
        if docs_json_path.exists():
            with open(docs_json_path) as f:
                self.nav_structure = json.load(f)
        
        # Build file list
        self.build_file_list()
    
    def build_file_list(self):
        """Build a list of all MDX files and their paths"""
        for file_path in self.docs_dir.rglob("*.mdx"):
            relative_path = file_path.relative_to(self.docs_dir)
            # Convert file path to URL path (remove .mdx extension)
            url_path = "/" + str(relative_path).replace(".mdx", "")
            self.file_list.append({
                "file_path": file_path,
                "url_path": url_path,
                "relative_path": relative_path
            })
    
    def extract_links(self, content: str) -> List[Dict]:
        """Extract all links from MDX content"""
        links = []
        
        # Pattern for markdown links [text](url)
        markdown_pattern = r'\[([^\]]*)\]\(([^)]+)\)'
        for match in re.finditer(markdown_pattern, content):
            links.append({
                "text": match.group(1),
                "url": match.group(2),
                "type": "markdown",
                "start": match.start(),
                "end": match.end(),
                "full_match": match.group(0)
            })
        
        # Pattern for href attributes in components
        href_pattern = r'href=["\']([^"\']+)["\']'
        for match in re.finditer(href_pattern, content):
            links.append({
                "text": "",
                "url": match.group(1),
                "type": "href",
                "start": match.start(),
                "end": match.end(),
                "full_match": match.group(0)
            })
        
        # Pattern for src attributes in images
        src_pattern = r'src=["\']([^"\']+)["\']'
        for match in re.finditer(src_pattern, content):
            links.append({
                "text": "",
                "url": match.group(1),
                "type": "src",
                "start": match.start(),
                "end": match.end(),
                "full_match": match.group(0)
            })
        
        return links
    
    def classify_link(self, url: str) -> str:
        """Classify link type"""
        if url.startswith("#"):
            return "anchor"
        elif url.startswith("http://") or url.startswith("https://"):
            return "external"
        elif url.startswith("/"):
            return "internal_absolute"
        elif url.startswith("./") or url.startswith("../"):
            return "internal_relative"
        else:
            return "unknown"
    
    def check_internal_link(self, url: str) -> Tuple[bool, Optional[str]]:
        """Check if internal link exists and suggest fixes"""
        # Remove anchor part for file existence check
        file_path = url.split("#")[0]
        
        # Check if file exists directly
        for file_info in self.file_list:
            if file_info["url_path"] == file_path:
                return True, None
        
        # Check for common variations
        candidates = []
        for file_info in self.file_list:
            # Calculate similarity
            similarity = difflib.SequenceMatcher(None, file_path, file_info["url_path"]).ratio()
            if similarity > 0.85:  # 85% similarity threshold
                candidates.append((file_info["url_path"], similarity))
        
        if candidates:
            # Sort by similarity and return best match
            candidates.sort(key=lambda x: x[1], reverse=True)
            return False, candidates[0][0]
        
        return False, None
    
    def check_external_link(self, url: str) -> Tuple[bool, Optional[str]]:
        """Check if external link is valid"""
        if url in self.external_cache:
            return self.external_cache[url]
        
        # Skip checking certain domains
        skip_domains = [
            "localhost",
            "127.0.0.1",
            "example.com",
            "test.com",
            "placeholder.com"
        ]
        
        parsed = urlparse(url)
        if parsed.hostname in skip_domains:
            self.external_cache[url] = (True, None)
            return True, None
        
        try:
            response = requests.head(url, timeout=10, allow_redirects=True)
            if response.status_code < 400:
                self.external_cache[url] = (True, None)
                return True, None
```