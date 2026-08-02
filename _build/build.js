const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { SITE, GH_USER, OWNER, PRODUCTS } = require('./data');
const { DOCS, CHANGELOG, ABOUT } = require('./pages');

// Screenshots live beside this script; the site is written to the repo root.
const SRC = path.join(__dirname, 'screenshots');
const OUT = path.resolve(__dirname, '..');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Every off-site link (GitHub, releases) opens in a new tab, so leaving the
// site never costs the reader their place. Applied to the finished HTML rather
// than to each template, so links added later are covered too. rel is required:
// target=_blank without noopener hands the opened page a window.opener handle.
const externalize = html => html.replace(
  /<a\s+([^>]*href="https?:\/\/[^"]*"[^>]*)>/gi,
  (match, attrs) => /\btarget=/i.test(attrs)
    ? match
    : `<a ${attrs} target="_blank" rel="noopener noreferrer">`);

// Line icons for the how-it-works and trust sections.
const ICON = {
  export: 'M12 3v10m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  import: 'M12 21V11m0 0 4 4m-4-4-4 4M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2',
  read:   'M4 20V10m5 10V4m5 16v-7m5 7V8',
  lock:   'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
  plug:   'M9 3v6m6-6v6M5 9h14v3a7 7 0 0 1-7 7 7 7 0 0 1-7-7z',
  home:   'M4 11 12 4l8 7M6 10v10h12V10',
  code:   'M9 17 4 12l5-5m6 10 5-5-5-5',
};
const icon = name =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[name]}"/></svg>`;

const GH_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>';
const DL_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1a1 1 0 0 1 1 1v6.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42L7 8.59V2a1 1 0 0 1 1-1Zm-6 11a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V13a1 1 0 0 1 1-1Z"/></svg>';

// Shared <head>. `depth` is how many levels below root the page sits.
function head({ title, desc, url, ogImage, accent, depth, jsonLd }) {
  const up = depth ? '../'.repeat(depth) : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#17143A" />
<link rel="icon" href="${up}favicon.svg" type="image/svg+xml" />
<link rel="icon" href="${up}favicon-32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="${up}apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="${up}assets/site.css" />
${accent ? `<style>:root { --accent: ${accent}; }\n@media (prefers-color-scheme: dark) { :root { --accent: ${lighten(accent)}; } }</style>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`;
}

// Product accents are picked for a light ground; nudge them brighter for dark.
function lighten(hex) {
  const n = parseInt(hex.slice(1), 16);
  const mix = c => Math.round(c + (255 - c) * 0.42);
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => mix(c).toString(16).padStart(2, '0')).join('');
}

// A shell prompt — chevron plus caret. Reads at 16px, and says "developer"
// without tying the mark to any one product.
const MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
      <defs><linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8B7CFF"/><stop offset="1" stop-color="#5B54F0"/>
      </linearGradient></defs>
      <rect width="32" height="32" rx="9" fill="url(#bm)"/>
      <path class="mark-glyph" d="M10 11.5 L14.8 16 L10 20.5"/>
      <path class="mark-glyph" d="M17.6 20.8 H23"/>
    </svg>`;

const NAV = [
  ['Products',  'index.html#products', 'products'],
  ['Docs',      'docs/index.html',      'docs'],
  ['Changelog', 'changelog/index.html', 'changelog'],
  ['About',     'about/index.html',     'about'],
];

function siteHeader(depth, current) {
  const up = depth ? '../'.repeat(depth) : '';
  const links = NAV.map(([label, href, key]) =>
    `<a href="${up}${href}"${current === key ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('\n      ');
  return `<header class="site-head">
  <div class="wrap">
    <a class="brand" href="${up}index.html">${MARK}<span class="brand-name">${esc(OWNER.handle)}</span></a>
    <nav class="site-nav" aria-label="Site">
      ${links}
      <a href="${GH_USER}">GitHub</a>
      <button class="theme-toggle" type="button" aria-label="Switch colour theme" title="Switch colour theme">
        <svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
        <svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
      </button>
    </nav>
  </div>
</header>`;
}

