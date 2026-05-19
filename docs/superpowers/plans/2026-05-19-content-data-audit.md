# Content & Data Audit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document everything the site currently consumes from the client's Shopify database, exhaustively catalogue every hardcoded placeholder / TODO marker in the codebase, and provide the engineering work needed to wire in each piece of client-supplied content once received.

**Architecture:** Two-layer content model. Layer 1 = Shopify Storefront API (products, variants, collections, inventory, images, prices) — queried via `src/lib/shopify.ts`. Layer 2 = static front-end config (`src/lib/menuConfig.ts` for the 9-category nav + subcategories with bilingual labels, slogans, banner imagery, supplier-logo strips, and `src/lib/productData.ts` for per-product extended data: brand, sizing guide, PDFs, certificates, specifications, info icons, FAQs, additionalContent blocks, video embeds). Layer 1 is the client's CMS; Layer 2 is content the client must hand us as text/PDF/image files so we can commit them.

**Tech Stack:** Astro 5.3 static site, `@shopify/storefront-api-client`, GraphQL queries, TypeScript config modules, vanilla JS for client-side behaviour.

**Source of truth for env / store identity:**
- `SHOPIFY_STORE = orthohouse-connecta.myshopify.com`
- `SHOPIFY_API_VERSION = 2025-10`
- `STOREFRONT_TOKEN` (public, in `.env`)
- `SHOPIFY_PRIVATE_TOKEN` (server-only, in `.env`)

---

## LIST 1 — Everything we currently consume from Shopify

Every field below is pulled live (and 5-day cached on disk in `.shopify-cache/`). Authority lives in the client's Shopify Admin.

### 1.1 Per-product fields (the heart of the catalogue)

Used wherever a product is rendered — collection cards, product detail, search, cart, related carousel, home page tiles. Source: `PRODUCT_QUERY`, `PRODUCTS_QUERY`, `COLLECTION_PRODUCTS_PAGINATED`, `OVERLAY_PRODUCTS_QUERY`, `COLLECTION_PREVIEW_QUERY` in `src/lib/shopify.ts`.

| Shopify field | Where used | Notes |
| --- | --- | --- |
| `product.id` | Internal — Shopify GID for variant/cart calls | |
| `product.title` | Product page H1, all card titles, breadcrumb leaf, cart line | UPPERCASE strings come straight from Shopify — client controls casing |
| `product.handle` | URL slug (e.g. `/products/prs630`), Recently-Viewed entries, `getStaticPaths()` build target | If a handle changes in Shopify, the live URL changes |
| `product.description` | Plain-text fallback used on card hover & short-desc clamp | |
| `product.descriptionHtml` | Product detail "Description" tab — full rich HTML body | We strip injected `<script>` tags as a safety measure |
| `product.tags` (only in `ALL_PRODUCTS_PAGINATED`) | Future-use for search facets — not yet rendered | |
| `product.priceRange.minVariantPrice.amount` | Card price label | |
| `product.priceRange.minVariantPrice.currencyCode` | Currency prefix (`EUR`) | |
| `product.featuredImage.url` | Card thumbnail, search overlay, recently-viewed | |
| `product.featuredImage.altText` | `<img alt>` for accessibility / SEO | |
| `product.images.nodes[].url` (up to 10) | Product detail gallery main + thumbnails + lightbox srcs | |
| `product.images.nodes[].altText` | Gallery image alt | |
| `product.availableForSale` | Product card stock pill (in/out) — added per Remarks §9 | |
| `product.collections.nodes[].handle` (first 10) | Breadcrumb path resolution + quote-only detection (Sensory Rooms / Stair Lifts) | We now fetch first 10 so the NAV match works |
| `product.collections.nodes[].title` | Related-products section subtitle fallback | |
| `product.variants.nodes[].id` | `data-variant-id` on Add-to-Cart button — Shopify cart line input | |
| `product.variants.nodes[].title` | Variant selector dropdown label (e.g. "Size M") | |
| `product.variants.nodes[].sku` | "Product code" line on detail page | |
| `product.variants.nodes[].availableForSale` | Disables variant option + Add-to-Cart button | |
| `product.variants.nodes[].price.amount` | Per-variant price after selector change | |
| `product.variants.nodes[].price.currencyCode` | Currency prefix | |
| `product.variants.nodes[].compareAtPrice.amount` | Strikethrough "was" price when on sale | |
| `product.variants.nodes[].selectedOptions[]` (in `ALL_PRODUCTS_PAGINATED` only) | Future search facets | |

### 1.2 Per-collection fields

Used by `/collections/<handle>` pages and the category landing system. Source: `COLLECTIONS_QUERY`, `COLLECTION_PRODUCTS_PAGINATED`.

| Shopify field | Where used | Notes |
| --- | --- | --- |
| `collection.id` | Internal cache key | |
| `collection.title` | Collection page H1 fallback (when not in `NAV_CATEGORIES`) | The nav title from `menuConfig.ts` overrides this for top-level pages |
| `collection.handle` | URL slug + lookups | |
| `collection.description` | Subcategory page body description; widget-junk regex strips garbage strings | |
| `collection.image.url` | NOT currently rendered on category pages (we use `menuConfig.banner.image` instead) | Available — could be wired in if client prefers Shopify-driven banner |
| `collection.image.altText` | Same — unused | |
| `collection.products.nodes[]` | Card grid on `/collections/<handle>` (paginated, all pages combined) | |

### 1.3 Cart (Shopify Cart API at runtime — `public/cart.js`)

