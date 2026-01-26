# a7046c18:packages_docs_style.css:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/style.css:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/* Left sidebar vertical navigation - more compact */

/* Reduce font size for sidebar like before */
#sidebar * {
  font-size: 12px;
}

/* Reduce vertical padding for sidebar navigation items */
#sidebar .sidebar-title,
#sidebar a,
#sidebar-content a,
.sidebar-title {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

/* Reduce spacing for sidebar group sections */
#sidebar .sidebar-group-header,
.sidebar-group-header {
  padding-top: 0.3rem;
  padding-bottom: 0.1rem; /* Reduce bottom padding for tighter hierarchy */
}

/* Target the margin below headers to tighten hierarchy */
#sidebar .mb-3\.5 {
  margin-bottom: 0.15rem; /* Much smaller gap between header and first item */
}

#sidebar [class*="mb-2.5"] {
  margin-bottom: 0.1rem; /* Even tighter on large screens */
}

/* Eliminate ALL top padding/margin */
#sidebar,
#sidebar-content {
  line-height: 1.3;
  padding-top: 0; /* Complete elimination */
  margin-top: 0;
}

/* Target the section containers directly - reduce spacing between sections */
#sidebar .mt-6 {
  margin-top: 0.75rem; /* Reduce from 1.5rem to 0.75rem */
}

#sidebar .lg\\:mt-8 {
  margin-top: 1rem; /* Reduce from 2rem to 1rem on large screens */
}

/* Alternative approach - target div containers within sidebar */
#sidebar > div > div.mt-6,
#sidebar-content > div > div.mt-6 {
  margin-top: 0.75rem;
}

@media (min-width: 1024px) {
  #sidebar .lg\\:mt-8 {
    margin-top: 1rem; /* Even more compact on large screens */
  }
}

/* Nuclear approach - eliminate ALL top spacing */
#sidebar > *:first-child,
#sidebar-content > *:first-child,
#sidebar *:first-child {
  margin-top: 0;
  padding-top: 0;
}

/* Target any potential containers */
#sidebar nav,
#sidebar div,
#sidebar ul,
#sidebar li:first-child {
  margin-top: 0;
  padding-top: 0;
}

#sidebar * {
  line-height: 1.3;
}

/* Fix vertical centering of navigation items and hover states */
#sidebar ul li a.group {
  display: flex;
  align-items: center;
  line-height: 1; /* Override line-height for perfect centering */
  padding-top: 0.125rem; /* Half the original padding */
  padding-bottom: 0.125rem;
}

/* Specifically target the inner content div for alignment */
#sidebar a.group > div.flex-1 {
  display: flex;
  align-items: center;
  line-height: 1;
}

/* Ensure selected/hover state background is perfectly centered */
#sidebar [class*="bg-primary"] {
  align-items: center;
  line-height: 1;
}

/* Fix method pill spacing and text centering */
#sidebar .method-nav-pill {
  margin-right: 0.5rem; /* Add space between pill and text */
  min-width: 2.5rem; /* Ensure wider pills don't overlap */
}

/* Fix vertical centering of text inside pills - use height and line-height trick */
#sidebar .method-nav-pill span[class*="px-1"] {
  height: 1.25rem; /* Set explicit height */
  line-height: 1.25rem; /* Match line-height to height for perfect centering */
  display: inline-block;
  vertical-align: middle;
}

/* Fix expandable items - equal top and bottom spacing */
#sidebar div.group.flex.items-center {
  padding-top: 0.125rem; /* Match reduced padding of other nav items */
  padding-bottom: 0.125rem; /* Equal top and bottom */
}

/* Fix centering of robot icon SVG within its container */
div.mr-4.p-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Alternative selector for the robot icon container */
a[href*="llms-full.txt"] div.rounded-md.p-1 {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Adjust the SVG mask position to center it properly */
a[href*="llms-full.txt"] svg[style*="robot.svg"] {
  -webkit-mask-position: center center;
  mask-position: center center;
  transform: translateY(1px); /* Fine-tune vertical position */
}

/* Fix agent card image spacing */
[data-component-part="card-title"] [data-rmiz] {
  margin-right: 12px;
  display: inline-block;
  vertical-align: middle;
```