function siteFooter(depth) {
  const up = depth ? '../'.repeat(depth) : '';
  const products = PRODUCTS.map(p =>
    `<a href="${up}${p.slug}/index.html">${esc(p.name)}</a>`).join('\n          ');
  return `<footer class="site-foot">
  <div class="wrap">
    <div class="foot-cols">
      <div class="foot-brand">
        <a class="brand" href="${up}index.html">${MARK}<span class="brand-name">${esc(OWNER.handle)}</span></a>
      </div>
      <nav class="foot-col" aria-label="Products">
        <p class="foot-label">Products</p>
        ${products}
      </nav>
      <nav class="foot-col" aria-label="Resources">
        <p class="foot-label">Resources</p>
        <a href="${up}docs/index.html">Documentation</a>
        <a href="${up}changelog/index.html">Changelog</a>
        <a href="${PRODUCTS[0].releases}">Downloads</a>
      </nav>
      <nav class="foot-col" aria-label="More">
        <p class="foot-label">More</p>
        <a href="${up}about/index.html">About</a>
        <a href="${GH_USER}">GitHub</a>
        <a href="${PRODUCTS[0].repo}/issues">Report an issue</a>
      </nav>
    </div>
    <div class="foot-base">
      <p>© ${new Date().getFullYear()} ${esc(OWNER.name)}</p>
      <p>Runs on your machine. Nothing is uploaded.</p>
    </div>
  </div>
</footer>`;
}

const REVEAL_JS = `
<script>
(function () {
  // Hairline under the header only once the page has scrolled off the top.
  var head = document.querySelector('.site-head');
  var onScroll = function () { head.classList.toggle('stuck', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });


  // Theme: follow the system until the reader says otherwise, then remember.
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var now = root.getAttribute('data-theme') || (systemDark ? 'dark' : 'light');
      var next = now === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    targets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // Stagger siblings so a row of cards arrives in sequence, not at once.
        var sibs = e.target.parentElement
          ? [].slice.call(e.target.parentElement.children).filter(function (c) { return c.classList.contains('reveal'); })
          : [];
        var i = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Reading progress along the top. Skipped entirely when motion is reduced.
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'progress';
    document.body.appendChild(bar);
    var queued = false;
    var draw = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      queued = false;
    };
    draw();
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(draw); }
    }, { passive: true });
    window.addEventListener('resize', draw, { passive: true });
  }
})();
</script>`;

const LIGHTBOX_JS = `
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Enlarged screenshot">
  <img id="lightbox-img" alt="" />
  <span class="lightbox-hint">Click anywhere or press Esc to close</span>
</div>
<script>
(function () {
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightbox-img');
  var last = null;
  document.querySelectorAll('.shot').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      boxImg.src = img.src; boxImg.alt = img.alt;
      box.classList.add('open'); last = btn;
    });
  });
  function close() {
    box.classList.remove('open'); boxImg.removeAttribute('src');
    if (last) { last.focus(); last = null; }
  }
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && box.classList.contains('open')) close();
  });
})();
</script>`;