| Field | Use |
| --- | --- |
| `cart.id` | LocalStorage-persisted cart token |
| `cart.lines.edges[].node.id` | Quantity/remove line operations |
| `cart.lines.edges[].node.quantity` | Quantity display on `/cart` |
| `cart.lines.edges[].node.merchandise.id` | Variant GID |
| `cart.lines.edges[].node.merchandise.title` | Variant title on cart line |
| `cart.lines.edges[].node.merchandise.image.url` + `.altText` | Cart line thumbnail |
| `cart.lines.edges[].node.merchandise.price.amount/currencyCode` | Cart line price |
| `cart.lines.edges[].node.merchandise.product.title` | Cart line product name |
| `cart.cost.subtotalAmount.amount/currencyCode` | Cart subtotal footer |
| `cart.checkoutUrl` | "Checkout" button destination → Shopify-hosted checkout |

### 1.4 Build-time-only Shopify data

Things we resolve at build (not at runtime), cached for 5 days:
- The list of all product handles (drives `/products/[handle]` static path generation — currently ~54 products in `.shopify-cache/`).
- The list of all collection handles (drives `/collections/[handle]`).
- A 9-product preview per body-dot subcategory on the home page (`head`, `cervical`, `shoulder`, `thoracic`, `elbow`, `upper-limb`, `wrist-thumb-supports`, `hand`, `fingers`, `lumbar`, `trunk-lumbar-supports`, `hip`, `thigh`, `lower-limb`, `knee`, `knee-braces`, `calf`, `ankle`, `foot`, `orthopedic-insoles`).

### 1.5 What we DON'T pull from Shopify (would-be useful if available)

These are render-time decisions where Shopify *could* be authoritative but currently isn't:
- `product.metafields.*` — not queried. If the client wants to drive sizing guides, brand, certificates, brochures from Shopify metafields instead of our static `productData.ts`, that's a one-day refactor (see Task 9 below).
- `collection.metafields.*` — same. Would let the client edit category-page banner image / slogan / supplier-logo list from Shopify Admin.
- Customer accounts / login / order history — not implemented.
- Reviews / ratings — not implemented.
- Inventory quantity (`totalInventory`, `quantityAvailable`) — only the boolean `availableForSale` is fetched. If the client wants "Only 3 left" badges, we'd need this field.

---

## LIST 2 — Everything the client needs to supply

Each row is **one missing artefact**. Tasks below wire each one in once received. Mark each row 🟥 (not received) → 🟨 (in review) → 🟩 (committed) as the client delivers.

### 2.1 Top-of-tree: site-wide assets

| ID | Artefact | Current placeholder | Required format | Status |
| --- | --- | --- | --- | --- |
| **S1** | High-resolution OrthoHouse logo (replaces the legacy Shopify CDN bitmap) | `public/images/logo.png` (downloaded from existing site at 480px width as a stop-gap) and `logo@2x.png` (960px) | Transparent PNG, ≥ 960×240, plus an SVG if available | 🟥 |
| **S2** | Trust info-box copy revision for the home-page "Why Customers Trust Us" card | English + Greek paragraph — current text is generic | Two paragraphs (EN + EL), 60-120 words each, plus optional new heading | 🟥 |
| **S3** | Hero banner image (the photograph behind the hero tagline) | `public/hero-1200.webp` / `hero-768.webp` / `hero-480.webp` | Single source PNG/JPG ≥ 2400px wide; we produce the three responsive WebPs | 🟨 (current image is acceptable but client should approve) |

### 2.2 Nav bar / category structure — Shopify handles

These 9 top-level categories are **hardcoded in `src/lib/menuConfig.ts`**. Each has a `handle` that must map to a real Shopify collection so `/collections/<handle>` returns products. Markers in the code: `// TODO(shopify)`.

| ID | Top-level menu item (EN / EL) | Hardcoded handle in code | Shopify status | Action client must take |
| --- | --- | --- | --- | --- |
| **N1** | Health & Medical Devices / Ιατρικές Συσκευές Υγείας | `health-medical-devices` | 🟥 collection does not exist | Create collection in Shopify Admin with this exact handle, OR tell us the existing one to point to |
| **N2** | Kybun Shoes & Mats / Παπούτσια & Τάπητες Kybun | `kybun-shoes` | 🟩 exists | — |
| **N3** | Orthopaedics / Ορθοπεδικά | `orthopedic-braces-supports` | 🟩 exists | — |
| **N4** | Home Care & Daily Living / Φροντίδα στο Σπίτι & Καθημερινή Ζωή | `home-care-daily-living` | 🟥 | Create or remap |
| **N5** | Health & Comfort / Υγεία & Άνεση | `health-comfort` | 🟥 | Create or remap (could reuse existing `exercise-and-well-being`) |
| **N6** | Sensory Rooms / Αισθητηριακά Δωμάτια | `sensory-rooms` | 🟥 | Create — quote-only collection (see §2.6) |
| **N7** | Lifting Solutions / Λύσεις Ανύψωσης | `lifting-solutions` | 🟥 | Create |
| **N8** | Walking Aids / Βοηθήματα Βάδισης | `walking-aids` | 🟩 exists | — |
| **N9** | Wheelchairs / Αναπηρικά Αμαξίδια | `wheelchairs` | 🟥 | Create or remap (could reuse `wheelchairs-and-home-care-aids`) |

### 2.3 Nav bar / category structure — subcategory Shopify handles

Each top-level has children rendered in the mega-menu **and** the Browse-by-Category grid on category pages. Same `// TODO(shopify)` markers in code. Children whose handle doesn't exist in Shopify will render their tile but the `/collections/<handle>` page will show an empty grid.

