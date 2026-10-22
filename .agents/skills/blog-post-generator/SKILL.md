---
name: blog-post-generator
description: >-
  Converts raw technical conversation transcripts, screen review notes, chat logs, or architectural ideas
  into polished, production-grade technical blog posts for Rohit Marathe's Eleventy blog.
  Handles frontmatter, deep technical explanations, code snippets, system architecture diagrams,
  Eleventy build validation, and deployment.
---

# Blog Post Generator Skill

This skill operationalizes the end-to-end workflow of transforming raw dialogue, conversational transcripts, brainstorming sessions, or design notes into publication-ready engineering articles for this blog.

---

## Workflow Steps

### Step 1: Analyze & Extract Key Technical Pillars
When given a conversation transcript or raw technical notes:
1. **Identify the Core Architectural Dilemma**: Extract the central problem (e.g., SQLite write locks under concurrency, stateful agent checkpoints vs. cross-thread memory, Redis vs. Mem0).
2. **Catalog Real-World Scenarios & Edge Cases**: Pull out user questions, failure modes (e.g., `database is locked`, container restart data loss, 100k req/sec spikes), and practical case studies discussed.
3. **Formulate High-Value Takeaways**: Synthesize solutions, trade-off matrices, best practices, and production checklists.

---

### Step 2: Format the Markdown Article
Every blog post should follow the established voice and visual standard:
- **Tone**: Authoritative, pragmatic, systems-engineering focused ("from the trenches").
- **Frontmatter**:
  ```yaml
  ---
  title: "Clear, Compelling Technical Title"
  description: "One or two sentence summary for meta tags, RSS, and card previews."
  date: YYYY-MM-DD
  tags:
    - primary-topic
    - ai-agents
    - system-design
    - python
  ---
  ```
  *(Note: `layouts/post.njk` and `tags: posts` are automatically applied by `content/blog/blog.11tydata.js`—do not duplicate them).*

- **Section Structure**:
  1. **Hook & The Problem**: Why the naive or tutorial approach breaks down.
  2. **Core Architectural Concepts**: Clear diagrams or ASCII flowcharts.
  3. **Deep Dive / Comparison Table**: Side-by-side evaluation matrix across latency, storage, query capabilities, and use cases.
  4. **Working Code Examples**: Production-ready code (e.g., Python with type hints, connection pooling, error handling).
  5. **Real-World Walkthrough / Scenario**: Concrete user story or system flow.
  6. **Scale & Production Architecture**: High-throughput considerations (queues, caching, horizontal partitioning) with Mermaid sequence/flow diagrams.
  7. **Production Checklist**: Actionable takeaways formatted as checkboxes.

---

### Step 3: Write Post to the Repository
- **File Location**: Save the post to `content/blog/<slug>.md` or `content/blog/<slug>/<slug>.md` (if co-locating custom images).
- Use a kebab-case slug representing the topic:
  ```text
  content/blog/langgraph-persistence-memory-sqlite-to-mem0.md
  ```

---

### Step 4: Validate with Eleventy Build
Always run a local build to ensure frontmatter, liquid/nunjucks syntax, and code blocks compile cleanly:

```bash
npm run build
```

Verify that:
1. `_site/blog/<slug>/index.html` was generated.
2. The search index `_site/search.json` includes the new post.
3. No Eleventy template compilation errors occurred.

---

### Step 5: Commit and Deploy
Once verified:
1. Commit the changes:
   ```bash
   git add content/blog/<slug>.md
   git commit -m "feat(blog): add post on <Topic>"
   ```
2. Pull/rebase if needed and push to `origin main`:
   ```bash
   git push origin main
   ```
3. GitHub Actions will automatically run the build and publish to GitHub Pages.

---

## Verification Checklist
- [ ] Post appears in `_site/blog/<slug>/index.html` with valid HTML.
- [ ] Table of contents dynamically populates if 3+ headings are present.
- [ ] Reading time and view counter tags are rendered.
- [ ] Search palette (⌘K) can find the post by keywords and tags.