/* ── Home ──────────────────────────────────────────────────── */
function buildHome() {
  const hero = PRODUCTS[0]; // newest/flagship product supplies the hero shot
  const steps = hero.howItWorks.map(([ic, t, d], i) => `
        <li class="step" data-reveal>
          <span class="step-n">${String(i + 1).padStart(2, '0')}</span>
          <span class="step-ic">${icon(ic)}</span>
          <h3>${esc(t)}</h3>
          <p>${esc(d)}</p>
        </li>`).join('\n');

  const trust = hero.trust.map(([ic, t, d]) => `
        <div class="trust-item" data-reveal>
          ${icon(ic)}
          <div>
            <h3>${esc(t)}</h3>
            <p>${esc(d)}</p>
          </div>
        </div>`).join('\n');
  const cards = PRODUCTS.map(p => `
        <article class="product-card" data-reveal>
          <a class="thumb" href="${p.slug}/index.html" aria-label="${esc(p.name)}">
            <img src="${p.slug}/assets/${p.cover}.webp" alt="${esc(p.name)} dashboard" loading="lazy" decoding="async" width="2400" height="1500" />
          </a>
          <div class="body">
            <div class="meta-row">
              <span class="badge">Shipped · v${esc(p.version)}</span>
              <span class="badge badge-neutral">${esc(p.platform)}</span>
            </div>
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.summary)}</p>
            <div class="card-actions">
              <a class="btn btn-primary" href="${p.releases}">${DL_ICON}Download</a>
              <a class="btn btn-ghost" href="${p.slug}/index.html">Learn more</a>
            </div>
          </div>
        </article>`).join('\n');

  return `${head({
    title: `${OWNER.handle} — Self-hosted desktop software`,
    desc: OWNER.blurb,
    url: `${SITE}/`,
    ogImage: `${SITE}/assets/og-home.png`,
    accent: null,
    depth: 0,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: OWNER.handle,
      url: `${SITE}/`,
      description: OWNER.blurb,
      author: { '@type': 'Person', name: OWNER.name, url: GH_USER },
    },
  })}
${siteHeader(0, 'products')}

<section class="hero">
  <div class="wrap hero-split">
    <div class="hero-copy">
      <span class="pill"><span class="spark"></span>${esc(OWNER.kicker)}</span>
      <h1 class="display-1">Software that runs on <span class="grad">your machine</span>, not someone else's.</h1>
      <p class="lede">${esc(OWNER.blurb)}</p>
      <div class="hero-actions">
        <a class="btn btn-light btn-lg" href="#products">Browse products</a>
        <a class="btn btn-outline-light btn-lg" href="${GH_USER}">${GH_ICON}GitHub</a>
      </div>
    </div>
    <div class="frame">
      <div class="frame-bar" aria-hidden="true">
        <i></i><i></i><i></i>
        <span class="frame-url">localhost:5080</span>
      </div>
      <img src="${hero.slug}/assets/${hero.cover}.webp" alt="${esc(hero.name)} running locally" width="2400" height="1500" decoding="async" />
    </div>
  </div>
</section>

<main id="main">
  <section class="section" id="how">
    <div class="wrap">
      <header class="section-head" data-reveal>
        <p class="eyebrow">How it works</p>
        <h2 class="display-2">Three steps, then it is just there</h2>
        <p class="lede">No connecting accounts, no waiting for a sync. The whole loop runs on files you already have.</p>
      </header>
      <ol class="steps-flow">
${steps}
      </ol>
    </div>
  </section>

  <section class="section section-alt" id="privacy">
    <div class="wrap">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Where your data goes</p>
        <h2 class="display-2">Nowhere</h2>
        <p class="lede">Claims worth checking rather than taking on faith — every one of them is visible in the source.</p>
      </header>
      <div class="trust-grid">
${trust}
      </div>
    </div>
  </section>

  <section class="section" id="products">
    <div class="wrap">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Products</p>
        <h2 class="display-2">What's available today</h2>
        <p class="lede">Each one installs and runs locally. No accounts, no subscriptions, no data leaving your PC.</p>
      </header>
      <div class="product-grid">
${cards}
        <article class="product-card product-card-soon" data-reveal>
          <div class="body">
            <span class="badge badge-neutral" style="align-self:flex-start">In development</span>
            <h3>More on the way</h3>
            <p>Further products are being built in the same shape — self-hosted, single-install, Windows-first. This page is where they'll land.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="about">
    <div class="wrap-narrow">
      <header class="section-head" data-reveal>
        <p class="eyebrow">About</p>
        <h2 class="display-2">Why local-first</h2>
      </header>
      <div class="bento">
        <div class="tile" data-reveal>
          <p class="idx">01</p>
          <h3>Your data never leaves the machine</h3>
          <p>Financial records are the obvious case, but it holds generally: software that keeps your files on your own disk cannot lose them in someone else's breach.</p>
        </div>
        <div class="tile" data-reveal>
          <p class="idx">02</p>
          <h3>One install, no dependencies</h3>
          <p>Everything a product needs is inside the installer — runtime, database, web server. Nothing to configure before it works.</p>
        </div>
        <div class="tile" data-reveal>
          <p class="idx">03</p>
          <h3>It keeps working</h3>
          <p>No subscription to lapse and no server to shut down. An installed copy runs for as long as the machine does.</p>
        </div>
      </div>
    </div>
  </section>
</main>

${siteFooter(0)}
${REVEAL_JS}
</body>
</html>
`;
}