| Parent | Child label (EN / EL) | Hardcoded handle | Shopify status |
| --- | --- | --- | --- |
| Health & Medical Devices | Winix - Air Purifiers / Winix - Καθαριστές Αέρα | `purifiers` | 🟨 verify |
| Health & Medical Devices | Oxygen / Οξυγόνο | `oxygen` | 🟥 |
| Health & Medical Devices | LifeVac - Antichocking Device / LifeVac - Συσκευή Αντιμετώπισης Πνιγμού | `lifevac` | 🟥 |
| Kybun | Men's Shoes / Ανδρικά Παπούτσια | `kybun-mens-shoes` | 🟥 |
| Kybun | Women's Shoes / Γυναικεία Παπούτσια | `kybun-womens-shoes` | 🟥 |
| Kybun | Mats / Τάπητες | `kybun-mats` | 🟥 |
| Orthopaedics | Neck / Αυχένας | `cervical` | 🟩 |
| Orthopaedics | Back & Lumbar / Πλάτη & Οσφύς | `back-lumbar` | 🟨 consolidate (also `lumbar`/`trunk-lumbar-supports` exist) |
| Orthopaedics | Knee / Γόνατο | `knee` | 🟩 |
| Orthopaedics | Hip / Ισχίο | `hip` | 🟩 |
| Orthopaedics | Wrist & Thumb / Καρπός & Αντίχειρας | `wrist-thumb-supports` | 🟩 |
| Orthopaedics | Ankle / Αστράγαλος | `ankle` | 🟩 |
| Orthopaedics | Elbow / Αγκώνας | `elbow` | 🟩 |
| Orthopaedics | Hand / Χέρι | `hand` | 🟩 |
| Orthopaedics | Head / Κεφάλι | `head` | 🟩 |
| Home Care | Hospital Beds / Νοσοκομειακά Κρεβάτια | `hospital-beds` | 🟨 verify |
| Home Care | Bathroom / Μπάνιο | `bathroom-aids` | 🟨 verify |
| Home Care | Toilet Aids / Βοηθήματα Τουαλέτας | `toilets-aids` | 🟨 verify |
| Home Care | Decubitus Prevention / Πρόληψη Κατακλίσεων | `decubitus-aids` | 🟨 verify |
| Health & Comfort | Pillows & Cushions / Μαξιλάρια & Καθίσματα | `pillows-and-cushions` | 🟨 verify |
| Health & Comfort | Exercise Equipment / Εξοπλισμός Άσκησης | `exercise-equipment` | 🟥 |
| Health & Comfort | Massage Equipment / Εξοπλισμός Μασάζ | `massage-equipment` | 🟥 |
| Health & Comfort | Hot & Cold Therapy / Θεραπεία Ζεστού & Κρύου | `hot-cold-therapy` | 🟨 verify |
| Sensory Rooms | Products / Προϊόντα | `sensory-rooms-products` | 🟥 |
| Sensory Rooms | Complete Solutions / Ολοκληρωμένες Λύσεις | `sensory-rooms-solutions` | 🟥 |
| Lifting Solutions | Orthostats / Ορθοστάτες | `orthostats` | 🟥 |
| Lifting Solutions | Patient Lifting Hoists / Γερανοί Ανύψωσης Ασθενών | `patient-lifters-hoists` | 🟨 verify |
| Lifting Solutions | Stair Lifts by Lehner / Ανελκυστήρες Σκάλας Lehner | `stair-lifts-lehner` | 🟥 quote-only |
| Lifting Solutions | Lifting Platforms by Lehner / Πλατφόρμες Ανύψωσης Lehner | `lifting-platforms-lehner` | 🟥 |
| Walking Aids | Rollators & Walkers / Περιπατητήρες & Rollators | `rollators` | 🟩 |
| Walking Aids | Crutches / Πατερίτσες | `crutches` | 🟩 |
| Walking Aids | Canes & Walking Sticks / Μπαστούνια & Βακτηρίες | `canes` | 🟩 |
| Wheelchairs | Manual Wheelchairs / Χειροκίνητα Αναπηρικά Αμαξίδια | `manual-wheelchairs` | 🟨 verify |
| Wheelchairs | Electric Wheelchairs / Ηλεκτρικά Αναπηρικά Αμαξίδια | `wheelchairs-1` | 🟨 verify |

### 2.4 Category page banner content (the "white empty banner" the client mentioned)

For every top-level category page (e.g. `/collections/orthopedic-braces-supports`), the banner shows: **title**, **slogan**, **accent colour**, and a **background photograph**. All four currently come from `src/lib/menuConfig.ts` → `NAV_CATEGORIES[].banner` and `.slogan` / `.sloganEl`. The titles already exist; the slogans and banner images are first-draft placeholders.

| ID | Top-level category | Current EN slogan | Current EL slogan | Banner image path | Accent | Client must supply |
| --- | --- | --- | --- | --- | --- | --- |
| **B1** | Health & Medical Devices | "Trusted devices for home" | "Αξιόπιστες συσκευές για το σπίτι" | `/images/categories/health-medical-devices.webp` | `#0f766e` | Final slogan EN+EL, banner photograph (≥ 1600×500) |
| **B2** | Kybun Shoes & Mats | "Walk on air, all day" | "Περπατήστε στον αέρα, όλη μέρα" | `/images/categories/kybun-shoes.webp` | `#334155` | Approve or replace slogan & banner |
| **B3** | Orthopaedics | "Support, relief, recovery" | "Στήριξη, ανακούφιση, αποκατάσταση" | `/images/categories/orthopedics.webp` | `#1e3a5f` | Approve or replace |
| **B4** | Home Care & Daily Living | "Independence at home" | "Ανεξαρτησία στο σπίτι" | `/images/categories/home-care.webp` | `#7c3aed` | Approve or replace |
| **B5** | Health & Comfort | "Rest, recover, feel better" | "Ξεκούραση, αποκατάσταση, ευεξία" | `/images/categories/health-comfort.webp` | `#0369a1` | Approve or replace |
| **B6** | Sensory Rooms | "Calming spaces, tailored therapy" | "Χώροι ηρεμίας, εξατομικευμένη θεραπεία" | `/images/categories/sensory-rooms.webp` | `#be185d` | Approve or replace |
| **B7** | Lifting Solutions | "Safe transfers, accessible homes" | "Ασφαλείς μεταφορές, προσβάσιμα σπίτια" | `/images/categories/lifting-solutions.webp` | `#b45309` | Approve or replace |
| **B8** | Walking Aids | "Confident steps, every day" | "Σίγουρα βήματα, κάθε μέρα" | `/images/categories/walking-aids.webp` | `#047857` | Approve or replace |
| **B9** | Wheelchairs | "Mobility without compromise" | "Κινητικότητα χωρίς συμβιβασμούς" | `/images/categories/wheelchairs.webp` | `#374151` | Approve or replace |

