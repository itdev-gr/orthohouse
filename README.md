# OrthoHouse Cyprus

Static Astro storefront powered by the Shopify Storefront API, deployed to a Hetzner VM via a self-hosted GitHub Actions runner.

## Local Development

```bash
cp .env.example .env   # fill in token values
npm install
npm run dev             # http://localhost:4321
```

## Architecture

- **Framework:** Astro 5 (static output)
- **Data:** Shopify Storefront API via `@shopify/storefront-api-client`
- **Hosting:** Hetzner Cloud VM (Ubuntu 24.04, `ubuntu-4gb-fsn1-2`)
- **Web server:** nginx serving static files from `/var/www/testortho`
- **SSL:** Cloudflare origin certificate (Full Strict mode) — Cloudflare proxy handles public TLS
- **CI/CD:** GitHub Actions self-hosted runner on the same VM

## Data Strategy

### Build-Time Cache

Every Shopify API call goes through a file-based cache in `.shopify-cache/`:

- **Key:** SHA-256 hash of `query + JSON(variables)`, truncated to 16 hex chars
- **Storage:** Each cache entry is a JSON file: `{ timestamp, data }`
- **TTL:** 5 days — if the file exists and is less than 5 days old, the cached data is returned without hitting Shopify
- **Per-page caching:** Paginated queries cache each cursor page independently (different `after` values produce different cache keys)

To clear the cache and force a fresh fetch on next build:

```bash
rm -rf .shopify-cache/
```

The `.shopify-cache/` directory is git-ignored and never deployed.

### Stale-While-Revalidate (SWR)

Static pages serve instantly from nginx (the "stale" part). A client-side script (`public/swr.js`) then revalidates in the background:

1. **Build time:** Each page embeds its query, variables, and build-time data in a `<script id="swr-data" type="application/json">` tag
2. **Page load:** `swr.js` reads the embedded JSON and fires the same GraphQL query to Shopify's Storefront API (using the public access token via CORS)
3. **Paginated queries:** The SWR script loops through cursor pages to collect all nodes, matching what the build did
4. **Comparison:** `JSON.stringify(buildData) === JSON.stringify(freshData)` — if identical, nothing happens
5. **Update:** If data differs, `#swr-target` innerHTML is replaced with freshly rendered HTML

This means visitors always see content immediately (build-time HTML), and if Shopify data has changed since the last build, the page seamlessly updates within a second or two.

### Queries

| Query | Purpose | Pagination |
|-------|---------|------------|
| `PRODUCTS_QUERY` | Homepage product grid | No (fixed `first`) |
| `PRODUCT_QUERY` | Single product detail page | No |
| `COLLECTIONS_QUERY` | All collections for nav + routing | No |
| `COLLECTION_PRODUCTS_QUERY` | Products in a collection | Yes (cursor-based) |

Pagination uses Shopify's standard `first`/`after` cursor pattern. The `paginate()` helper in `shopify.ts` loops until `hasNextPage` is false, collecting all `nodes`.

### Public Storefront Token

The Shopify Storefront API access token is a **public** token — it is designed to be used client-side (in storefronts, mobile apps, etc.). It only grants read access to published products, collections, and related data. It cannot modify store data, access admin features, or read private customer information. Embedding it in HTML for client-side SWR is the intended usage pattern.

```
BUILD TIME:
  Astro page → shopify.ts function → cached()
    → HIT:  read .shopify-cache/{hash}.json → return data
    → MISS: Storefront API → write cache → return data
  → Render HTML + embed data as JSON + include swr.js

RUNTIME (browser):
  1. nginx serves static HTML instantly
  2. swr.js reads embedded JSON (build-time data)
  3. Fetches same query from Shopify Storefront API (public token, CORS)
     - Paginated queries: loops through all cursor pages
  4. JSON.stringify comparison
  5. Different → re-render #swr-target innerHTML
     Same/error → do nothing (build-time content stays)
```

## DevOps Details

### Domain & SSL

| Detail | Value |
|--------|-------|
| Domain | `testortho.aloiz.ch` |
| DNS | Cloudflare (proxied) |
| Origin cert | `/etc/nginx/ssl/cloudflare-origin.pem` |
| Origin key | `/etc/nginx/ssl/cloudflare-origin.key` |
| nginx config | `/etc/nginx/sites-available/testortho` |
| Serving root | `/var/www/testortho` |

### Self-Hosted Runner

| Detail | Value |
|--------|-------|
| Runner name | `hetzner-deploy` |
| Runner user | `runner` (uid 1000) |
| Runner dir | `/root/actions-runner` |
| Service | `actions.runner.andreas16700-orthohousecy.hetzner-deploy` |
| Labels | `self-hosted, linux, x64, deploy` |

Manage the runner service:
```bash
sudo systemctl status actions.runner.andreas16700-orthohousecy.hetzner-deploy
sudo systemctl restart actions.runner.andreas16700-orthohousecy.hetzner-deploy
```

### Deploy Pipeline

Push to `main` triggers the workflow (`.github/workflows/deploy.yml`):

1. Checkout code on the self-hosted runner
2. `npm ci` — install dependencies
3. `npm run build` — Astro static build (fetches products from Shopify at build time)
4. `rsync --delete dist/ /var/www/testortho/` — sync built files to nginx root

### GitHub Secrets Required

Set these in **Settings → Secrets and variables → Actions** on the repo:

| Secret | Description |
|--------|-------------|
| `STOREFRONT_TOKEN` | Shopify Storefront API public access token |
| `SHOPIFY_STORE` | Store domain, e.g. `orthohouse-connecta.myshopify.com` |
| `SHOPIFY_API_VERSION` | API version, e.g. `2025-10` |
| `SHOPIFY_PRIVATE_TOKEN` | Shopify Admin API token (`shpat_…`) — keep secret |

### Server Software

| Package | Version |
|---------|---------|
| Node.js | 22 LTS |
| nginx | latest (Ubuntu 24.04 apt) |
| OS | Ubuntu 24.04.3 LTS |

### Useful Server Paths

```
/root/actions-runner/       # GH runner installation
/var/www/testortho/         # nginx document root (built site)
/etc/nginx/sites-available/ # nginx server blocks
/etc/nginx/ssl/             # Cloudflare origin cert + key
/etc/sudoers.d/runner       # runner sudo config
```