/* ── Product page ──────────────────────────────────────────── */
function buildProduct(p) {
  let n = 0;
  const tour = p.sections.map(sec => {
    const plates = sec.plates.map(([slug, title, caption]) => {
      n++;
      return `      <figure class="plate" data-reveal>
        <figcaption class="plate-head">
          <span class="plate-no">${String(n).padStart(2, '0')}</span>
          <div class="plate-text">
            <h3>${esc(title)}</h3>
            ${caption ? `<p>${esc(caption)}</p>` : ''}
          </div>
        </figcaption>
        <button class="shot" type="button" aria-label="Enlarge screenshot: ${esc(title)}">
          <img src="assets/${slug}.webp" alt="${esc(title)} screen of ${esc(p.name)}" loading="lazy" decoding="async" width="2400" height="1500" />
        </button>
      </figure>`;
    }).join('\n');

    return `    <section class="section" id="${sec.id}" style="padding-top:clamp(2rem,4vw,3rem)">
      <div class="wrap-wide">
        <header class="section-head" data-reveal>
          <p class="eyebrow">${esc(sec.eyebrow)}</p>
          <h2 class="display-2">${esc(sec.title)}</h2>
          <p class="lede">${esc(sec.blurb)}</p>
        </header>
${plates}
      </div>
    </section>`;
  }).join('\n\n');

  const highlights = p.highlights.map(([t, d], i) => `        <div class="tile" data-reveal>
          <p class="idx">${String(i + 1).padStart(2, '0')}</p>
          <h3>${esc(t)}</h3>
          <p>${esc(d)}</p>
        </div>`).join('\n');

  const dls = p.downloads.map(d => `        <div class="dl-card" data-reveal>
          <a class="btn ${d.kind === 'primary' ? 'btn-primary' : 'btn-ghost'}" href="${p.releases}">
            ${DL_ICON}<span>${esc(d.label)}<span class="sub">${esc(d.sub)}</span></span>
          </a>
          <p>${esc(d.note)}</p>
        </div>`).join('\n');

  const reqs = p.requirements.map(([k, v]) => `          <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n');
  const tourNav = p.sections.map(s => `<a href="#${s.id}">${esc(s.eyebrow)}</a>`).join('');

  return `${head({
    title: `${p.name} — ${OWNER.name}`,
    desc: p.summary,
    url: `${SITE}/${p.slug}/`,
    ogImage: `${SITE}/${p.slug}/assets/og-cover.png`,
    accent: p.accent,
    depth: 1,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: p.name,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Windows 10, Windows 11',
      softwareVersion: p.version,
      description: p.summary,
      url: `${SITE}/${p.slug}/`,
      downloadUrl: p.releases,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: OWNER.name, url: GH_USER },
    },
  })}
${siteHeader(1, 'products')}

<section class="hero">
  <div class="wrap hero-split">
    <div class="hero-copy">
      <span class="pill"><span class="spark"></span>v${esc(p.version)} · ${esc(p.platform)}</span>
      <h1 class="display-1">${esc(p.tagline)}</h1>
      <p class="lede">${esc(p.summary)}</p>
      <div class="hero-actions">
        <a class="btn btn-light btn-lg" href="${p.releases}">
          ${DL_ICON}<span>${esc(p.downloads[0].label)}<span class="sub">${esc(p.downloads[0].sub)}</span></span>
        </a>
        <a class="btn btn-outline-light btn-lg" href="${p.repo}">${GH_ICON}View source</a>
      </div>
    </div>
    <div class="frame">
      <div class="frame-bar" aria-hidden="true">
        <i></i><i></i><i></i>
        <span class="frame-url">localhost:5080</span>
      </div>
      <img src="assets/${p.cover}.webp" alt="${esc(p.name)} running locally" width="2400" height="1500" decoding="async" />
    </div>
  </div>
</section>