Banner image spec — recommend: ≥ 1600×500 px, JPG/PNG, brand-consistent photograph or styled stock; we transcode to WebP. Accent colour drives the gradient overlay when no image is present, and the supplier-strip background tint.

### 2.5 Manufacturer / supplier logos (the strip on each top-level category page)

The white horizontal strip on every category page under the banner shows supplier logos. SVG files are placeholders generated from text — most are not the manufacturer's official mark. Markers in code: `// TODO(content)`.

| ID | Supplier | Path (placeholder SVG exists at) | Used on category | Status |
| --- | --- | --- | --- | --- |
| **L1** | Winix | `public/images/suppliers/winix.svg` | Health & Medical Devices | 🟥 official SVG/PNG |
| **L2** | LifeVac | `public/images/suppliers/lifevac.svg` | Health & Medical Devices | 🟥 |
| **L3** | Kybun | `public/images/suppliers/kybun.svg` | Kybun Shoes & Mats | 🟨 may be correct — confirm |
| **L4** | Bauerfeind | `public/images/suppliers/bauerfeind.svg` | Orthopaedics | 🟥 |
| **L5** | DonJoy | `public/images/suppliers/donjoy.svg` | Orthopaedics | 🟥 |
| **L6** | Sponaplast | `public/images/suppliers/sponaplast.svg` | Orthopaedics + Walking Aids | 🟨 confirm |
| **L7** | Invacare | `public/images/suppliers/invacare.svg` | Home Care + Wheelchairs | 🟥 |
| **L8** | Etac | `public/images/suppliers/etac.svg` | Home Care | 🟥 |
| **L9** | Medisana | `public/images/suppliers/medisana.svg` | Health & Comfort | 🟥 |
| **L10** | Beurer | `public/images/suppliers/beurer.svg` | Health & Comfort | 🟥 |
| **L11** | Rompa | `public/images/suppliers/rompa.svg` | Sensory Rooms | 🟥 |
| **L12** | Lehner | `public/images/suppliers/lehner.svg` | Lifting Solutions | 🟨 confirm |
| **L13** | Molift | `public/images/suppliers/molift.svg` | Lifting Solutions | 🟥 |
| **L14** | FDI | `public/images/suppliers/fdi.svg` | Walking Aids | 🟨 confirm |
| **L15** | AliMed | `public/images/suppliers/alimed.svg` | Walking Aids | 🟨 confirm |
| **L16** | Permobil | `public/images/suppliers/permobil.svg` | Wheelchairs | 🟥 |
| **L17** | Ottobock | `public/images/suppliers/ottobock.svg` | Wheelchairs | 🟥 |

Logo spec: SVG preferred (vector, scales to retina). PNG with transparency at ≥ 240px wide as fallback. Also accept the supplier's brand-website URL — we already support clickable logos via the `href` field on `SupplierLogo`.

### 2.6 Sensory Rooms & Stair Lifts — quote-only catalogue

Already wired: these collections render "Contact us for free consultation and quotation" instead of price (per Remarks §5). The work that remains is **content** — Shopify needs:

- Sensory-room **products** (handles inside `sensory-rooms-products`) — each with title, EN/EL description, photographs (high-resolution since they trigger the lightbox per Remarks §15).
- Sensory-room **complete-solution** entries (handles inside `sensory-rooms-solutions`) — same shape.
- Stair-lift **products** (handles inside `stair-lifts-lehner`) — each with title, EN/EL description, photographs.

For each: the client doesn't need to set a price (we hide it), but the product must exist in Shopify or the `/products/<handle>` page won't render.

### 2.7 Per-product extended data (richer-than-Shopify content)

`src/lib/productData.ts` holds 7 optional content slots per product. Currently filled for only **3 products** (`kfm2003a`, `sp14029`, `the158`) and all PDFs in those entries point to the same `placeholder.pdf`. Every other product's detail page renders only what Shopify provides (title, description HTML, gallery, price, variant selector) — none of the value-add sections.

For each product the client wants enhanced, supply any subset of:

