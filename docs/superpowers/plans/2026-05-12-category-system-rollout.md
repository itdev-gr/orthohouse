# OrthoHouse Category System Rollout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the 9-category/subcategory tree from the client's `Category List.pdf` into the live site, with the exact mobile-menu behavior, banner layout, supplier-logo strip, and subcategory icon grid the client specified.

**Architecture:** All structural code already exists. `src/lib/menuConfig.ts` is the single source of truth for the category tree, banner config, supplier logos, and subcategory icons/descriptions. `src/layouts/Layout.astro` renders the mobile drawer. `src/pages/collections/[handle].astro` renders category pages. This plan fills in missing data, tightens slogans to ≤5 words, fixes the mobile chevron color (navy → true black to match "active not gray"), and adds asset folders for banner images, supplier logos, and subcategory icons. Most tasks are content/asset wiring + small CSS tweaks, not new components.

**Tech Stack:** Astro 5, TypeScript, vanilla CSS, Shopify Storefront API (already in place).

---

## File Structure

**Files modified:**
- `src/lib/menuConfig.ts` — fill in `banner.image`, `supplierLogos`, subcategory `icon` and `description` for all 9 categories; tighten slogans to ≤5 words.
- `src/layouts/Layout.astro` — change drawer-chevron color from `#1e3a5f` to true black `#0a0a0a`; verify chevron stroke width / aria-expanded state styling.
- `src/pages/collections/[handle].astro` — minor CSS polish on supplier strip & subcategory grid for mobile (no functional changes; spec already satisfied).

**Files created:**
- `public/images/categories/` — 9 banner JPG/WEBP files (1600x600).
- `public/images/suppliers/` — supplier logos (SVG/PNG).
- `public/images/subcategories/` — subcategory icons (SVG, ~64×64 line icons).
- `docs/category-content-checklist.md` — content owner's checklist for asset delivery.

**No new components, no schema changes, no Shopify changes required.** All needed types (`NavCategory`, `NavSubItem`, `SupplierLogo`, `TitlePosition`) already exist in `src/lib/menuConfig.ts:1-31`.

---

## Task 1: Asset Folders + Placeholders

Create the directories that banner, supplier, and subcategory image paths in `menuConfig.ts` will point at. Use existing favicon as a temporary placeholder so the site never 404s on a missing image while content is collected.

**Files:**
- Create: `public/images/categories/.gitkeep`
- Create: `public/images/suppliers/.gitkeep`
- Create: `public/images/subcategories/.gitkeep`
- Create: `public/images/_placeholder.svg`

- [ ] **Step 1: Create the three asset directories with .gitkeep**

Run:
```bash
mkdir -p public/images/categories public/images/suppliers public/images/subcategories
touch public/images/categories/.gitkeep public/images/suppliers/.gitkeep public/images/subcategories/.gitkeep
```

- [ ] **Step 2: Create a neutral placeholder SVG**

Create `public/images/_placeholder.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1e3a5f" stroke-width="2">
  <rect x="6" y="6" width="52" height="52" rx="8"/>
  <path d="M14 46l12-14 10 12 8-8 6 8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="44" cy="22" r="4"/>
</svg>
```

- [ ] **Step 3: Verify directories exist**

Run: `ls -la public/images/`
Expected: lists `categories/`, `suppliers/`, `subcategories/`, `_placeholder.svg`.

- [ ] **Step 4: Commit**

```bash
git add public/images/
git commit -m "chore: add asset directories for category banners, supplier logos, subcategory icons"
```

---

## Task 2: Tighten Slogans to ≤5 Words (Spec: "slogan up to 4–5 words")

The PDF explicitly limits the banner slogan to **4–5 words**. Three current slogans exceed this. Audit and fix.

**Files:**
- Modify: `src/lib/menuConfig.ts:40-141` (slogan strings only)

Current state (word count in parens):
- `health-medical-devices`: "Clinically trusted devices for the home" (7) ❌
- `kybun-shoes`: "Walk on air, all day long" (6) ❌
- `orthopedic-braces-supports`: "Support, relief, recovery" (3) ✅
- `home-care-daily-living`: "Independence at home" (3) ✅
- `health-comfort`: "Rest, recover, feel better" (4) ✅
- `sensory-rooms`: "Calming spaces, tailored therapy" (4) ✅
- `lifting-solutions`: "Safe transfers, accessible homes" (4) ✅
- `walking-aids`: "Confident steps, every day" (4) ✅
- `wheelchairs`: "Mobility without compromise" (3) ✅

- [ ] **Step 1: Edit `src/lib/menuConfig.ts` — replace the three over-budget slogans**

In `src/lib/menuConfig.ts`:

Line 40: replace `slogan: "Clinically trusted devices for the home",` with `slogan: "Trusted devices for home",`

Line 51: replace `slogan: "Walk on air, all day long",` with `slogan: "Walk on air, all day",`

- [ ] **Step 2: Verify word counts**