<main id="main">
  <section class="section">
    <div class="wrap">
      <header class="section-head" data-reveal>
        <p class="eyebrow">What it does</p>
        <h2 class="display-2">Built around the files your bank already gives you</h2>
      </header>
      <div class="bento">
${highlights}
      </div>
    </div>
  </section>

  <section class="section section-alt" id="download">
    <div class="wrap">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Download</p>
        <h2 class="display-2">Install it</h2>
        <p class="lede">Two ways to run it. Both are the same application — the installer just sets it up to start with Windows.</p>
      </header>
      <div class="dl-grid">
${dls}
      </div>

      <h3 style="margin:2.75rem 0 1rem;font-size:1.05rem;font-weight:680">System requirements</h3>
      <div class="table-scroll">
        <table class="req">
          <tbody>
${reqs}
          </tbody>
        </table>
      </div>

      <p class="note" style="margin-top:2rem">
        Windows SmartScreen may warn on first run because the build is not code-signed.
        Choose "More info" then "Run anyway" if you trust the source.
      </p>
    </div>
  </section>

  <section class="section" id="tour">
    <div class="wrap-wide">
      <header class="section-head" data-reveal>
        <p class="eyebrow">Screens</p>
        <h2 class="display-2">Every screen, at full size</h2>
        <p class="lede">Click any screenshot to enlarge it.</p>
      </header>
      <nav class="tour-nav" aria-label="Tour sections">${tourNav}</nav>
    </div>
  </section>

${tour}

  <section class="section" style="padding-top:0">
    <div class="wrap-wide">
      <p class="note">
        Screenshots come from a throwaway instance seeded with real statement files.
        Account holder, account numbers and counterparty names are substituted demo values.
      </p>
      <ul class="chips" style="margin-top:2rem">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    </div>
  </section>
</main>

${siteFooter(1)}
${LIGHTBOX_JS}
${REVEAL_JS}
</body>
</html>
`;
}

/* ── Long-form pages ───────────────────────────────────────── */

// A page hero without the navy field — used by the content pages, so the
// product heroes stay the only full-bleed moments on the site.
function pageHead(eyebrow, title, lede) {
  return `<section class="section" style="padding-bottom:0">
  <div class="wrap">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1 class="display-2">${esc(title)}</h1>
    <p class="lede" style="margin-top:1rem">${esc(lede)}</p>
  </div>
</section>`;
}

function renderBlocks(blocks) {
  return blocks.map(b => {
    if (b.p) return `        <p>${esc(b.p)}</p>`;
    if (b.h3) return `        <h3>${esc(b.h3)}</h3>`;
    if (b.list) return `        <ul>\n${b.list.map(i => `          <li>${esc(i)}</li>`).join('\n')}\n        </ul>`;
    if (b.steps) return `        <ol class="steps">\n${b.steps.map(i => `          <li>${esc(i)}</li>`).join('\n')}\n        </ol>`;
    if (b.callout) return `        <div class="callout"><strong>${esc(b.callout[0])}</strong><p>${esc(b.callout[1])}</p></div>`;
    return '';
  }).join('\n');
}

function buildDocs(d) {
  const toc = d.sections.map(s =>
    `        <a href="#${s.id}">${esc(s.heading)}</a>`).join('\n');
  const body = d.sections.map(s => `      <section id="${s.id}">
        <h2>${esc(s.heading)}</h2>
${renderBlocks(s.blocks)}
      </section>`).join('\n\n');

  return `${head({
    title: `Documentation — ${OWNER.handle}`,
    desc: d.lede, url: `${SITE}/${d.slug}/`,
    ogImage: `${SITE}/assets/og-home.png`, accent: null, depth: 1,
  })}
${siteHeader(1, 'docs')}
${pageHead(d.eyebrow, d.title, d.lede)}

<main id="main" class="section" style="padding-top:clamp(2rem,4vw,3rem)">
  <div class="wrap doc-layout">
    <aside class="doc-toc">
      <p class="toc-label">On this page</p>
      <nav aria-label="Table of contents">
${toc}
      </nav>
    </aside>
    <div class="prose">
${body}
    </div>
  </div>
</main>

