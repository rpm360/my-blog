# Rohit Marathe's Blog

Personal tech blog built with [Eleventy](https://www.11ty.dev/) — writing about Multi-Agent Systems, LLM Orchestration, and Cloud Engineering.

🔗 **Live:** [rpm360.github.io/my-blog](https://rpm360.github.io/my-blog/)

## Quick Start

```bash
# Install dependencies
npm install

# Run local dev server (with live reload)
npm start

# Build for production
npm run build

# Build for GitHub Pages (with path prefix)
npm run build-ghpages
```

The dev server runs at `http://localhost:8080/`.

## Project Structure

```
my-blog/
├── _data/
│   ├── metadata.js          # Site title, author, URL, description
│   └── eleventyDataSchema.js # Draft validation schema
├── _includes/
│   ├── layouts/
│   │   ├── base.njk          # Base HTML (head, nav, footer)
│   │   ├── home.njk          # Homepage wrapper
│   │   └── post.njk          # Blog post wrapper
│   └── postslist.njk         # Reusable post list component
├── content/
│   ├── index.njk             # Homepage (hero + latest posts)
│   ├── about.md              # About page
│   ├── blog/
│   │   ├── blog.11tydata.js  # Auto-applies "posts" tag + post layout
│   │   ├── firstpost.md      # Blog post
│   │   └── *.md              # More blog posts
│   ├── blog.njk              # Archive page
│   ├── tags.njk              # Tags listing page
│   └── 404.md                # 404 page
├── css/
│   └── index.css             # Main stylesheet (dark theme)
├── public/                   # Static assets (copied to _site/)
├── eleventy.config.js        # Eleventy configuration
└── package.json
```

## Adding a New Blog Post

1. Create a new `.md` file in `content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and feeds."
date: 2025-03-15
tags:
  - ai
  - python
---

Your content here. Supports full Markdown.
```

2. The file automatically gets the `posts` tag and `post` layout (via `blog.11tydata.js`).
3. Run `npm start` to preview, then commit and push — GitHub Actions auto-deploys.

### Drafts

Add `draft: true` to front matter to mark a post as a draft. Drafts appear during local dev (`npm start`) but are excluded from production builds.

## Deployment

The blog auto-deploys to GitHub Pages via `.github/workflows/gh-pages.yml`:

- **Trigger:** Push to `main`
- **Build:** `npm run build-ghpages` (adds `/my-blog/` path prefix)
- **Deploy:** Pushes built `_site/` to `gh-pages` branch
- **URL:** [rpm360.github.io/my-blog](https://rpm360.github.io/my-blog/)

## Key Configuration

| File | Purpose |
|------|---------|
| `_data/metadata.js` | Site title, author, URL, description |
| `eleventy.config.js` | Plugins, RSS feed config, image optimization |
| `css/index.css` | Full theme (dark mode, colors, layout) |
| `_includes/layouts/base.njk` | HTML structure, Google Fonts, footer links |

## Tech Stack

- **[Eleventy v3](https://www.11ty.dev/)** — Static site generator
- **Nunjucks** — Templating engine
- **Zero JavaScript** — Static HTML output, no client-side JS payload
- **GitHub Actions** — Auto-deploy on push to `main`

## License

MIT
