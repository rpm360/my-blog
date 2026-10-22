// Thank you to https://github.com/daviddarnes/heading-anchors
// Thank you to https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/

let globalInstanceIndex = 0;

class HeadingAnchors extends HTMLElement {
	static register(tagName = "heading-anchors", registry = window.customElements) {
		if(registry && !registry.get(tagName)) {
			registry.define(tagName, this);
		}
	}

	static attributes = {
		exclude: "data-ha-exclude",
		prefix: "prefix",
		content: "content",
	}

	static classes = {
		anchor: "ha",
		placeholder: "ha-placeholder",
		srOnly: "ha-visualhide",
	}

	static defaultSelector = "h2,h3,h4,h5,h6";

	static css = `
.${HeadingAnchors.classes.srOnly} {
	clip: rect(0 0 0 0);
	height: 1px;
	overflow: hidden;
	position: absolute;
	width: 1px;
}
.${HeadingAnchors.classes.anchor} {
	position: absolute;
	left: var(--ha_offsetx);
	top: var(--ha_offsety);
	text-decoration: none;
	opacity: 0;
}
.${HeadingAnchors.classes.placeholder} {
	opacity: .3;
}
.${HeadingAnchors.classes.anchor}:is(:focus-within, :hover) {
	opacity: 1;
}
.${HeadingAnchors.classes.anchor},
.${HeadingAnchors.classes.placeholder} {
	display: inline-block;
	padding: 0 .25em;

	/* Disable selection of visually hidden label */
	-webkit-user-select: none;
	user-select: none;
}

@supports (anchor-name: none) {
	.${HeadingAnchors.classes.anchor} {
		position: absolute;
		left: anchor(left);
		top: anchor(top);
	}
}`;

	get supports() {
		return "replaceSync" in CSSStyleSheet.prototype;
	}

	get supportsAnchorPosition() {
		return CSS.supports("anchor-name: none");
	}

	constructor() {
		super();

		if(!this.supports) {
			return;
		}

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HeadingAnchors.css);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

		this.headingStyles = {};
		this.instanceIndex = globalInstanceIndex++;
	}

	connectedCallback() {
		if (!this.supports) {
			return;
		}

		this.headings.forEach((heading, index) => {
			if(!heading.hasAttribute(HeadingAnchors.attributes.exclude)) {
				let anchor = this.getAnchorElement(heading);
				let placeholder = this.getPlaceholderElement();

				// Prefers anchor position approach for better accessibility
				// https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
				if(this.supportsAnchorPosition) {
					let anchorName = `--ha_${this.instanceIndex}_${index}`;
					placeholder.style.setProperty("anchor-name", anchorName);
					anchor.style.positionAnchor = anchorName;
				}

				heading.appendChild(placeholder);
				heading.after(anchor);
			}
		});
	}

	// Polyfill-only
	positionAnchorFromPlaceholder(placeholder) {
		if(!placeholder) {
			return;
		}

		let heading = placeholder.closest("h1,h2,h3,h4,h5,h6");
		if(!heading.nextElementSibling) {
			return;
		}

		// TODO next element could be more defensive
		this.positionAnchor(heading.nextElementSibling);
	}

	// Polyfill-only
	positionAnchor(anchor) {
		if(!anchor || !anchor.previousElementSibling) {
			return;
		}

		// TODO previous element could be more defensive
		let heading = anchor.previousElementSibling;
		this.setFontProp(heading, anchor);

		if(this.supportsAnchorPosition) {
			// quit early
			return;
		}

		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			anchor.style.setProperty("--ha_offsetx", `${placeholder.offsetLeft}px`);
			anchor.style.setProperty("--ha_offsety", `${placeholder.offsetTop}px`);
		}
	}

	setFontProp(heading, anchor) {
		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			let style = getComputedStyle(placeholder);
			let props = ["font-weight", "font-size", "line-height", "font-family"];
			let [weight, size, lh, family] = props.map(name => style.getPropertyValue(name));
			anchor.style.setProperty("font", `${weight} ${size}/${lh} ${family}`);
			let vars = style.getPropertyValue("font-variation-settings");
			if(vars) {
				anchor.style.setProperty("font-variation-settings", vars);
			}
		}
	}

	getAccessibleTextPrefix() {
		// Useful for i18n
		return this.getAttribute(HeadingAnchors.attributes.prefix) || "Jump to section titled";
	}

	getContent() {
		if(this.hasAttribute(HeadingAnchors.attributes.content)) {
			return this.getAttribute(HeadingAnchors.attributes.content);
		}
		return "#";
	}

	// Placeholder nests inside of heading
	getPlaceholderElement() {
		let ph = document.createElement("span");
		ph.setAttribute("aria-hidden", true);
		ph.classList.add(HeadingAnchors.classes.placeholder);
		let content = this.getContent();
		if(content) {
			ph.textContent = content;
		}

		ph.addEventListener("mouseover", (e) => {
			let placeholder = e.target.closest(`.${HeadingAnchors.classes.placeholder}`);
			if(placeholder) {
				this.positionAnchorFromPlaceholder(placeholder);
			}
		});

		return ph;
	}

	getAnchorElement(heading) {
		let anchor = document.createElement("a");
		anchor.href = `#${heading.id}`;
		anchor.classList.add(HeadingAnchors.classes.anchor);

		let content = this.getContent();
		anchor.innerHTML = `<span class="${HeadingAnchors.classes.srOnly}">${this.getAccessibleTextPrefix()}: ${heading.textContent}</span>${content ? `<span aria-hidden="true">${content}</span>` : ""}`;

		anchor.addEventListener("focus", e => {
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			if(anchor) {
				this.positionAnchor(anchor);
			}
		});

		anchor.addEventListener("mouseover", (e) => {
			// when CSS anchor positioning is supported, this is only used to set the font
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			this.positionAnchor(anchor);
		});

		return anchor;
	}

	get headings() {
		return this.querySelectorAll(this.selector.split(",").map(entry => `${entry.trim()}[id]`));
	}

	get selector() {
		return this.getAttribute("selector") || HeadingAnchors.defaultSelector;
	}
}

