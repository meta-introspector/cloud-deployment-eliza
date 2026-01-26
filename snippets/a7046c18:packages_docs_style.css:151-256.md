# a7046c18:packages_docs_style.css:151-256

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/style.css:151-256
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

/* Ensure images maintain exact size */
[data-component-part="card-title"] [data-rmiz] img {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

/* Keep agent card titles on one line */
[data-component-part="card-title"] > span[style*="display: flex"] {
  flex-wrap: nowrap;
  align-items: center;
}

/* Reduce text sizes for better fit */
[data-component-part="card-title"] {
  font-size: 14px;
}

[data-component-part="card-content"] {
  font-size: 13px;
  line-height: 1.4;
}

/* Agent card plugin pill styling */
.agent-plugin-pill {
  display: inline-block;
  padding: 3px 10px;
  background: transparent;
  border: 1px solid rgba(156, 163, 175, 0.3);
  border-radius: 14px;
  font-size: 11px;
  color: #6b7280;
  margin-left: 8px;
  vertical-align: middle;
  height: 24px;
  line-height: 18px;
  white-space: nowrap;
  width: auto;
  min-width: fit-content;
}

/* Stacked circles for plugin count */
.agent-plugin-stack {
  display: inline-block;
  position: relative;
  margin-left: 12px;
  width: 43px;
  height: 24px;
  vertical-align: middle;
}

.agent-plugin-circle {
  position: absolute;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: transparent;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 500;
}

.agent-plugin-circle:nth-child(1) {
  z-index: 3;
  left: -4px;
}

.agent-plugin-circle:nth-child(2),
.agent-plugin-circle:nth-child(3) {
  display: none;
}

/* SVG background for stacked circles outline */
.agent-plugin-stack::before {
  content: "";
  position: absolute;
  width: 50px;
  height: 24px;
  left: -7px;
  top: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='50' height='24' viewBox='0 0 50 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='clip'%3E%3Crect x='0' y='0' width='50' height='24'/%3E%3C/clipPath%3E%3Cmask id='mask'%3E%3Crect x='0' y='0' width='50' height='24' fill='white'/%3E%3Ccircle cx='15' cy='12' r='10.5' fill='black'/%3E%3Ccircle cx='18.5' cy='12' r='10.5' fill='black'/%3E%3C/mask%3E%3C/defs%3E%3Cg fill='none' stroke='%239CA3AF' stroke-width='1' opacity='0.5'%3E%3Ccircle cx='15' cy='12' r='11'/%3E%3Ccircle cx='18.5' cy='12' r='11' mask='url(%23mask)'/%3E%3Ccircle cx='22' cy='12' r='11' mask='url(%23mask)'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

/* Navbar "Join Community" button hover - match GitHub button blue text */
a[href*="discord.gg"]:hover {
  color: #0b35f1;
}

/* Make Discord icon turn blue on hover (Mintlify uses mask-based icons) */
a[href*="discord.gg"]:hover * {
  color: #0b35f1;
  background-color: currentColor;
}
```