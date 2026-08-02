# Site generator

Everything published at `arungdev.github.io` is generated from this folder.
The HTML at the repo root is build output — **edit the sources here, never the
generated pages**, or your changes are lost on the next build.

## Building

```bash
cd _build
npm install
node build.js
```

Output is written to the repo root: `index.html`, `assets/`, one folder per
product, and the content pages. The build clears exactly those paths first, so
`_build/`, `.git/`, `README.md` and `LICENSE` are left alone.

Then commit and push — GitHub Pages serves the repo root.

## What's here

| File | Holds |
|---|---|
| `data.js` | Site identity and the `PRODUCTS` array — one entry per product |
| `pages.js` | Long-form copy for the docs, changelog and about pages |
| `site.css` | The whole design system; copied to `assets/site.css` verbatim |
| `build.js` | Templates and the build itself |
| `screenshots/` | Source screenshots, WebP at 2400px wide |

## Adding a product

1. Drop its screenshots into `screenshots/` as WebP, 2400px wide, 16:10.
2. Append an entry to `PRODUCTS` in `data.js`. The shape is documented by the
   existing entry: `slug`, `name`, `tagline`, `summary`, `version`, `platform`,
   `repo`, `releases`, `cover`, `accent`, `highlights`, `downloads`,
   `requirements`, `sections`, `stack`.
3. Run the build. The home page card, the product page, the tour and the
   footer link all follow from that entry — no page is written by hand.

`cover` is the screenshot used for the home hero, the product card and the
social card. `accent` is the product's colour; the dark theme brightens it
automatically.

## Things worth knowing

- **Screenshot dimensions.** Plate images are emitted with `width="2400"
  height="1500"`. If you add screenshots at a different aspect ratio, update
  those attributes too, or the browser reserves the wrong space while loading.
- **External links.** `externalize()` rewrites every off-site `<a>` to open in a
  new tab with `rel="noopener noreferrer"`. It runs over the finished HTML, so
  links added to any template are covered automatically.
- **Fonts** come from Google Fonts. Self-host them under `assets/fonts/` if you
  would rather the site made no third-party requests.
- **`.nojekyll`** at the repo root tells Pages to serve files verbatim. It is
  what allows this `_build/` folder to keep its leading underscore without
  Jekyll ignoring it. Do not remove it unless you intend to use Jekyll.
