# Fix PDP Parser Error + Shopify Auth/Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the Vite parser error on the product detail page, replace the broken custom Storefront-customer auth pages with redirects to Shopify-hosted accounts, and verify the anonymous Storefront cart flow still works end-to-end.

**Architecture:** The store runs on `SHOPIFY_API_VERSION=2025-10`. Shopify removed the legacy Storefront customer mutations (`customerAccessTokenCreate`, `customerCreate`, `customerRecover`, etc.) in API version 2024-10, which is why login/register/recover/profile/addresses all error today. Rather than rewrite against the new Customer Account API (OAuth + SSR backend), we redirect every `/account/*` page to Shopify's hosted account UI at `https://{shop}.myshopify.com/account/*`. The customer logs in there; their session cookie attaches automatically to checkout when they click "Checkout" from our anonymous Storefront cart. The cart itself uses Storefront API cart mutations (still supported on 2025-10) and stays anonymous client-side — no `customerAccessToken` plumbing is needed.

**Tech Stack:** Astro 5 (static), Shopify Storefront API 2025-10 (cart only), vanilla JS in `public/cart.js`, no backend.

---

## File Structure

**Modified:**
- `src/pages/products/[handle].astro` — fix Vite parser error (root cause TBD by Task 1 diagnostic step; most likely a stale `.vite` cache, otherwise a quoting/markup bug to locate)
- `src/pages/account/login.astro` — replace body with redirect to `${shop}/account/login`
- `src/pages/account/register.astro` — redirect to `${shop}/account/register`
- `src/pages/account/recover.astro` — redirect to `${shop}/account/login#recover`
- `src/pages/account/reset.astro` — redirect to `${shop}/account/login`
- `src/pages/account/activate.astro` — redirect to `${shop}/account/login`
- `src/pages/account/index.astro` — redirect to `${shop}/account`
- `src/pages/account/orders.astro` — redirect to `${shop}/account` (Shopify shows orders on the account home)
- `src/pages/account/profile.astro` — redirect to `${shop}/account`
- `src/pages/account/addresses.astro` — redirect to `${shop}/account/addresses`
- `src/pages/account/logout.astro` — redirect to `${shop}/account/logout`
- `src/layouts/Layout.astro` — remove `<script src="/account.js" defer>` reference and the `top-profile-dot` indicator script (no client-side customer session to read anymore)

**Deleted:**
- `public/account.js` — entirely dead once redirects are in place
- `src/components/AccountLayout.astro` — no custom account pages reference it anymore

**Unchanged but verified:**
- `public/cart.js` — anonymous Storefront cart works as-is on 2025-10
- `src/pages/cart.astro` — consumer of `window.Cart` / `window.__cart`

---

## Task 1: Diagnose & Fix PDP Parser Error

**Files:**
- Modify (only if diagnostic step shows a source bug): `src/pages/products/[handle].astro`

The dev-server output reported:
```
✘ [ERROR] Expected ">" but found "title"
script:/.../src/pages/products/[handle].astro?id=0:105:2:
  105 │   title={product.title}
```
The `?id=0` references the first inline script Astro extracted; line/col reference the *compiled* output, not source. The source file uses `title={product.title}` only inside the `<Layout ...>` opening tag at line 134, which is valid Astro syntax. The most likely cause is a stale Vite dependency-scan cache from before recent edits — same symptom Vite has shown when a `.astro` file is edited while dev server is running. Confirm-or-rule-out cache first; if the error persists after a clean restart, search the file for malformed markup.

- [ ] **Step 1: Kill any running dev server**

Run:
```bash
pkill -f "astro dev" || true
```
Expected: no error; if no astro process was running, the `|| true` swallows the non-zero exit.

- [ ] **Step 2: Clear Vite + Astro caches**

Run:
```bash
rm -rf node_modules/.vite node_modules/.astro .astro
```
Expected: silent (or "No such file" — fine).

- [ ] **Step 3: Restart dev server, capture output**