HeadingAnchors.register();

export { HeadingAnchors }
// ---- Per-post view counters (Abacus). Each post starts at 1000; +1 per visit to that post ----
		(function () {
			var BASE = 1000;
			var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
			document.querySelectorAll('.view-count').forEach(function (el) {
				// Only the post's own page counts a visit (and not on localhost); cards just read
				var mode = (el.hasAttribute('data-hit') && !isLocal) ? 'hit' : 'get';
				fetch('https://abacus.jasoncameron.dev/' + mode + '/rpm360-my-blog/' + encodeURIComponent(el.dataset.slug))
					.then(function (r) { return r.ok ? r.json() : { value: 0 }; })
					.then(function (d) { el.textContent = (BASE + (d.value || 0)).toLocaleString('en-US'); })
					.catch(function () {});
			});
		})();

		// ---- Theme toggle ----
		document.getElementById('theme-toggle').addEventListener('click', function () {
			var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', next);
			localStorage.setItem('theme', next);
		});

		// ---- Reading progress ----
		var progress = document.getElementById('progress');
		function updateProgress() {
			var h = document.documentElement;
			var max = h.scrollHeight - h.clientHeight;
			progress.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
		}
		document.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		// ---- Copy buttons on code blocks ----
		document.querySelectorAll('pre').forEach(function (pre) {
			var btn = document.createElement('button');
			btn.className = 'copy-btn';
			btn.type = 'button';
			btn.textContent = 'Copy';
			btn.addEventListener('click', function () {
				navigator.clipboard.writeText(pre.innerText.replace(/\nCopy$/, '')).then(function () {
					btn.textContent = 'Copied ✓';
					setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
				});
			});
			pre.appendChild(btn);
		});

		// ---- Table of contents (post pages) ----
		var toc = document.getElementById('toc');
		if (toc) {
			var heads = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
			if (heads.length >= 3) {
				var list = toc.querySelector('ol');
				heads.forEach(function (h) {
					var li = document.createElement('li');
					li.className = h.tagName === 'H3' ? 'l3' : 'l2';
					var a = document.createElement('a');
					a.href = '#' + h.id;
					a.textContent = h.textContent.replace(/^#\s*/, '');
					li.appendChild(a);
					list.appendChild(li);
				});
				toc.hidden = false;
				var links = toc.querySelectorAll('a');
				var io = new IntersectionObserver(function (entries) {
					entries.forEach(function (e) {
						if (e.isIntersecting) {
							links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
						}
					});
				}, { rootMargin: '-80px 0px -70% 0px' });
				heads.forEach(function (h) { io.observe(h); });
			}
		}

		// ---- Search palette (⌘K / Ctrl+K or "/") ----
		(function () {
			var dialog = document.getElementById('search-dialog');
			var input = document.getElementById('search-input');
			var results = document.getElementById('search-results');
			var openBtn = document.getElementById('search-open');
			var index = null, selected = 0;

			function load() {
				if (index) return Promise.resolve(index);
				return fetch(openBtn.dataset.index).then(function (r) { return r.json(); }).then(function (d) { return (index = d); });
			}
			function render(q) {
				q = q.trim().toLowerCase();
				var terms = q.split(/\s+/).filter(Boolean);
				var hits = (index || []).filter(function (p) {
					var hay = (p.title + ' ' + p.description + ' ' + p.tags.join(' ') + ' ' + p.text).toLowerCase();
					return terms.every(function (t) { return hay.indexOf(t) !== -1; });
				}).slice(0, 8);
				if (!terms.length) hits = (index || []).slice(0, 5);
				selected = 0;
				results.innerHTML = '';
				if (!hits.length) {
					results.innerHTML = '<li class="search-empty">No posts match “' + q.replace(/</g, '&lt;') + '”</li>';
					return;
				}
				hits.forEach(function (p, i) {
					var li = document.createElement('li');
					var a = document.createElement('a');
					a.href = p.url;
					if (i === 0) a.className = 'selected';
					var t = document.createElement('span'); t.className = 's-title'; t.textContent = p.title;
					var d = document.createElement('span'); d.className = 's-desc'; d.textContent = p.description;
					a.appendChild(t); a.appendChild(d); li.appendChild(a); results.appendChild(li);
				});
			}
			function open() {
				dialog.showModal();
				input.value = '';
				load().then(function () { render(''); });
				input.focus();
			}
			function move(delta) {
				var items = results.querySelectorAll('a');
				if (!items.length) return;
				items[selected] && items[selected].classList.remove('selected');
				selected = (selected + delta + items.length) % items.length;
				items[selected].classList.add('selected');
				items[selected].scrollIntoView({ block: 'nearest' });
			}
			openBtn.addEventListener('click', open);
			input.addEventListener('input', function () { load().then(function () { render(input.value); }); });
			input.addEventListener('keydown', function (e) {
				if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
				else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
				else if (e.key === 'Enter') {
					var a = results.querySelectorAll('a')[selected];
					if (a) window.location.href = a.href;
				}
			});
			dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
			document.addEventListener('keydown', function (e) {
				var typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
				if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dialog.open ? dialog.close() : open(); }
				else if (e.key === '/' && !typing && !dialog.open) { e.preventDefault(); open(); }
			});
		})();