${siteFooter(1)}
<script>
(function () {
  // Highlight the section currently in view in the table of contents.
  var links = [].slice.call(document.querySelectorAll('.doc-toc a'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.classList.remove('active'); });
      if (byId[e.target.id]) byId[e.target.id].classList.add('active');
    });
  }, { rootMargin: '-96px 0px -70% 0px' });
  document.querySelectorAll('.prose > section').forEach(function (s) { io.observe(s); });
})();
</script>
${REVEAL_JS}
</body>
</html>
`;
}

function buildChangelog(c, product) {
  const releases = c.releases.map(r => `      <article class="release" data-reveal>
        <div class="release-head">
          <span class="release-ver">v${esc(r.version)}</span>
          <span class="badge">${esc(r.status)}</span>
        </div>
        <h2>${esc(r.title)}</h2>
        <p class="lede" style="margin-top:.85rem">${esc(r.summary)}</p>
${r.groups.map(([g, items]) => `        <div class="release-group">
          <h3>${esc(g)}</h3>
          <ul>
${items.map(i => `            <li>${esc(i)}</li>`).join('\n')}
          </ul>
        </div>`).join('\n')}
        <div style="margin-top:1.75rem">
          <a class="btn btn-primary" href="${product.releases}">${DL_ICON}Download v${esc(r.version)}</a>
        </div>
      </article>`).join('\n\n');

  return `${head({
    title: `Changelog — ${OWNER.handle}`,
    desc: c.lede, url: `${SITE}/${c.slug}/`,
    ogImage: `${SITE}/assets/og-home.png`, accent: null, depth: 1,
  })}
${siteHeader(1, 'changelog')}
${pageHead(c.eyebrow, c.title, c.lede)}

<main id="main" class="section prose" style="padding-top:clamp(2rem,4vw,3rem)">
  <div class="wrap-narrow">
${releases}
  </div>
</main>

${siteFooter(1)}
${REVEAL_JS}
</body>
</html>
`;
}

function buildAbout(a) {
  return `${head({
    title: `About — ${OWNER.handle}`,
    desc: a.lede, url: `${SITE}/${a.slug}/`,
    ogImage: `${SITE}/assets/og-home.png`, accent: null, depth: 1,
  })}
${siteHeader(1, 'about')}
${pageHead(a.eyebrow, a.title, a.lede)}

<main id="main" class="section prose" style="padding-top:clamp(2rem,4vw,3rem)">
  <div class="wrap-narrow">
    <section>
${renderBlocks(a.blocks)}
      <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:2rem">
        <a class="btn btn-primary" href="${GH_USER}">${GH_ICON}github.com/${esc(OWNER.handle)}</a>
        <a class="btn btn-ghost" href="${PRODUCTS[0].repo}/issues">Open an issue</a>
      </div>
    </section>
  </div>
</main>

${siteFooter(1)}
${REVEAL_JS}
</body>
</html>
`;
}

/* ── 404 ───────────────────────────────────────────────────── */
function build404() {
  return `${head({
    title: `Page not found — ${OWNER.handle}`,
    desc: 'That page does not exist.',
    url: `${SITE}/404.html`,
    ogImage: `${SITE}/assets/og-home.png`,
    accent: null,
    depth: 0,
  })}
${siteHeader(0, null)}

<main id="main" class="section" style="padding-block:clamp(4rem,12vw,8rem)">
  <div class="wrap-narrow">
    <p class="eyebrow">404</p>
    <h1 class="display-2">That page is not here</h1>
    <p class="lede" style="margin-top:1rem">
      The link may be out of date, or the page may have been renamed. Everything
      below still exists.
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:2rem">
      <a class="btn btn-primary" href="index.html">Back to the start</a>
      <a class="btn btn-ghost" href="${PRODUCTS[0].slug}/index.html">${esc(PRODUCTS[0].name)}</a>
      <a class="btn btn-ghost" href="docs/index.html">Documentation</a>
    </div>
  </div>
</main>