| Field | Format | Example | Currently filled for |
| --- | --- | --- | --- |
| `brand` | `{ name: string, logoUrl: string }` — drop logo file in `public/product-assets/brands/<slug>.svg` | `{ name: "Kybun", logoUrl: "/product-assets/brands/kybun.svg" }` | 3 products |
| `sizingGuideHtml` | HTML string — measurement instructions + size table | See `kfm2003a` for a full example | 2 products (`kfm2003a`, `sp14029`) |
| `financialAssistancePdfUrl` | PDF — eligibility info for GeSY / social insurance | `/product-assets/documents/financial-assistance-knee.pdf` | 2 products (placeholder) |
| `certificateLogos[]` | Array of `{ label, imageUrl, pdfUrl? }` — CE, ISO, Swiss Made, etc. | `[{label:"CE Certified", imageUrl:"/product-assets/certificates/ce-mark.svg", pdfUrl:"/product-assets/documents/ce-cert-kfm2003a.pdf"}]` | 3 products |
| `woltDeliveryPdfUrl` | PDF — describing the Wolt-delivery process for this SKU | `/product-assets/documents/wolt-delivery.pdf` | 2 products (placeholder) |
| `specifications[]` | Array of `{ label: string, value: string }` — rendered as a spec table | `[{label:"Material", value:"Neoprene"}, ...]` | 3 products |
| `infoIcons[]` | Array of `{ iconUrl: string, label: string }` — feature pills | `[{iconUrl:"/product-assets/icons/breathable.svg", label:"Breathable"}]` | 3 products |
| `documents[]` | Array of `{ title, type, url }` — multi-file downloads tab | `[{title:"User Manual", type:"pdf", url:"/product-assets/documents/manual-kfm2003a.pdf"}]` | 3 products (placeholder) |
| `videoUrl` | YouTube embed URL (must be the `/embed/` form) | `"https://www.youtube.com/embed/Wjy3o0XOIUQ"` | 3 products (2 use the Rickroll placeholder!) |
| `additionalContent[]` | Long-form prose blocks with optional image — rendered between tabs and FAQs | See `kfm2003a` for HTML | 3 products |
| `faqs[]` | Array of `{ question, answer }` strings — accordion section | 4 example FAQs on each demo product | 3 products |
| `breadcrumbs` | Optional manual override `[{label, href}]` for products that don't fit the auto-resolution | Rarely needed since the auto-builder works | 0 products |

**PDFs currently pointing at `placeholder.pdf`** — every link needs to be replaced with a real document:

- `kfm2003a`: financial assistance, CE certificate, Swiss Made certificate, Wolt delivery, Product Brochure, Shoe Size Guide, Care Instructions, CE Declaration of Conformity (8 PDFs)
- `sp14029`: financial assistance, CE certificate, Wolt delivery, Product Brochure, CE Certificate, User Manual (6 PDFs)
- `the158`: CE certificate, Product Catalogue, CE Certificate, User Manual (4 PDFs)

**YouTube embed URLs** currently hardcoded:
- `kfm2003a` → `https://www.youtube.com/embed/Wjy3o0XOIUQ` (placeholder)
- `sp14029` → `https://www.youtube.com/embed/dQw4w9WgXcQ` (Rickroll — **needs replacing**)
- `the158` → `https://www.youtube.com/embed/dQw4w9WgXcQ` (Rickroll — **needs replacing**)

**Brand records** currently set:
- Kybun (`/product-assets/brands/kybun.svg`) — likely correct
- "Orthohouse" listed as the brand for `sp14029` (`/product-assets/brands/orthohouse.svg`) — confirm with client whether the SKU is own-brand or another manufacturer
- "Mobiak" listed as the brand for `the158` but pointing to the OrthoHouse logo — supply the real `mobiak.svg`

### 2.8 Certificate / icon library (additive — only when client introduces a new badge)

Files currently present in `public/product-assets/certificates/`: `ce-mark.svg`, `swiss-made.svg`. Add any new certification SVGs here (ISO 13485, MDR, FDA, etc.) when the client introduces a product that needs them.

Files currently present in `public/product-assets/icons/`: `breathable.svg`, `shock-absorbing.svg`, `lightweight.svg`, `washable.svg`, `ergonomic.svg`, `swiss-made.svg`, `silicone.svg`, `stabilizer.svg`, `adjustable.svg`, `latex-free.svg`. Add new feature icons here (sweat-wicking, anti-bacterial, machine-washable, etc.) on demand.

---

## File Structure

| File | Role in this plan |
| --- | --- |
| `src/lib/menuConfig.ts` | Edit handle strings (List 2.2, 2.3), slogans (2.4), supplier `href` URLs (2.5) |
| `src/lib/productData.ts` | Add a record per enhanced product (2.7) |
| `public/images/logo.png`, `logo@2x.png` | Replace with high-res client logo (S1) |
| `public/images/categories/*.webp` | Replace banner photographs (2.4) |
| `public/images/suppliers/*.svg` | Replace placeholder supplier logos (2.5) |
| `public/product-assets/brands/*.svg` | Add per-manufacturer brand logos used on product detail badge cards (2.7) |
| `public/product-assets/documents/*.pdf` | Add per-product PDFs and the shared Wolt delivery PDF (2.7) |
| `public/product-assets/certificates/*.svg` | Add new certification badges (2.8) |
| `public/product-assets/icons/*.svg` | Add new feature icons (2.8) |
| `src/i18n/ui.ts` | Edit `home.trust.title` and `home.trust.body` once new copy arrives (S2) |
| `src/layouts/Layout.astro:103` | Remove `TODO(client-asset)` comment once real logo replaces the bitmap (S1) |
| `src/pages/index.astro:99` | Remove `TODO(client-copy)` comment after S2 is applied |
| **New** `docs/content-intake/<artefact-id>.md` (optional) | Per-artefact intake notes (e.g. "Supplier L4 received 2026-06-01, original .ai file in DropBox/…") |

---

## Task 1 — Update Shopify collection handles when client confirms slugs

**Why:** Until handles match Shopify, six of the nine top-level menu items lead to empty product grids.

**Files:**
- Modify: `src/lib/menuConfig.ts` (every line marked `// TODO(shopify)`)

- [ ] **Step 1: For each handle the client confirms (or remaps), edit `menuConfig.ts`.** Worked example — if the client confirms `home-care-daily-living` is the correct slug, remove the comment:

  ```typescript
  // Before:
  handle: "home-care-daily-living", // TODO(shopify)
  // After:
  handle: "home-care-daily-living",
  ```

  If the client remaps to an existing collection, change the handle. Example for Wheelchairs reusing `wheelchairs-and-home-care-aids`:

  ```typescript
  // Before:
  handle: "wheelchairs", // TODO(shopify) – or reuse "wheelchairs-and-home-care-aids"
  // After:
  handle: "wheelchairs-and-home-care-aids",
  ```