Run:
```bash
npm run dev > /tmp/astro-dev.log 2>&1 &
sleep 8
cat /tmp/astro-dev.log
```
Expected SUCCESS output: `astro v5.17.1 ready in NNN ms` and `Local http://localhost:NNNN/` with **no** `Failed to scan for dependencies` error.

- [ ] **Step 4: If error is gone — verify a product page renders**

Run:
```bash
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-dev.log | head -1 | grep -oE '[0-9]+$')
curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/products/$(ls .shopify-cache 2>/dev/null | head -1 >/dev/null; echo demo-product)"
# OR pick a real handle from src/pages/products — fetch any built path
curl -sI "http://localhost:${PORT}/" | head -1
```
Expected: `HTTP/1.1 200 OK` from the homepage call. If the cache-clear fixed the scan error, mark this task complete and skip Steps 5–7.

- [ ] **Step 5: If the scan error persists — locate the real source line**

Run:
```bash
grep -nE '<[A-Z][A-Za-z]*$|={[^}]*$|<[a-z][^>]*$' src/pages/products/\[handle\].astro | head -40
```
Expected: prints any line where a tag opens but doesn't close on the same line — a typical cause is an unterminated attribute expression or a `>` consumed by an expression. Note the first suspicious line number.

- [ ] **Step 6: Read 30 lines around the suspicious line and fix the markup**

Use the Read tool with `offset = <suspicious-line> - 5, limit = 30` on `src/pages/products/[handle].astro`. Look specifically for:
- An attribute expression that contains an unescaped `<` or `>` character (e.g., `class={n > 0 ? "x" : "y"}` — fine in Astro, but a stray `<` in JS would break it)
- A tag whose opening `<TagName` line ends mid-attribute without a closing `>` on a later line, AND where one of the attribute values is wrapped in `{...}` containing braces that confuse the parser
- Whitespace-only artifacts (BOM, non-breaking space) before `title=`

Fix with the Edit tool. Do not refactor — minimum patch only.

- [ ] **Step 7: Re-verify by re-running Steps 1–4**

Expected: dev server starts cleanly with no `Failed to scan for dependencies` error AND homepage returns 200.

- [ ] **Step 8: Mark Task 1 complete in TaskUpdate**

---

## Task 2: Build the Account-Redirect Page Template

Each `/account/*` page becomes a tiny static page that issues a client + meta-refresh redirect to the corresponding Shopify-hosted URL. Because Astro is in static-output mode, `Astro.redirect()` would emit a usable page, but for a cleaner UX (no flash of "Redirecting…" template), we hand-write the markup. The template imports `SHOPIFY_STORE` from `src/lib/shopify.ts` (already exported via `shopifyConfig`) so the destination is built into the static HTML at build time.

**Files:**
- Modify: `src/pages/account/login.astro` (replace whole file)

- [ ] **Step 1: Confirm the env helper exposes the shop domain**

Run:
```bash
grep -n "store:" src/lib/shopify.ts
```
Expected: `store: import.meta.env.SHOPIFY_STORE,` (already exported in `shopifyConfig`). If the value contains the full host (e.g. `orthohousecy.myshopify.com`), proceed. If it's missing the `.myshopify.com` suffix, the redirect URLs in subsequent steps must append it; verify by reading line 11 of `src/lib/shopify.ts` and the value in `.env`.

- [ ] **Step 2: Replace `src/pages/account/login.astro` with redirect**

Overwrite the entire file with:

```astro
---
import { shopifyConfig } from "../../lib/shopify";

const dest = `https://${shopifyConfig.store}/account/login`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content={`0;url=${dest}`} />
    <link rel="canonical" href={dest} />
    <title>Redirecting…</title>
  </head>
  <body>
    <script is:inline set:html={`window.location.replace(${JSON.stringify(dest)});`}></script>
    <noscript>
      <p>Redirecting to <a href={dest}>{dest}</a>…</p>
    </noscript>
  </body>