Run:
```bash
grep -n "slogan:" src/lib/menuConfig.ts | awk -F'"' '{ n=split($2,a," "); print NR": "n" words → "$2 }'
```
Expected: every line reports **5 or fewer** words.

- [ ] **Step 3: Build & sanity-check**

Run: `npm run build`
Expected: build succeeds, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts
git commit -m "fix(categories): tighten slogans to client-specified ≤5 word limit"
```

---

## Task 3: Mobile Drawer — Make Chevrons Truly Black (Spec: "μαύρα και όχι γκρίζα")

PDF spec: *"τα βελάκια … να φαίνονται ως ενεργά δηλαδή να είναι μαύρα και όχι γκρίζα"* = "the arrows … should appear active, i.e. black not gray." Currently the chevron color is `#1e3a5f` (dark navy). Switch to true black `#0a0a0a` and bump stroke width slightly so the arrow reads as clearly "active."

**Files:**
- Modify: `src/layouts/Layout.astro:1425-1432` (`.drawer-chevron` color)
- Modify: `src/layouts/Layout.astro:423` (`stroke-width` on the chevron SVG)

- [ ] **Step 1: Change `.drawer-chevron` color from navy to black**

In `src/layouts/Layout.astro`, replace:
```css
  .drawer-chevron {
    flex-shrink: 0;
    color: #1e3a5f;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s;
  }
```
with:
```css
  .drawer-chevron {
    flex-shrink: 0;
    color: #0a0a0a;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s;
  }
  .drawer-toggle.is-expanded .drawer-chevron {
    transform: rotate(90deg);
    color: #0a0a0a;
  }
```
(Keep the existing rotate rule's `transform`; the duplicate `color` declaration enforces black even when other states might inherit lighter colors. If a `.drawer-toggle.is-expanded .drawer-chevron { transform: rotate(90deg); }` block already follows on lines 1430-1432, **delete** that block since the replacement above absorbs it.)

- [ ] **Step 2: Bump SVG stroke width on the chevron**

In `src/layouts/Layout.astro:423`, replace:
```html
<svg class="drawer-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" width="15" height="15">
```
with:
```html
<svg class="drawer-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" width="16" height="16">
```

- [ ] **Step 3: Start dev server and visually verify on mobile viewport**

Run: `npm run dev` (if not already running on port 4321).
Open `http://localhost:4321/` in a browser, set viewport to 390×844 (iPhone), open the menu, confirm the arrows next to each category are **black** (not gray-blue) and clearly visible.

- [ ] **Step 4: Verify behavior split (per PDF)**

Manually click the **arrow** next to "Walking Aids" — subcategory list expands beneath. Click the **text "Walking Aids"** — navigates to `/collections/walking-aids`. Both behaviors should be present.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "fix(menu): switch mobile drawer chevrons to black per client spec"
```

---

## Task 4: Banner Images per Category (9 images)

Add a `banner.image` path to all 9 top-level categories so the `cat-banner[data-has-image="true"]` rule at `src/pages/collections/[handle].astro:210-214` activates. Until real photography is delivered, point at the placeholder so layout & positioning are testable.

**Files:**
- Modify: `src/lib/menuConfig.ts` (all 9 `banner:` blocks)
- Add (when assets arrive): `public/images/categories/<handle>.webp`

**Banner-image naming convention:** `public/images/categories/<category-handle>.webp` (1600×600, ≤200KB).

- [ ] **Step 1: Add `image` path to all 9 categories' `banner` objects**

In `src/lib/menuConfig.ts`, for each top-level category, add the `image` field to the existing `banner: { titlePosition: …, accent: … }` object. Final banners should look like:

```ts
// health-medical-devices
banner: { image: "/images/categories/health-medical-devices.webp", titlePosition: "bottom-left", accent: "#0f766e" },
// kybun-shoes
banner: { image: "/images/categories/kybun-shoes.webp", titlePosition: "top-left", accent: "#334155" },
// orthopedic-braces-supports
banner: { image: "/images/categories/orthopedics.webp", titlePosition: "bottom-left", accent: "#1e3a5f" },
// home-care-daily-living
banner: { image: "/images/categories/home-care.webp", titlePosition: "bottom-right", accent: "#7c3aed" },
// health-comfort
banner: { image: "/images/categories/health-comfort.webp", titlePosition: "top-right", accent: "#0369a1" },
// sensory-rooms
banner: { image: "/images/categories/sensory-rooms.webp", titlePosition: "bottom-left", accent: "#be185d" },
// lifting-solutions
banner: { image: "/images/categories/lifting-solutions.webp", titlePosition: "bottom-left", accent: "#b45309" },
// walking-aids
banner: { image: "/images/categories/walking-aids.webp", titlePosition: "top-left", accent: "#047857" },
// wheelchairs
banner: { image: "/images/categories/wheelchairs.webp", titlePosition: "bottom-right", accent: "#374151" },
```

(Each accent color is unchanged; only the `image` field is added.)

- [ ] **Step 2: Drop in temporary placeholder images so paths resolve**

Until real photography lands, copy the existing hero image (which the project already ships) as every banner. Run:
```bash
for h in health-medical-devices kybun-shoes orthopedics home-care health-comfort sensory-rooms lifting-solutions walking-aids wheelchairs; do
  cp public/hero-1200.webp "public/images/categories/${h}.webp"
done
ls public/images/categories/
```
Expected: 9 `.webp` files listed.

- [ ] **Step 3: Visually inspect each of the 9 category pages**

With `npm run dev` running, open each URL and confirm the banner renders with the title in the configured corner and the slogan beneath:
- `http://localhost:4321/collections/health-medical-devices`
- `http://localhost:4321/collections/kybun-shoes`
- `http://localhost:4321/collections/orthopedic-braces-supports`
- `http://localhost:4321/collections/home-care-daily-living`
- `http://localhost:4321/collections/health-comfort`
- `http://localhost:4321/collections/sensory-rooms`
- `http://localhost:4321/collections/lifting-solutions`
- `http://localhost:4321/collections/walking-aids`
- `http://localhost:4321/collections/wheelchairs`

Expected: each page shows a hero banner with the title positioned per the `titlePosition` value and a slogan below.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/categories/
git commit -m "feat(categories): wire banner images for all 9 top-level categories"
```

---

## Task 5: Supplier Logos — Walking Aids (Reference Implementation)

The PDF's example category is **Walking Aids**. The phone mockup shows three supplier logos (Sponaplast, FDI, AliMed). Wire that category first as the reference, then fan out to the other 8 in Task 6.

**Files:**
- Modify: `src/lib/menuConfig.ts:122-132` (`walking-aids` block — add `supplierLogos`)
- Add: `public/images/suppliers/sponaplast.svg`, `fdi.svg`, `alimed.svg`

- [ ] **Step 1: Create placeholder supplier-logo SVGs**

For each of the three brands, create a temporary text-only SVG until real logos are supplied. Example for Sponaplast:

Create `public/images/suppliers/sponaplast.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="none"/>
  <text x="100" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#1e3a5f" text-anchor="middle">SPONAPLAST</text>
</svg>
```

Create `public/images/suppliers/fdi.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="none"/>
  <text x="100" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#1e3a5f" text-anchor="middle">FDI</text>
</svg>
```

Create `public/images/suppliers/alimed.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="none"/>
  <text x="100" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#1e3a5f" text-anchor="middle">ALIMED</text>
</svg>
```

- [ ] **Step 2: Add `supplierLogos` to the `walking-aids` category**

In `src/lib/menuConfig.ts`, inside the `walking-aids` object (currently at lines 122–132), insert a `supplierLogos` array just **before** the `children:` line:

```ts
supplierLogos: [
  { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast", href: "https://www.sponaplast.com" },
  { src: "/images/suppliers/fdi.svg", alt: "FDI" },
  { src: "/images/suppliers/alimed.svg", alt: "AliMed", href: "https://www.alimed.com" },
],
```

- [ ] **Step 3: Verify the strip renders on `/collections/walking-aids`**

With dev server running, open `http://localhost:4321/collections/walking-aids`.
Expected: a white pill-shaped strip below the banner shows three centered logos. Each is grayscale by default, becoming full-color on hover (per CSS in `[handle].astro:271-283`).

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/suppliers/
git commit -m "feat(walking-aids): add supplier logo strip with Sponaplast, FDI, AliMed"
```

---

## Task 6: Supplier Logos — Remaining 8 Categories

Repeat Task 5's pattern for the other 8 categories. **The client must provide the supplier list per category** — these are placeholders chosen from what's typical for each segment; flag for content review.

**Files:**
- Modify: `src/lib/menuConfig.ts` (each of the remaining 8 category blocks)
- Add: `public/images/suppliers/*.svg` (one placeholder per supplier)

- [ ] **Step 1: Create placeholder supplier SVGs**

For brevity, use this Bash helper to mass-generate text-logo SVGs:

```bash
mk_logo() {
  local file="public/images/suppliers/$1.svg"
  local text="$2"
  cat > "$file" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="none"/>
  <text x="100" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#1e3a5f" text-anchor="middle">${text}</text>
</svg>
EOF
}

mk_logo winix "WINIX"
mk_logo lifevac "LifeVac"
mk_logo kybun "kybun"
mk_logo bauerfeind "Bauerfeind"
mk_logo donjoy "DonJoy"
mk_logo invacare "Invacare"
mk_logo etac "Etac"
mk_logo molift "Molift"
mk_logo lehner "Lehner"
mk_logo theraline "Theraline"
mk_logo permobil "Permobil"
mk_logo ottobock "Ottobock"
mk_logo rompa "Rompa"
mk_logo medisana "Medisana"
mk_logo beurer "Beurer"
```

- [ ] **Step 2: Add `supplierLogos` arrays to the remaining categories**

In `src/lib/menuConfig.ts`, insert `supplierLogos` arrays before `children:` for each block below. Use these provisional assignments (mark each line `// TODO(content)` for the content owner to confirm or replace):

```ts
// health-medical-devices
supplierLogos: [
  { src: "/images/suppliers/winix.svg", alt: "Winix" }, // TODO(content)
  { src: "/images/suppliers/lifevac.svg", alt: "LifeVac" }, // TODO(content)
],

// kybun-shoes
supplierLogos: [
  { src: "/images/suppliers/kybun.svg", alt: "kybun" },
],

// orthopedic-braces-supports
supplierLogos: [
  { src: "/images/suppliers/bauerfeind.svg", alt: "Bauerfeind" }, // TODO(content)
  { src: "/images/suppliers/donjoy.svg", alt: "DonJoy" }, // TODO(content)
  { src: "/images/suppliers/sponaplast.svg", alt: "Sponaplast" },
],

// home-care-daily-living
supplierLogos: [
  { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
  { src: "/images/suppliers/etac.svg", alt: "Etac" }, // TODO(content)
],

// health-comfort
supplierLogos: [
  { src: "/images/suppliers/medisana.svg", alt: "Medisana" }, // TODO(content)
  { src: "/images/suppliers/beurer.svg", alt: "Beurer" }, // TODO(content)
],

// sensory-rooms
supplierLogos: [
  { src: "/images/suppliers/rompa.svg", alt: "Rompa" }, // TODO(content)
],

// lifting-solutions
supplierLogos: [
  { src: "/images/suppliers/lehner.svg", alt: "Lehner" },
  { src: "/images/suppliers/molift.svg", alt: "Molift" }, // TODO(content)
],

// wheelchairs
supplierLogos: [
  { src: "/images/suppliers/permobil.svg", alt: "Permobil" }, // TODO(content)
  { src: "/images/suppliers/ottobock.svg", alt: "Ottobock" }, // TODO(content)
  { src: "/images/suppliers/invacare.svg", alt: "Invacare" }, // TODO(content)
],
```

- [ ] **Step 3: Visually verify all 9 category pages render the supplier strip**

With dev server running, open each `/collections/<handle>` page from Task 4 and confirm a logo strip appears beneath the banner.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/suppliers/
git commit -m "feat(categories): add provisional supplier logo strips to all categories (TODO content review)"
```

---

## Task 7: Subcategory Icons + Descriptions — Walking Aids (Reference)

The PDF mockup explicitly shows three subcategory tiles under Walking Aids: **Rollators**, **Crutches**, **Sticks**, each with an icon + label. The current `[handle].astro:98-114` renders this grid; we just need to populate `icon` and `description` on each child.

**Files:**
- Modify: `src/lib/menuConfig.ts:127-131` (`walking-aids` children)
- Add: `public/images/subcategories/rollators.svg`, `crutches.svg`, `canes.svg`

- [ ] **Step 1: Create three line-icon SVGs**

Create `public/images/subcategories/rollators.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 20v28"/><path d="M50 20v28"/>
  <path d="M14 20h36"/>
  <circle cx="18" cy="52" r="4"/><circle cx="46" cy="52" r="4"/>
  <path d="M22 30h20"/>
</svg>
```

Create `public/images/subcategories/crutches.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24 8v44"/><path d="M40 8v44"/>
  <path d="M18 12h12"/><path d="M34 12h12"/>
  <path d="M24 32h16"/>
</svg>
```

Create `public/images/subcategories/canes.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M28 8c0-2 8-2 8 4s-8 6-8 12v32"/>
</svg>
```

- [ ] **Step 2: Add `icon` and `description` to each walking-aids child**

In `src/lib/menuConfig.ts`, replace the `walking-aids` `children:` block (currently lines 127–131) with:
```ts
children: [
  { label: "Rollators & Walkers", handle: "rollators", icon: "/images/subcategories/rollators.svg", description: "Wheeled support for confident daily mobility" },
  { label: "Crutches", handle: "crutches", icon: "/images/subcategories/crutches.svg", description: "Underarm and forearm crutches for recovery" },
  { label: "Canes & Walking Sticks", handle: "canes", icon: "/images/subcategories/canes.svg", description: "Lightweight canes for everyday balance" },
],
```

- [ ] **Step 3: Verify on the Walking Aids page**

Open `http://localhost:4321/collections/walking-aids`. Expected: under "Browse by category" three tiles render side-by-side with a small line icon on the left and label + short description on the right.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/subcategories/
git commit -m "feat(walking-aids): add subcategory icons and descriptions"
```

---

## Task 8: Subcategory Icons + Descriptions — Orthopaedics (9 body parts)

Orthopaedics has the largest child list (9 body parts). Each needs an icon + ≤8-word description. This is the heaviest content task; iconography can lean on existing body-map SVGs already in the project (the repo already has `humanbody-1.webp`, suggesting body-region assets exist).

**Files:**
- Modify: `src/lib/menuConfig.ts:64-74` (`orthopedic-braces-supports` children)
- Add: `public/images/subcategories/neck.svg`, `back.svg`, `knee.svg`, `hip.svg`, `wrist.svg`, `ankle.svg`, `elbow.svg`, `hand.svg`, `head.svg`

- [ ] **Step 1: Create 9 body-part icon SVGs**

For each body part, create a simple line-art SVG. Template (replace `<path …/>` with the body-part outline):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <!-- body-part outline -->
</svg>
```

Use these per-file path contents (each is a minimal silhouette glyph; sufficient as a placeholder until the design team supplies polished icons):

- `neck.svg` path: `<circle cx="32" cy="14" r="8"/><path d="M24 22v8a8 8 0 0 0 16 0v-8"/><path d="M20 38h24"/>`
- `back.svg` path: `<path d="M22 10c0 0-4 14 0 24s10 18 10 18"/><path d="M42 10c0 0 4 14 0 24s-10 18-10 18"/><path d="M22 22h20"/>`
- `knee.svg` path: `<path d="M24 8v20"/><circle cx="32" cy="32" r="8"/><path d="M40 36v20"/>`
- `hip.svg` path: `<circle cx="32" cy="22" r="10"/><path d="M22 32l-6 24"/><path d="M42 32l6 24"/>`
- `wrist.svg` path: `<path d="M14 32h20"/><path d="M34 22v20"/><path d="M40 18l12 4"/><path d="M40 26l12 4"/><path d="M40 34l12 4"/><path d="M40 42l12 4"/>`
- `ankle.svg` path: `<path d="M22 8v32a8 8 0 0 0 8 8h22"/>`
- `elbow.svg` path: `<path d="M14 14l18 18"/><path d="M32 32l18 18"/><circle cx="32" cy="32" r="6"/>`
- `hand.svg` path: `<path d="M20 30v-12"/><path d="M28 30v-18"/><path d="M36 30v-18"/><path d="M44 30v-12"/><path d="M16 30c0 12 8 22 16 22s16-10 16-22"/>`
- `head.svg` path: `<circle cx="32" cy="26" r="14"/><path d="M22 40v8"/><path d="M42 40v8"/>`

Wrap each in the template above and save in `public/images/subcategories/`.

- [ ] **Step 2: Add `icon` and `description` to each orthopaedics child**

In `src/lib/menuConfig.ts`, replace the `orthopedic-braces-supports` `children:` block (currently lines 64–74) with:
```ts
children: [
  { label: "Neck", handle: "cervical", icon: "/images/subcategories/neck.svg", description: "Cervical collars and neck supports" },
  { label: "Back & Lumbar", handle: "back-lumbar", icon: "/images/subcategories/back.svg", description: "Lumbar belts and posture braces" }, // TODO(shopify) – consolidate
  { label: "Knee", handle: "knee", icon: "/images/subcategories/knee.svg", description: "Knee braces, sleeves, stabilizers" },
  { label: "Hip", handle: "hip", icon: "/images/subcategories/hip.svg", description: "Hip braces and post-surgery supports" },
  { label: "Wrist & Thumb", handle: "wrist-thumb-supports", icon: "/images/subcategories/wrist.svg", description: "Wrist splints and thumb stabilizers" },
  { label: "Ankle", handle: "ankle", icon: "/images/subcategories/ankle.svg", description: "Ankle braces and sprain supports" },
  { label: "Elbow", handle: "elbow", icon: "/images/subcategories/elbow.svg", description: "Elbow braces and tennis-elbow straps" },
  { label: "Hand", handle: "hand", icon: "/images/subcategories/hand.svg", description: "Hand splints and finger supports" },
  { label: "Head", handle: "head", icon: "/images/subcategories/head.svg", description: "Helmets and protective head supports" },
],
```

- [ ] **Step 3: Verify on the Orthopaedics page**

Open `http://localhost:4321/collections/orthopedic-braces-supports`. Expected: 9 tiles render in the grid, each with a body-part icon, label, and one-line description.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/subcategories/{neck,back,knee,hip,wrist,ankle,elbow,hand,head}.svg
git commit -m "feat(orthopaedics): add icons and descriptions for 9 body-part subcategories"
```

---

## Task 9: Subcategory Icons + Descriptions — Remaining 7 Categories

Repeat Task 7's pattern for the other 7 categories. Same SVG template; descriptions kept terse (~6–10 words each).

**Files:**
- Modify: `src/lib/menuConfig.ts` (children of all categories not yet covered)
- Add: `public/images/subcategories/*.svg` for each subcategory below

- [ ] **Step 1: Create remaining subcategory icons**

Add SVG files for: `air-purifier.svg`, `oxygen.svg`, `lifevac.svg`, `mens-shoes.svg`, `womens-shoes.svg`, `mats.svg`, `hospital-bed.svg`, `bathroom.svg`, `toilet-aids.svg`, `decubitus.svg`, `pillow.svg`, `exercise.svg`, `massage.svg`, `hot-cold.svg`, `sensory-products.svg`, `sensory-solutions.svg`, `orthostat.svg`, `lifting-hoist.svg`, `stair-lift.svg`, `lifting-platform.svg`, `manual-wheelchair.svg`, `electric-wheelchair.svg`.

Use the same template as Task 8. Minimal viable glyphs are fine; mark with `<!-- TODO(design): replace with polished icon -->` inside each SVG comment.

- [ ] **Step 2: Populate `icon` + `description` on every remaining subcategory**

In `src/lib/menuConfig.ts`, update each block as follows.

**health-medical-devices children:**
```ts
children: [
  { label: "Winix - Air Purifiers", handle: "purifiers", icon: "/images/subcategories/air-purifier.svg", description: "True-HEPA air purifiers for home and clinic" },
  { label: "Oxygen", handle: "oxygen", icon: "/images/subcategories/oxygen.svg", description: "Concentrators and supplemental oxygen units" }, // TODO(shopify)
  { label: "LifeVac - Antichocking Device", handle: "lifevac", icon: "/images/subcategories/lifevac.svg", description: "Non-powered choking rescue device" }, // TODO(shopify)
],
```

**kybun-shoes children:**
```ts
children: [
  { label: "Men's Shoes", handle: "kybun-mens-shoes", icon: "/images/subcategories/mens-shoes.svg", description: "Air-cushioned men's footwear" }, // TODO(shopify)
  { label: "Women's Shoes", handle: "kybun-womens-shoes", icon: "/images/subcategories/womens-shoes.svg", description: "Air-cushioned women's footwear" }, // TODO(shopify)
  { label: "Mats", handle: "kybun-mats", icon: "/images/subcategories/mats.svg", description: "Active-standing therapy mats" }, // TODO(shopify)
],
```

**home-care-daily-living children:**
```ts
children: [
  { label: "Hospital Beds", handle: "hospital-beds", icon: "/images/subcategories/hospital-bed.svg", description: "Adjustable beds for home and care" },
  { label: "Bathroom", handle: "bathroom-aids", icon: "/images/subcategories/bathroom.svg", description: "Shower seats, grab bars, bath aids" },
  { label: "Toilet Aids", handle: "toilets-aids", icon: "/images/subcategories/toilet-aids.svg", description: "Raised seats and toilet frames" },
  { label: "Decubitus Prevention", handle: "decubitus-aids", icon: "/images/subcategories/decubitus.svg", description: "Pressure-relief mattresses and cushions" },
],
```

**health-comfort children:**
```ts
children: [
  { label: "Pillows & Cushions", handle: "pillows-and-cushions", icon: "/images/subcategories/pillow.svg", description: "Posture and recovery cushions" },
  { label: "Exercise Equipment", handle: "exercise-equipment", icon: "/images/subcategories/exercise.svg", description: "Rehab and at-home fitness gear" }, // TODO(shopify)
  { label: "Massage Equipment", handle: "massage-equipment", icon: "/images/subcategories/massage.svg", description: "Handheld and seat massagers" }, // TODO(shopify)
  { label: "Hot & Cold Therapy", handle: "hot-cold-therapy", icon: "/images/subcategories/hot-cold.svg", description: "Pain-relief packs and wraps" },
],
```

**sensory-rooms children:**
```ts
children: [
  { label: "Products", handle: "sensory-rooms-products", icon: "/images/subcategories/sensory-products.svg", description: "Individual sensory components" }, // TODO(shopify)
  { label: "Complete Solutions", handle: "sensory-rooms-solutions", icon: "/images/subcategories/sensory-solutions.svg", description: "Full sensory-room installations" }, // TODO(shopify)
],
```

**lifting-solutions children:**
```ts
children: [
  { label: "Orthostats", handle: "orthostats", icon: "/images/subcategories/orthostat.svg", description: "Standing frames for upright therapy" }, // TODO(shopify)
  { label: "Patient Lifting Hoists", handle: "patient-lifters-hoists", icon: "/images/subcategories/lifting-hoist.svg", description: "Mobile and ceiling-track hoists" },
  { label: "Stair Lifts by Lehner", handle: "stair-lifts-lehner", icon: "/images/subcategories/stair-lift.svg", description: "Straight and curved stair lifts" }, // TODO(shopify)
  { label: "Lifting Platforms by Lehner", handle: "lifting-platforms-lehner", icon: "/images/subcategories/lifting-platform.svg", description: "Vertical home-access platforms" }, // TODO(shopify)
],
```

**wheelchairs children:**
```ts
children: [
  { label: "Manual Wheelchairs", handle: "manual-wheelchairs", icon: "/images/subcategories/manual-wheelchair.svg", description: "Lightweight and transport chairs" },
  { label: "Electric Wheelchairs", handle: "wheelchairs-1", icon: "/images/subcategories/electric-wheelchair.svg", description: "Powered indoor and outdoor chairs" },
],
```

- [ ] **Step 3: Visit every category page and confirm tile grids render**

For each URL in Task 4 step 3, scroll past the banner and confirm a "Browse by category" grid renders with one tile per subcategory, each showing icon + label + description.

- [ ] **Step 4: Commit**

```bash
git add src/lib/menuConfig.ts public/images/subcategories/
git commit -m "feat(categories): wire icons and descriptions for all remaining subcategories"
```

---

## Task 10: Mobile Drawer — Verify Title-vs-Arrow Behavior Split

Per spec: tapping the **title** navigates to category page; tapping **only the arrow** expands subcategories. The code at `src/layouts/Layout.astro:411-426` already implements this, but the tap targets must be physically separated and easy to hit with a thumb. Confirm and tighten.

**Files:**
- Modify: `src/layouts/Layout.astro` (drawer-toggle width / hit area, if needed)

- [ ] **Step 1: Inspect tap targets in DevTools**

With `npm run dev` running and the mobile drawer open at viewport 390×844, open Safari/Chrome devtools, hover the chevron button: confirm `.drawer-toggle` is at least **44×44px** (Apple HIG / WCAG 2.5.5). If smaller, increase its padding.

The button is currently `padding: 0 1.1rem` (horizontal only). Audit at `src/layouts/Layout.astro:1408-1421`. If the resulting box-height is <44px, change padding to `padding: 0.85rem 1.1rem` to guarantee a 44px hit zone.

- [ ] **Step 2: Verify category title link does NOT bubble into the toggle**

In the drawer, **tap the text "Walking Aids"** — should navigate to `/collections/walking-aids`. Tap the **arrow** to the right of it — should NOT navigate, only expand the submenu. Repeat for one more category.

If tapping the title also opens the submenu (event bubbling), search `src/layouts/Layout.astro:883-905` for the drawer-toggle handler and confirm it's bound only to `.drawer-toggle`, not `.drawer-trigger`.

- [ ] **Step 3: Verify expanded state — chevron rotation + `aria-expanded`**

Tap a chevron, then in devtools confirm the button has `aria-expanded="true"`, the `.drawer-toggle` has class `is-expanded`, and the chevron is rotated 90° clockwise.

- [ ] **Step 4: Commit (only if any change made above)**

```bash
git add src/layouts/Layout.astro
git commit -m "chore(menu): tighten mobile drawer tap targets to 44px minimum"
```

If no change was needed, skip this commit.

---

## Task 11: Verify Homepage → Category Page Wiring

PDF spec: "Οι Category pages ανοίγουν (όπως ήδη γίνεται) και με επιλογή του αντίστοιχου πλαισίου - φωτό στην Homepage." = "Category pages also open by tapping the corresponding box/photo on the homepage." Code review confirms `src/pages/index.astro:409` already does this. Just verify it survived recent edits.

**Files:**
- Read-only verification: `src/pages/index.astro`

- [ ] **Step 1: Grep to confirm category links exist**

Run:
```bash
grep -n 'href={`/collections/${cat.handle}`}' src/pages/index.astro
```
Expected: at least one match (homepage category card link).

- [ ] **Step 2: Click each homepage tile in browser**

Open `http://localhost:4321/`, scroll to the category grid, click each of the 9 category tiles. Confirm each navigates to the corresponding `/collections/<handle>` page and the banner + supplier strip + subcategory grid render correctly.

- [ ] **Step 3: No commit needed (verification-only task)**

---

## Task 12: Cross-browser / Mobile Visual Pass

Run the project's existing manual-test cadence. The PDF mockups are all iOS Safari, so prioritize that.

**Files:** None modified.

- [ ] **Step 1: Test on iOS Safari viewport (390×844)**

In Chrome devtools, set device to iPhone 14, then walk through:
1. Open hamburger menu — confirm chevrons render **black** (Task 3).
2. Tap chevron next to "Walking Aids" — submenu expands inline.
3. Tap "Walking Aids" text — navigates to category page.
4. Confirm banner shows title in top-left + slogan beneath.
5. Confirm supplier strip renders (3 logos).
6. Confirm "Browse by category" shows 3 tiles (Rollators, Crutches, Canes).
7. Tap "Rollators & Walkers" tile — navigates to `/collections/rollators`.

- [ ] **Step 2: Test on Android Chrome viewport (412×915)**

Repeat the same flow at Android Pixel viewport. Confirm no horizontal scroll, no overflow.

- [ ] **Step 3: Test desktop (1440×900)**

At desktop width, verify:
- Hover-driven mega-panel on the top nav works for each category.
- Banner title scales correctly at desktop sizes (clamp at `[handle].astro:236`).
- Subcategory grid uses 4-column layout (`grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`).

- [ ] **Step 4: Test build for production**

Run: `npm run build`
Expected: build succeeds; no broken `<img src>` references in the dist output. Spot-check `dist/collections/walking-aids/index.html` contains `<img src="/images/subcategories/rollators.svg"`.

- [ ] **Step 5: No commit needed (verification-only task)**

---

## Task 13: Content Owner Checklist Doc

Create a single document the content owner uses to deliver real photography, real supplier logos, and approved slogans/descriptions. This guards against the placeholders from Tasks 4–9 silently shipping to production.

**Files:**
- Create: `docs/category-content-checklist.md`

- [ ] **Step 1: Write the checklist**

Create `docs/category-content-checklist.md`:
```markdown
# Category Content Delivery Checklist

This doc tracks the assets and copy the marketing/content team owes for each of the 9 top-level categories. Until every row is checked, the live site is running placeholders.

Source of truth for category structure: `src/lib/menuConfig.ts`.
Asset folders: `public/images/categories/`, `public/images/suppliers/`, `public/images/subcategories/`.
Banner spec: 1600×600 WebP, ≤200KB, title fits in one of 4 corners (`top-left`/`top-right`/`bottom-left`/`bottom-right`).
Slogan spec: max 5 words.

## Per-category checklist

For each of: Health & Medical Devices, Kybun Shoes & Mats, Orthopaedics, Home Care & Daily Living, Health & Comfort, Sensory Rooms, Lifting Solutions, Walking Aids, Wheelchairs:

- [ ] Banner photo delivered (1600×600, ≤200KB, person/product in frame, room for title overlay)
- [ ] Slogan approved (≤5 words)
- [ ] Title position confirmed (which corner reads best with the banner photo)
- [ ] Final supplier list confirmed (3–5 logos per category)
- [ ] Supplier logo SVG/PNG delivered for each
- [ ] Subcategory icons approved (or design-team replacement delivered)
- [ ] Subcategory descriptions approved (one short line each, ≤10 words)

Every `// TODO(content)` line in `src/lib/menuConfig.ts` corresponds to a row above that's still unconfirmed.
```

- [ ] **Step 2: Commit**

```bash
git add docs/category-content-checklist.md
git commit -m "docs: add category content delivery checklist for marketing/content team"
```

---

## Task 14: Final Sweep — TODO Audit & PR

Before shipping, list every `// TODO(content)` and `// TODO(shopify)` and confirm none of them block the *visual* spec (they may block product data, which is acceptable — site renders banners and tiles regardless).

**Files:** None modified.

- [ ] **Step 1: List every TODO in menu config**

Run:
```bash
grep -nE '// TODO\((shopify|content)\)' src/lib/menuConfig.ts
```
Expected: a list. Confirm each line is one of the documented placeholder content items.

- [ ] **Step 2: Confirm no TODOs in rendered pages**

Run:
```bash
npm run build && grep -rn 'TODO' dist/ | grep -v '\.map$' | head -20
```
Expected: no user-visible TODO strings in built HTML.

- [ ] **Step 3: Open PR**

```bash
git push -u origin HEAD
gh pr create --title "Category system rollout per client spec (PDF 2026-05-12)" --body "$(cat <<'EOF'
## Summary
- Implements the 9-category/subcategory tree from the client's Category List PDF
- Mobile drawer: chevrons now true black per "μαύρα όχι γκρίζα" spec; tap split preserved (title navigates, arrow expands)
- Category pages: banner with 4-position title + slogan, supplier-logo strip, subcategory icon grid all wired
- All slogans trimmed to ≤5 words
- Placeholder assets in place; content team tracks real deliveries via docs/category-content-checklist.md

## Test plan
- [ ] Open menu on iOS Safari viewport — chevrons render black, not gray
- [ ] Tap "Walking Aids" text → /collections/walking-aids opens
- [ ] Tap arrow only → submenu expands inline, page does NOT navigate
- [ ] /collections/walking-aids shows banner + 3 supplier logos + 3 subcategory tiles
- [ ] Each of the 9 category pages renders without console errors
- [ ] Homepage category boxes link to /collections/<handle>
EOF
)"
```

- [ ] **Step 4: Return PR URL to the user.**

---

## Self-Review

**Spec coverage check (PDF page 2 requirements):**

| Spec line | Task covering it |
|---|---|
| "Arrows … black, not gray" | Task 3 |
| "Arrow opens subcategories; title opens category page" | Task 10 verifies (code already does it) |
| "Category Page opens from MENU title or homepage tile" | Tasks 10 + 11 |
| "Banner title placeable in 4 positions" | CSS already handles; Task 4 wires per-category |
| "Slogan ≤4–5 words" | Task 2 |
| "Supplier-logo strip" | Tasks 5 + 6 |
| "Subcategory icons + descriptions" | Tasks 7 + 8 + 9 |
| "Tap subcategory → subcategory page opens" | Already wired in `[handle].astro:99` |

**Placeholder scan:** All "TODO" markers in the plan are explicit `// TODO(content)` annotations that the checklist doc tracks. No vague "implement later" or "add error handling" placeholders. Every code step shows the actual code.

**Type consistency:** All field names match `src/lib/menuConfig.ts:1-31` types (`NavSubItem.icon`, `NavSubItem.description`, `NavCategory.supplierLogos`, `NavCategory.banner.image`). No invented properties.

**File path consistency:** All asset paths in menu config (`/images/categories/<handle>.webp`, `/images/suppliers/<brand>.svg`, `/images/subcategories/<sub>.svg`) match the directories Task 1 creates and the asset-creation steps in Tasks 4–9.

Plan is complete and internally consistent.