${siteFooter(0)}
${REVEAL_JS}
</body>
</html>
`;
}

/* ── Build ─────────────────────────────────────────────────── */
(async () => {
  // Clean the generated surfaces, keep repo metadata.
  for (const entry of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'assets']) {
    fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
  }
  for (const p of PRODUCTS) fs.rmSync(path.join(OUT, p.slug), { recursive: true, force: true });
  for (const g of [DOCS, CHANGELOG, ABOUT]) fs.rmSync(path.join(OUT, g.slug), { recursive: true, force: true });

  fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'site.css'), path.join(OUT, 'assets', 'site.css'));

  for (const p of PRODUCTS) {
    const pdir = path.join(OUT, p.slug);
    const pass = path.join(pdir, 'assets');
    fs.mkdirSync(pass, { recursive: true });

    for (const sec of p.sections)
      for (const [slug] of sec.plates)
        fs.copyFileSync(path.join(SRC, slug + '.webp'), path.join(pass, slug + '.webp'));

    // Social card: the product's cover screen inset on the brand navy field.
    const inset = await sharp(path.join(SRC, p.cover + '.webp'))
      .resize({ width: 1040 })
      .extract({ left: 0, top: 0, width: 1040, height: 540 })
      .png().toBuffer();
    await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 0x22, g: 0x1F, b: 0x55, alpha: 1 } } })
      .composite([{ input: inset, top: 90, left: 80 }])
      .png().toFile(path.join(pass, 'og-cover.png'));

    fs.writeFileSync(path.join(pdir, 'index.html'), externalize(buildProduct(p)), 'utf8');
    console.log(`${p.slug}/index.html`, (fs.statSync(path.join(pdir, 'index.html')).size / 1024).toFixed(0), 'KB');
  }

  // Home social card: brand wordmark on the navy field, rasterised from SVG.
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#221F55"/>
    <circle cx="1050" cy="120" r="260" fill="#4F46E5" opacity="0.22"/>
    <text x="90" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="46" fill="#A9A2F5" letter-spacing="8">ARUNGDEV</text>
    <text x="90" y="360" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="#F2F0FF">Self-hosted desktop</text>
    <text x="90" y="450" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="700" fill="#F2F0FF">software</text>
    <text x="90" y="540" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#C3BFE6">Runs on your machine. Not someone else's.</text>
  </svg>`);
  await sharp(svg).png().toFile(path.join(OUT, 'assets', 'og-home.png'));

  // Favicon set, rasterised from the same mark the header uses.
  const markSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="512" height="512">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8B7CFF"/><stop offset="1" stop-color="#5B54F0"/>
    </linearGradient></defs>
    <rect width="32" height="32" rx="9" fill="url(#g)"/>
    <g fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 11.5 L14.8 16 L10 20.5"/><path d="M17.6 20.8 H23"/>
    </g>
  </svg>`);
  fs.writeFileSync(path.join(OUT, 'favicon.svg'), markSvg);
  await sharp(markSvg).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'));
  await sharp(markSvg).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));

  // Content pages.
  for (const [page, render] of [
    [DOCS,      () => buildDocs(DOCS)],
    [CHANGELOG, () => buildChangelog(CHANGELOG, PRODUCTS[0])],
    [ABOUT,     () => buildAbout(ABOUT)],
  ]) {
    const dir = path.join(OUT, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), externalize(render()), 'utf8');
    console.log(`${page.slug}/index.html`.padEnd(34), (fs.statSync(path.join(dir, 'index.html')).size / 1024).toFixed(0), 'KB');
  }

  fs.writeFileSync(path.join(OUT, 'index.html'), externalize(buildHome()), 'utf8');
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

  // A 404 page, a sitemap and a robots file - the plumbing a real site has.
  fs.writeFileSync(path.join(OUT, '404.html'), externalize(build404()), 'utf8');

  const urls = [
    '/',
    ...PRODUCTS.map(p => `/${p.slug}/`),
    ...[DOCS, CHANGELOG, ABOUT].map(g => `/${g.slug}/`),
  ];
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap, 'utf8');

  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

  console.log('404.html, sitemap.xml (' + urls.length + ' urls), robots.txt');

  console.log('index.html'.padEnd(34), (fs.statSync(path.join(OUT, 'index.html')).size / 1024).toFixed(0), 'KB');
  console.log('products  ', PRODUCTS.length);
})();