- [ ] **Step 2: Clear the build cache.** When handles change, the cached collection responses are stale.

  Run: `rm -rf .shopify-cache && npm run build`
  Expected: build completes; no "404"-style empty grids on confirmed categories.

- [ ] **Step 3: Smoke check.**

  Run: `npm run dev`, open `http://localhost:4321/collections/<handle>` for each newly-confirmed category. Expected: products appear under "Browse by category" tiles.

- [ ] **Step 4: Commit.**

  ```bash
  git add src/lib/menuConfig.ts
  git commit -m "chore(menu): map confirmed Shopify collection handles

  Removes TODO(shopify) markers for handles the client has now
  confirmed point to live Shopify collections."
  ```

---

## Task 2 — Replace the high-res logo (S1)

**Files:**
- Replace: `public/images/logo.png` (2×: `public/images/logo@2x.png`)

- [ ] **Step 1: Drop the client-supplied PNG into `public/images/logo.png`.** Also produce a `logo@2x.png` at exactly double the pixel dimensions. If the client provides an SVG, also save it as `public/images/logo.svg` and switch the `<img src>` to it (next step).

- [ ] **Step 2 (optional, if SVG supplied): Switch `Layout.astro` to use it.** Edit `src/layouts/Layout.astro:103`:

  Replace the existing `<img>` with:
  ```astro
  <img
    src="/images/logo.svg"
    alt="OrthoHouse Cyprus"
    class="nav-logo-img"
    width="480"
    height="120"
    fetchpriority="high"
    decoding="async"
  />
  ```
  And remove the `srcset` line.

- [ ] **Step 3: Remove the TODO comment.** Delete the line:

  `<!-- TODO(client-asset 2026-05-19): replace /images/logo.png with high-res file from client (Remarks 15-5-26.pdf §2) -->`

- [ ] **Step 4: Verify.** `npm run dev` → reload → DevTools Network shows logo loads from `/images/logo.png` (or `.svg`) at the expected size.

- [ ] **Step 5: Commit.**

  ```bash
  git add public/images/logo.png public/images/logo@2x.png public/images/logo.svg src/layouts/Layout.astro
  git commit -m "feat(brand): swap in client-supplied high-resolution logo"
  ```

---

## Task 3 — Apply the new trust info-box copy (S2)

**Files:**
- Modify: `src/i18n/ui.ts` (`home.trust.title` + `home.trust.body` in both `en` and `el` blocks)
- Modify: `src/pages/index.astro:99` (remove TODO)

- [ ] **Step 1: Replace the title and body strings in `src/i18n/ui.ts`.** Both `en` and `el` sections.

  English block (around line 54-56):
  ```typescript
  "home.trust.title": "<NEW EN TITLE FROM CLIENT>",
  "home.trust.body": "<NEW EN BODY FROM CLIENT, 60-120 words>",
  ```

  Greek block (around line 170-172): mirror with EL copy.

- [ ] **Step 2: Remove the TODO comment** at `src/pages/index.astro:99`.

- [ ] **Step 3: Verify.** `npm run dev` → open `/` and `/el/` → confirm both languages show the new copy inside the white card.

- [ ] **Step 4: Commit.**

  ```bash
  git add src/i18n/ui.ts src/pages/index.astro
  git commit -m "content(home): apply client-revised trust info-box copy"
  ```

---

## Task 4 — Replace category banner photographs (B1-B9)

**Files:**
- Replace: each `public/images/categories/<name>.webp`

- [ ] **Step 1: For each banner the client supplies, convert to WebP.**

  Source (JPG/PNG) goes through `cwebp` or any image tool; target ≥ 1600×500, quality 80-85. Example:
  ```bash
  cwebp -q 82 -resize 1600 0 ~/Downloads/health-medical-devices.jpg \
    -o public/images/categories/health-medical-devices.webp
  ```

- [ ] **Step 2: Visual check.** `npm run dev`, visit `/collections/<handle>` for each replaced category. Confirm banner photograph displays at full bleed, title + slogan readable over the image.

- [ ] **Step 3: Commit one or more banners at a time.**

  ```bash
  git add public/images/categories/<name>.webp
  git commit -m "content(categories): refresh <name> banner photograph"
  ```

---

## Task 5 — Apply revised category slogans (B1-B9)

**Files:**
- Modify: `src/lib/menuConfig.ts` (`slogan` + `sloganEl` for each top-level)

- [ ] **Step 1: For each category, replace the strings in `menuConfig.ts`.** Example for Health & Medical Devices (lines 47-48):

  Replace:
  ```typescript
  slogan: "Trusted devices for home",
  sloganEl: "Αξιόπιστες συσκευές για το σπίτι",
  ```
  With the client-approved EN + EL strings.

- [ ] **Step 2: Verify side-by-side.** Visit `/collections/<handle>` and `/el/collections/<handle>` for each updated category — slogan appears under the title.

- [ ] **Step 3: Commit.**

  ```bash
  git add src/lib/menuConfig.ts
  git commit -m "content(categories): apply client-approved slogans (EN/EL)"
  ```

---

## Task 6 — Replace supplier logos (L1-L17)

**Files:**
- Replace: `public/images/suppliers/<name>.svg`