</html>
```

- [ ] **Step 3: Verify by visiting the page in a browser**

Run:
```bash
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-dev.log | head -1 | grep -oE '[0-9]+$')
curl -sL "http://localhost:${PORT}/account/login" | grep -E 'http-equiv|location\.replace'
```
Expected: both `meta http-equiv="refresh"` line and `location.replace("https://...myshopify.com/account/login")` line are present.

- [ ] **Step 4: Commit this checkpoint before scaling to other pages**

```bash
git add src/pages/account/login.astro
git commit -m "feat(account): redirect login to Shopify-hosted account"
```

---

## Task 3: Apply the Redirect Template to All Other Account Pages

Apply the same template to each remaining file. The only thing that changes per file is the `dest` URL.

**Destination map** (use these exact paths):

| Source file | `dest` path on shop |
|---|---|
| `src/pages/account/register.astro` | `/account/register` |
| `src/pages/account/recover.astro` | `/account/login#recover` |
| `src/pages/account/reset.astro` | `/account/login` |
| `src/pages/account/activate.astro` | `/account/login` |
| `src/pages/account/index.astro` | `/account` |
| `src/pages/account/orders.astro` | `/account` |
| `src/pages/account/profile.astro` | `/account` |
| `src/pages/account/addresses.astro` | `/account/addresses` |
| `src/pages/account/logout.astro` | `/account/logout` |

- [ ] **Step 1: Replace `src/pages/account/register.astro`**

```astro
---
import { shopifyConfig } from "../../lib/shopify";
const dest = `https://${shopifyConfig.store}/account/register`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content={`0;url=${dest}`} />
    <link rel="canonical" href={dest} />
    <title>Redirecting…</title>
  </head>
  <body>
    <script is:inline set:html={`window.location.replace(${JSON.stringify(dest)});`}></script>
    <noscript><p>Redirecting to <a href={dest}>{dest}</a>…</p></noscript>
  </body>
</html>
```

- [ ] **Step 2: Replace `src/pages/account/recover.astro`**

Same template as Step 1, with: `const dest = \`https://${shopifyConfig.store}/account/login#recover\`;`

- [ ] **Step 3: Replace `src/pages/account/reset.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account/login\`;`

- [ ] **Step 4: Replace `src/pages/account/activate.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account/login\`;`

- [ ] **Step 5: Replace `src/pages/account/index.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account\`;`

- [ ] **Step 6: Replace `src/pages/account/orders.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account\`;`

- [ ] **Step 7: Replace `src/pages/account/profile.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account\`;`

- [ ] **Step 8: Replace `src/pages/account/addresses.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account/addresses\`;`

- [ ] **Step 9: Replace `src/pages/account/logout.astro`**

Same template, with: `const dest = \`https://${shopifyConfig.store}/account/logout\`;`

- [ ] **Step 10: Verify each redirect renders correctly**

Run:
```bash
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-dev.log | head -1 | grep -oE '[0-9]+$')
for p in register recover reset activate "" orders profile addresses logout; do
  url="http://localhost:${PORT}/account/${p}"
  echo "== $url =="
  curl -sL "$url" | grep -E 'location\.replace|http-equiv' | head -2
done
```
Expected: each page prints both the `meta http-equiv="refresh"` and `location.replace("https://...myshopify.com/account/...")` lines pointing at the correct destination.

- [ ] **Step 11: Commit**

```bash
git add src/pages/account/
git commit -m "feat(account): redirect all account pages to Shopify-hosted account"
```

---

## Task 4: Remove Dead Customer Auth Code

With every `/account/*` page now a thin redirect, nothing references `AccountLayout`, `public/account.js`, or the top-bar profile dot indicator.

**Files:**
- Delete: `src/components/AccountLayout.astro`
- Delete: `public/account.js`
- Modify: `src/layouts/Layout.astro` — remove the `<script src="/account.js" defer>` tag and the `top-profile-dot` IIFE script

- [ ] **Step 1: Confirm no remaining references to AccountLayout**

