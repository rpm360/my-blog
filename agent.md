# Agent Guide — Rohit Marathe's Blog

Quick-start guide for any AI agent working on this repo.

## Repo Overview

This is a **personal tech blog** for Rohit Marathe, built with [Eleventy v3](https://www.11ty.dev/) and deployed to GitHub Pages. The site is statically generated — no server, no database, just Markdown → HTML.

- **Live URL:** `https://rpm360.github.io/my-blog/`
- **Deploy:** Automatic via GitHub Actions on push to `main`
- **Theme:** Dark mode with cyan/purple accents (see `css/index.css`)

## How to Add a New Blog Post

### 1. Create the file

Create a Markdown file in `content/blog/`. The filename becomes the URL slug.

```
content/blog/my-new-post.md → /blog/my-new-post/
```

### 2. Add front matter

Every blog post needs this YAML front matter:

```yaml
---
title: "Your Post Title"
description: "Brief description for SEO and RSS feed."
date: 2025-03-15
tags:
  - ai
  - python
---
```

**Required fields:**
- `title` — Display title
- `date` — Publication date (YYYY-MM-DD), determines sort order
- `description` — Used in `<meta>` tags and RSS feed

**Optional fields:**
- `tags` — Array of tags (creates tag pages automatically)
- `draft: true` — Hides from production build, visible in dev server only

### 3. Write content

Standard Markdown. Code blocks with syntax highlighting are supported:

````markdown
```python
def example():
    return "Hello"
```
````

Images can be co-located with the post by using a folder:

```
content/blog/my-post/
├── my-post.md
└── diagram.png     ← reference as ![alt](diagram.png)
```

### 4. No layout needed

The file `content/blog/blog.11tydata.js` automatically applies:
- The `posts` tag (adds it to the blog collection)
- The `layouts/post.njk` layout (renders with nav, footer, prev/next links)

You do **not** need to specify `layout` or `tags: posts` in front matter.

## Key Files to Know

| File | What it does |
|------|-------------|
| `_data/metadata.js` | Site title, author name/email, base URL |
| `content/index.njk` | Homepage — hero section + latest 3 posts |
| `content/about.md` | About page (Rohit's bio) |
| `content/blog/*.md` | Blog posts |
| `css/index.css` | Full theme — dark mode, all visual styles |
| `_includes/layouts/base.njk` | HTML shell (head, nav, footer, Google Fonts) |
| `_includes/layouts/post.njk` | Blog post layout (syntax highlight CSS, tags, prev/next) |
| `_includes/postslist.njk` | Reusable post list component |
| `eleventy.config.js` | Plugins, RSS feed metadata, image optimization, filters |
| `.github/workflows/gh-pages.yml` | CI/CD — builds and deploys to GitHub Pages |

## Commands

```bash
npm install          # Install dependencies
npm start            # Dev server at http://localhost:8080/ (live reload)
npm run build        # Production build → _site/
npm run build-ghpages # Build with /my-blog/ path prefix (for GitHub Pages)
```

## Build & Deploy Flow

```
Push to main → GitHub Actions runs → npm run build-ghpages → _site/ pushed to gh-pages branch → GitHub Pages serves it
```

The workflow file is `.github/workflows/gh-pages.yml`. Build output goes to `_site/`.

## Design System

The theme lives in `css/index.css`. Key CSS variables:

```css
--bg-primary: #0a0f1a;       /* Page background */
--accent-cyan: #00d4ff;       /* Links, highlights */
--accent-purple: #7c3aed;     /* Tags, secondary accent */
--text-primary: #e2e8f0;      /* Headings */
--text-secondary: #94a3b8;    /* Body text */
```

Fonts: **Inter** (body), **JetBrains Mono** (code) — loaded via Google Fonts in `base.njk`.

## Content Architecture

- Posts in `content/blog/` auto-join the `posts` collection
- The homepage (`content/index.njk`) shows the latest 3 posts
- Tag pages are auto-generated from post tags — no manual work needed
- Navigation is driven by `eleventyNavigation` keys in front matter
- RSS feed at `/feed/feed.xml` auto-includes the latest 10 posts

## Common Tasks

### Edit site metadata
→ `_data/metadata.js` (title, description, author)

### Change homepage hero text
→ `content/index.njk` (hero section at the top)

### Update About page
→ `content/about.md`

### Change theme colors
→ `css/index.css` (CSS variables in `:root`)

### Add navigation item
→ Add `eleventyNavigation` key to any content file's front matter:
```js
---js
const eleventyNavigation = { key: "Projects", order: 5 };
---
```