- [ ] **Step 1: For each supplier file the client delivers, overwrite the placeholder SVG.** Preserve the existing filename so `menuConfig.ts` references don't need to change. Example:

  ```bash
  cp ~/Downloads/bauerfeind-official.svg public/images/suppliers/bauerfeind.svg
  ```

  If the supplier asset is PNG only, save as `public/images/suppliers/<name>.png` AND update the `src` field in `menuConfig.ts`:

  ```typescript
  // Before:
  { src: "/images/suppliers/bauerfeind.svg", alt: "Bauerfeind" }, // TODO(content)
  // After:
  { src: "/images/suppliers/bauerfeind.png", alt: "Bauerfeind", href: "https://www.bauerfeind.com" },
  ```

  Adding the `href` (clickable logo → supplier website) is encouraged. The `SupplierLogo` type already accepts `href`.

- [ ] **Step 2: Remove the `// TODO(content)` comment for the file you just updated.**

- [ ] **Step 3: Verify.** Visit each category page that uses this supplier — confirm the logo renders crisply in the supplier strip.

- [ ] **Step 4: Commit (one supplier per commit or batch).**

  ```bash
  git add public/images/suppliers/<name>.* src/lib/menuConfig.ts
  git commit -m "content(suppliers): replace <name> placeholder logo with official asset"
  ```

---

## Task 7 — Add a new product's extended data (productData.ts entry)

Use this task as a template every time the client wants to add detail-page enrichment for one product. The product must already exist in Shopify (Shopify gives us title/description/price/images; this file adds the rest).

**Files:**
- Modify: `src/lib/productData.ts` (new key matching the product handle)
- Add (per product, as supplied): files under `public/product-assets/brands/`, `public/product-assets/documents/`, `public/product-assets/certificates/`, `public/product-assets/icons/`

- [ ] **Step 1: Drop all asset files for this product.** Example for product handle `kfm2003a`:
  - Brand logo → `public/product-assets/brands/kybun.svg`
  - Each PDF → `public/product-assets/documents/<descriptive-name>.pdf` (e.g. `kfm2003a-brochure.pdf`, `kfm2003a-care.pdf`, `kfm2003a-ce.pdf`, `kfm2003a-size-guide.pdf`)
  - Any certification SVG missing from `public/product-assets/certificates/` (rare — most exist)
  - Any feature-icon SVG missing from `public/product-assets/icons/` (rare)

- [ ] **Step 2: Add the record to `src/lib/productData.ts`.** Use the existing `kfm2003a` entry (lines 23-124) as the canonical template. Schema is fully typed by `ProductExtendedData` at the top of that file. Only include fields the client supplied — empty/missing fields are skipped at render time by the visibility flags (`hasSection2`, `hasSection3`).

  Example minimum entry (for a knee brace called `kb600`):
  ```typescript
  kb600: {
    brand: { name: "Bauerfeind", logoUrl: "/product-assets/brands/bauerfeind.svg" },
    sizingGuideHtml: `<h3>Measure your knee</h3><p>...</p><table>...</table>`,
    certificateLogos: [
      { label: "CE Certified", imageUrl: "/product-assets/certificates/ce-mark.svg",
        pdfUrl: "/product-assets/documents/kb600-ce-cert.pdf" },
    ],
    specifications: [
      { label: "Material", value: "Knit fabric with silicone pad" },
      { label: "Sizes Available", value: "S, M, L, XL" },
    ],
    documents: [
      { title: "Product Brochure", type: "pdf", url: "/product-assets/documents/kb600-brochure.pdf" },
      { title: "User Manual",     type: "pdf", url: "/product-assets/documents/kb600-manual.pdf" },
    ],
    videoUrl: "https://www.youtube.com/embed/<real-youtube-id>",
    faqs: [
      { question: "How tight should the brace feel?",
        answer: "Snug enough to stay in place during walking, but loose enough to fit a finger under the strap." },
    ],
  },
  ```

- [ ] **Step 3: Verify on the live product page.** `npm run dev`, visit `/products/kb600`. Section 2 (badge cards) renders any of: brand badge, sizing-guide button, financial-aid badge, certificate badges, Wolt-delivery badge. Section 3 (tabs) renders any of: Description / Specifications / Features / Downloads / Video / FAQs / More Info. Tabs only appear if their data is present.

- [ ] **Step 4: Replace any placeholder.pdf links the client has now substituted.**

  Run: `grep -n "placeholder.pdf" src/lib/productData.ts`
  Replace each placeholder path with the real file URL.

- [ ] **Step 5: Replace Rickroll YouTube URLs once real videos arrive.**

  Run: `grep -n "dQw4w9WgXcQ" src/lib/productData.ts`
  For each hit, replace with the client-supplied embed URL.

- [ ] **Step 6: Commit per product.**

  ```bash
  git add public/product-assets/ src/lib/productData.ts
  git commit -m "content(product:<handle>): add brand, sizing, certs, docs, video, FAQs"
  ```

---

## Task 8 — Add a new supplier or sub-category that doesn't exist yet in `menuConfig.ts`

Use this template when the client introduces a brand-new category or a new supplier strip entry that doesn't have a row in §2.3 or §2.5.

**Files:**
- Modify: `src/lib/menuConfig.ts`
- Add: `public/images/subcategories/<name>.svg` (subcategory icon) OR `public/images/suppliers/<name>.svg` (supplier logo)
- Add: `public/images/categories/<name>.webp` if it's a new top-level

- [ ] **Step 1: For a new top-level category**, append a new entry to `NAV_CATEGORIES` (or insert at the desired menu position):

  ```typescript
  {
    label: "Pediatrics",
    labelEl: "Παιδιατρικά",
    handle: "pediatrics",
    slogan: "Solutions designed for growing bodies",
    sloganEl: "Λύσεις για τα παιδιά",
    banner: {
      image: "/images/categories/pediatrics.webp",
      titlePosition: "bottom-left",
      accent: "#dc2626",
    },
    supplierLogos: [
      { src: "/images/suppliers/jumpscare.svg", alt: "Jumpscare", href: "https://example.com" },
    ],
    children: [
      { label: "Casts", labelEl: "Γυψοι",
        handle: "ped-casts",
        icon: "/images/subcategories/casts.svg",
        description: "Lightweight orthopaedic casts",
        descriptionEl: "Ελαφριοί ορθοπεδικοί γύψοι",
      },
    ],
  },
  ```