Run:
```bash
grep -rn "AccountLayout" src/ 2>/dev/null
```
Expected: only matches inside the file `src/components/AccountLayout.astro` itself (which we're about to delete). If any `src/pages/...` still imports it, Task 3 missed a file — go back and fix.

- [ ] **Step 2: Delete `src/components/AccountLayout.astro`**

```bash
git rm src/components/AccountLayout.astro
```

- [ ] **Step 3: Confirm no remaining references to /account.js**

Run:
```bash
grep -rn 'account\.js\|window\.Customer\|sf_customer_token' src/ public/ 2>/dev/null
```
Expected: only matches inside `public/account.js` itself, the `top-profile-dot` script in `src/layouts/Layout.astro` (which we patch in Step 5), and possibly the `Customer Account API` comment block. If `src/pages/cart.astro` references `window.Customer`, leave a note and stop — that means cart depended on the customer linker.

- [ ] **Step 4: Delete `public/account.js`**

```bash
git rm public/account.js
```

- [ ] **Step 5: Patch `src/layouts/Layout.astro` — remove account.js script tag**

Read `src/layouts/Layout.astro` around line 596 to confirm the exact text:
```bash
grep -n 'account.js' src/layouts/Layout.astro
```
Expected: `597:    <script src="/account.js" defer></script>` (or similar one-line tag).

Use the Edit tool to delete that single line:
- old_string: `    <script src="/account.js" defer></script>\n`
- new_string: (empty)

- [ ] **Step 6: Patch `src/layouts/Layout.astro` — remove the profile dot indicator**

Use the Edit tool to remove the IIFE block at lines ~600-613 (the `applyIndicator` script that reads `sf_customer_token`). Read those lines first to get the exact whitespace, then replace with empty string. The block to delete is bounded by:
- Start: `      (function () {` immediately above `function applyIndicator()` (look for the `top-profile-dot` reference inside)
- End: the matching `})();` followed by `    </script>` if the IIFE is inside its own `<script>` element; otherwise just the IIFE inside an existing block — keep the surrounding `<script>` tags intact only if other code shares them.

After editing, run:
```bash
grep -n 'top-profile-dot\|sf_customer_token' src/layouts/Layout.astro
```
Expected: zero matches.

- [ ] **Step 7: Remove the markup for `#top-profile-dot` from Layout.astro**

Run:
```bash
grep -n 'top-profile-dot' src/layouts/Layout.astro
```
Expected: matches the dot `<span>` element in the top-bar profile area. Use the Edit tool to remove that single `<span id="top-profile-dot" ...></span>` element (a single line). If the file no longer contains the indicator markup after Step 6, this step is a no-op.

- [ ] **Step 8: Restart dev server and verify cart page still loads**

Run:
```bash
pkill -f "astro dev" || true
rm -rf node_modules/.vite
npm run dev > /tmp/astro-dev.log 2>&1 &
sleep 8
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-dev.log | head -1 | grep -oE '[0-9]+$')
curl -sI "http://localhost:${PORT}/cart" | head -1
curl -sI "http://localhost:${PORT}/" | head -1
```
Expected: both return `HTTP/1.1 200 OK`; no errors in `/tmp/astro-dev.log`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore(account): remove dead Storefront customer code"
```

---

## Task 5: Verify Cart End-to-End

The cart code in `public/cart.js` calls only Storefront API cart mutations (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cart` query) which remain supported on API version 2025-10. This task is a manual smoke test — no code changes expected unless a step fails.

**Files:**
- Read-only verify: `public/cart.js`, `src/pages/cart.astro`

- [ ] **Step 1: Open the homepage in a real browser**

Run:
```bash
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-dev.log | head -1 | grep -oE '[0-9]+$')
echo "Open http://localhost:${PORT}/ in a browser. Open DevTools → Console + Network tabs."
```
Expected (browser): page renders without console errors. Network tab shows no failed Storefront GraphQL requests (any 4xx/5xx to `/api/2025-10/graphql.json` is a red flag).

- [ ] **Step 2: Add an item to cart via PDP**

In the browser, navigate to a product detail page (e.g., the first `/products/<handle>` link from the homepage) and click the Add-to-Cart button.

Expected: the cart badge increments; no console errors; Network tab shows one POST to `/api/2025-10/graphql.json` containing `cartLinesAdd` returning HTTP 200 with `data.cartLinesAdd.cart.id` populated.

- [ ] **Step 3: Open `/cart` and verify it renders the added line**

In the browser, navigate to `/cart`.
Expected: the added product appears with image, title, variant, price, qty controls (+/-), and a Remove button. Subtotal matches `qty × price`.

- [ ] **Step 4: Test qty increment, decrement, and remove**

Click `+` twice on the line, then `-` once, then `Remove`.

Expected: after each click, the displayed qty updates immediately (optimistic UI) and a debounced `cartLinesUpdate` (or `cartLinesRemove`) fires ~250 ms after the last click. Remove takes the line off the page. Cart goes empty after final Remove.

- [ ] **Step 5: Test checkout button**

Add an item again, then click Checkout on `/cart`.

Expected: browser navigates to a `https://{shop}.myshopify.com/cart/c/...` checkout URL. (Do NOT complete the checkout — just confirm the redirect.)

- [ ] **Step 6: If any step failed, capture the failing GraphQL error and fix**

If Step 2 returns errors like `Field 'X' doesn't exist`, the CART_FIELDS fragment in `public/cart.js:15-39` has a schema drift. Read the field name from the error, check the 2025-10 Storefront API docs, patch the fragment, and re-test from Step 1.

If the failure is `Cart not found` or `Invalid cart ID`, the persisted `sf_cart_id` is stale — clear `localStorage.sf_cart_id` in DevTools and retry. The code already auto-creates a fresh cart in `createFresh()` (`public/cart.js:158`), so this should self-heal.

- [ ] **Step 7: Mark task complete**

If no fixes were needed, this task ends without a commit. If a `cart.js` patch was required, commit it:
```bash
git add public/cart.js
git commit -m "fix(cart): align CART_FIELDS fragment with 2025-10 Storefront schema"
```

---

## Task 6: Production Build + Final Verification

- [ ] **Step 1: Stop dev server**

```bash
pkill -f "astro dev" || true
```

- [ ] **Step 2: Production build**

```bash
npm run build 2>&1 | tail -40
```
Expected: `Complete!` at the end; no `error` or `failed` lines in the tail.

- [ ] **Step 3: Preview the built site**

```bash
npm run preview > /tmp/astro-preview.log 2>&1 &
sleep 5
PORT=$(grep -oE 'http://localhost:[0-9]+' /tmp/astro-preview.log | head -1 | grep -oE '[0-9]+$')
echo "Open http://localhost:${PORT}/ in browser"
```

- [ ] **Step 4: Smoke test the preview**

In the browser:
- Homepage → 200, no console errors
- A product page (e.g. `/products/<handle>`) → renders fully
- `/account/login` → immediately bounces to `https://{shop}.myshopify.com/account/login` (URL bar changes)
- `/cart` → 200, renders empty/loading state without console errors

Expected: all four pass. If any fail, stop, fix, and rebuild before continuing.

- [ ] **Step 5: Stop preview**

```bash
pkill -f "astro preview" || true
```

- [ ] **Step 6: Final git status and commit anything stray**

```bash
git status
```
Expected: working tree clean (everything was committed in Tasks 2, 3, and 4). If anything is uncommitted, review and commit with an appropriate message.

- [ ] **Step 7: Push**

```bash
git push origin main
```
Expected: `main → main` updates without rejection.

---

## Notes for the executing engineer

- **Why no automated tests?** This repo has no existing test setup. Adding one is out of scope for a fix. The verification steps are manual browser smoke tests because that's the only signal available.
- **Why redirect instead of using Customer Account API?** The user explicitly chose the redirect strategy (recorded in the brainstorm). Customer Account API requires Astro SSR mode + OAuth callback routes + secret handling — a major refactor.
- **Cart-customer linking happens automatically at checkout.** When a user clicks the Checkout button, the URL goes to `checkout.{shop}`. Shopify's domain-level session cookie detects the logged-in customer (if they previously logged in via the hosted account flow in the same browser) and attaches them to the order. No client-side token plumbing needed.
- **The `noscript` fallback in redirect pages matters for SEO crawlers.** The `<link rel="canonical">` tells crawlers the canonical URL is the destination, preventing duplicate-content penalties.