- [ ] **Step 2: For a new subcategory under an existing parent**, push into the parent's `children` array following the same shape.

- [ ] **Step 3: Drop the supporting assets.** New top-level: a banner WebP + a subcategory icon SVG per child + each supplier logo. New subcategory only: just an icon SVG.

- [ ] **Step 4: Verify.** `npm run dev` → the mega-menu shows the new item; `/collections/<handle>` renders the new page.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/lib/menuConfig.ts public/images/
  git commit -m "feat(menu): add <category> (<n> subcategories)"
  ```

---

## Task 9 (optional, ambitious refactor) — Move per-product extended data into Shopify metafields

This eliminates `src/lib/productData.ts` entirely and lets the client manage everything (PDFs, sizing guides, FAQs, video URLs, etc.) from Shopify Admin without touching the codebase. Only undertake if the client asks for it — until then `productData.ts` is the simplest path.

**Files:**
- Modify: `src/lib/shopify.ts` (extend `PRODUCT_QUERY` to fetch metafields)
- Modify: `src/lib/productData.ts` (replace lookup function with metafield-derived one)
- Modify: `src/pages/products/[handle].astro` (no change if the lookup function preserves the same return shape)

- [ ] **Step 1: Define a Shopify metafield definition list** matching the `ProductExtendedData` interface. Each field becomes a Shopify metafield with namespace `orthohouse` and key `brand`, `sizing_guide`, `financial_assistance_pdf`, etc.

- [ ] **Step 2: Extend `PRODUCT_QUERY` in `src/lib/shopify.ts`** to request metafields:

  ```graphql
  metafields(identifiers: [
    {namespace: "orthohouse", key: "brand"},
    {namespace: "orthohouse", key: "sizing_guide_html"},
    {namespace: "orthohouse", key: "financial_assistance_pdf"},
    {namespace: "orthohouse", key: "wolt_delivery_pdf"},
    {namespace: "orthohouse", key: "certificate_logos"},
    {namespace: "orthohouse", key: "specifications"},
    {namespace: "orthohouse", key: "info_icons"},
    {namespace: "orthohouse", key: "documents"},
    {namespace: "orthohouse", key: "video_url"},
    {namespace: "orthohouse", key: "additional_content"},
    {namespace: "orthohouse", key: "faqs"}
  ]) {
    namespace key value type
  }
  ```

- [ ] **Step 3: Rewrite `getProductExtendedData()`** in `src/lib/productData.ts` to parse the metafield values into the same `ProductExtendedData` shape (so `[handle].astro` keeps working unchanged). JSON-shaped metafields parse via `JSON.parse(value)`; HTML strings come through as-is.

- [ ] **Step 4: Migrate the 3 existing demo entries** (`kfm2003a`, `sp14029`, `the158`) into Shopify Admin once metafield definitions exist. Delete their hardcoded records from `productData.ts`.

- [ ] **Step 5: Verify.** `/products/kfm2003a` renders identically to today.

- [ ] **Step 6: Commit.**

  ```bash
  git add src/lib/shopify.ts src/lib/productData.ts src/pages/products/[handle].astro
  git commit -m "refactor(products): source extended data from Shopify metafields

  Eliminates static productData.ts records. Client now manages
  brand, sizing guide, certificates, PDFs, specs, video URLs,
  and FAQs entirely from Shopify Admin metafields under the
  'orthohouse' namespace."
  ```

---

## Final hand-off — keep the audit current

- [ ] **Step F1: After every batch of client deliverables, re-run the TODO grep and update LIST 2 status flags** (🟥 / 🟨 / 🟩) in this document.

  Run:
  ```bash
  grep -rnE "TODO\(shopify\)|TODO\(content\)|TODO\(client-" src/ public/ | grep -v node_modules
  ```

  Expected: the count drops as content arrives.

- [ ] **Step F2: Once all four marker classes are at zero, delete the placeholder PDF.**

  Run: `git rm public/product-assets/documents/placeholder.pdf` and confirm no remaining references with the grep in F1.

- [ ] **Step F3: Final commit closing the audit.**

  ```bash
  git commit -m "chore(content): close out content-intake audit — all client deliverables received"
  ```

---

## Self-Review

**1. Spec coverage:**
- ✅ List of what we use from Shopify → §1.1 – §1.5
- ✅ Nav-bar category titles → §2.2
- ✅ Category-page banner titles ("white empty banner") → §2.4 + §2.5
- ✅ Manufacturer logos → §2.5
- ✅ PDFs → §2.7 (per-product) + mention in §2.8 (certificates)
- ✅ YouTube links → §2.7 (`videoUrl` rows)
- ✅ "etc." → covered by §2.7 (sizing guides, brand logos, specs, infoIcons, FAQs, additionalContent), §2.6 (sensory/stair-lift content), §2.8 (certificate/icon library extensions)

**2. Placeholder scan:** No `TBD` / `implement later` style placeholders in the plan — every "client must supply" cell points at an exact file path or string slot. The `<NEW EN TITLE FROM CLIENT>` placeholders in Task 3 are intentional — they are the *content* being received, not implementation gaps.

**3. Type consistency:** Field names (`sizingGuideHtml`, `certificateLogos`, `videoUrl`, etc.) match `ProductExtendedData` in `src/lib/productData.ts:1-19` verbatim. Supplier-strip records match the `SupplierLogo` type at `src/lib/menuConfig.ts:9-13`. NAV records match `NavCategory` at `menuConfig.ts:24-37`.
