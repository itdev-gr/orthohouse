# Find Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a "Find Us" page at `/pages/find-us` that matches the layout/design of healthyshoes.com.cy/find-us/, and make the footer "Limassol, Cyprus" text a clickable link to it.

**Architecture:** New Astro page following existing `/pages/pages/*.astro` pattern. Add i18n keys for bilingual support. Modify footer in Layout.astro to wrap the address in a link. Page contains: Google Maps embed, address box, Get Directions links (Google Maps / Waze / 2GIS), opening hours table, call us card, email card.

**Tech Stack:** Astro, CSS (scoped), Google Maps embed iframe, i18n (existing system)

---

### Task 1: Add i18n translation keys

**Files:**
- Modify: `src/i18n/ui.ts:38-39` (EN block) and `src/i18n/ui.ts:135-136` (EL block)

- [ ] **Step 1: Add EN translation keys for the Find Us page**

In `src/i18n/ui.ts`, add these keys after the `"footer.address"` line inside the `en` block:

```typescript
"nav.findUs": "Find Us",
```

And in the same `en` block, after the `"shippingDelivery.title"` key:

```typescript
"findUs.title": "Find Us",
"findUs.subtitle": "Pay us a visit to try how it feels to walk on air!",
"findUs.address.heading": "ADDRESS",
"findUs.address.line1": "Limassol",
"findUs.address.line2": "Cyprus",
"findUs.directions.heading": "GET DIRECTIONS",
"findUs.hours.heading": "OPENING HOURS",
"findUs.hours.closed": "Closed",
"findUs.hours.opensAt": "Opens at 09:00",
"findUs.hours.monday": "Monday",
"findUs.hours.tuesday": "Tuesday",
"findUs.hours.wednesday": "Wednesday",
"findUs.hours.thursday": "Thursday",
"findUs.hours.friday": "Friday",
"findUs.hours.saturday": "Saturday",
"findUs.hours.sunday": "Sunday",
"findUs.callUs": "CALL US",
"findUs.email": "EMAIL",
```

- [ ] **Step 2: Add EL translation keys**

In the `el` block, add matching keys:

```typescript
"nav.findUs": "Βρείτε μας",
```

And after `"shippingDelivery.title"`:

```typescript
"findUs.title": "Βρείτε μας",
"findUs.subtitle": "Επισκεφτείτε μας για να δοκιμάσετε πώς είναι να περπατάτε στον αέρα!",
"findUs.address.heading": "ΔΙΕΥΘΥΝΣΗ",
"findUs.address.line1": "Λεμεσός",
"findUs.address.line2": "Κύπρος",
"findUs.directions.heading": "ΟΔΗΓΙΕΣ",
"findUs.hours.heading": "ΩΡΑΡΙΟ ΛΕΙΤΟΥΡΓΙΑΣ",
"findUs.hours.closed": "Κλειστά",
"findUs.hours.opensAt": "Ανοίγει στις 09:00",
"findUs.hours.monday": "Δευτέρα",
"findUs.hours.tuesday": "Τρίτη",
"findUs.hours.wednesday": "Τετάρτη",
"findUs.hours.thursday": "Πέμπτη",
"findUs.hours.friday": "Παρασκευή",
"findUs.hours.saturday": "Σάββατο",
"findUs.hours.sunday": "Κυριακή",
"findUs.callUs": "ΚΑΛΕΣΤΕ ΜΑΣ",
"findUs.email": "EMAIL",
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): add Find Us page translation keys"
```

---

### Task 2: Create the Find Us page

**Files:**
- Create: `src/pages/pages/find-us.astro`

- [ ] **Step 1: Create the Find Us page file**

Create `src/pages/pages/find-us.astro` with the full page markup. The page layout copies healthyshoes.com.cy/find-us/ exactly:

```astro
---
import Layout from "../../layouts/Layout.astro";
import { pickLang, useTranslations } from "../../i18n/utils";

const lang = pickLang(Astro.currentLocale, Astro.url);
const t = useTranslations(lang);
---

<Layout title={`${t("findUs.title")} – OrthoHouse Cyprus`}>
  <div class="fu-wrapper">

    <!-- Hero -->
    <div class="fu-hero">
      <div class="fu-hero-inner">
        <h1 class="fu-title">{t("findUs.title")}</h1>
        <p class="fu-tagline">{t("findUs.subtitle")}</p>
      </div>
    </div>

    <!-- Main content: map + info -->
    <div class="fu-content">
      <div class="fu-grid">

        <!-- Left: Map -->
        <div class="fu-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.5!2d33.0401!3d34.6841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14e733e1c8e53c69%3A0x0!2sLimassol%2C+Cyprus!5e0!3m2!1sen!2scy!4v1700000000000"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="OrthoHouse Limassol location"
          ></iframe>
        </div>

        <!-- Right: Info cards -->
        <div class="fu-info">

          <!-- Address -->
          <div class="fu-card fu-address-card">
            <div class="fu-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div class="fu-card-body">
              <h2 class="fu-card-heading">{t("findUs.address.heading")}</h2>
              <p class="fu-card-text">
                {t("findUs.address.line1")}<br />
                {t("findUs.address.line2")}
              </p>
            </div>
          </div>

          <!-- Get Directions -->
          <div class="fu-directions">
            <h2 class="fu-section-heading">{t("findUs.directions.heading")}</h2>
            <div class="fu-directions-buttons">
              <a href="https://www.google.com/maps/dir/?api=1&destination=34.6841,33.0401" target="_blank" rel="noopener noreferrer" class="fu-dir-btn fu-dir-google">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Google Maps
              </a>
              <a href="https://waze.com/ul?ll=34.6841,33.0401&navigate=yes" target="_blank" rel="noopener noreferrer" class="fu-dir-btn fu-dir-waze">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Waze
              </a>
            </div>
          </div>

          <!-- Opening Hours -->
          <div class="fu-card fu-hours-card">
            <div class="fu-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div class="fu-card-body">
              <div class="fu-hours-header">
                <h2 class="fu-card-heading">{t("findUs.hours.heading")}</h2>
                <span class="fu-status-badge fu-status-closed">{t("findUs.hours.closed")}</span>
              </div>
              <p class="fu-opens-at">{t("findUs.hours.opensAt")}</p>
              <div class="fu-hours-grid">
                <span class="fu-day">{t("findUs.hours.monday")}</span><span class="fu-time">09:00 – 19:00</span>
                <span class="fu-day">{t("findUs.hours.tuesday")}</span><span class="fu-time">09:00 – 19:00</span>
                <span class="fu-day">{t("findUs.hours.wednesday")}</span><span class="fu-time">09:00 – 19:00</span>
                <span class="fu-day">{t("findUs.hours.thursday")}</span><span class="fu-time">09:00 – 19:00</span>
                <span class="fu-day">{t("findUs.hours.friday")}</span><span class="fu-time">09:00 – 19:00</span>
                <span class="fu-day">{t("findUs.hours.saturday")}</span><span class="fu-time">09:00 – 14:00</span>
                <span class="fu-day fu-day-closed">{t("findUs.hours.sunday")}</span><span class="fu-time fu-time-closed">{t("findUs.hours.closed")}</span>
              </div>
            </div>
          </div>

          <!-- Call Us + Email row -->
          <div class="fu-contact-row">
            <a href="tel:+35725123456" class="fu-contact-card">
              <div class="fu-contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </div>
              <div class="fu-contact-body">
                <h2 class="fu-contact-heading">{t("findUs.callUs")}</h2>
                <span class="fu-contact-value">+357 25 123 456</span>
              </div>
            </a>
            <a href="mailto:info@orthohouse.com.cy" class="fu-contact-card">
              <div class="fu-contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <div class="fu-contact-body">
                <h2 class="fu-contact-heading">{t("findUs.email")}</h2>
                <span class="fu-contact-value">info@orthohouse.com.cy</span>
              </div>
            </a>
          </div>

        </div><!-- /fu-info -->
      </div><!-- /fu-grid -->
    </div><!-- /fu-content -->
  </div>
</Layout>

<style>
  /* ── Hero Banner ── */
  .fu-hero {
    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%);
    padding: 3.5rem 2rem;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    text-align: center;
  }
  .fu-hero-inner {
    max-width: 900px;
    margin: 0 auto;
  }
  .fu-title {
    font-size: 2.6rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.01em;
  }
  .fu-tagline {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.7);
    font-style: italic;
    margin: 0;
  }

  /* ── Wrapper ── */
  .fu-wrapper {
    margin: -2rem 0 0 0;
  }
  .fu-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem;
  }

  /* ── Two-column grid: map left, info right ── */
  .fu-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  /* ── Map ── */
  .fu-map {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    min-height: 520px;
  }
  .fu-map iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 520px;
  }

  /* ── Info panel ── */
  .fu-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* ── Cards (address, hours) ── */
  .fu-card {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  .fu-card-icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    background: #f0f4ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e3a5f;
  }
  .fu-card-body {
    flex: 1;
    min-width: 0;
  }
  .fu-card-heading {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 0.35rem 0;
  }
  .fu-card-text {
    font-size: 0.95rem;
    color: #1a1a1a;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
  }

  /* ── Get Directions ── */
  .fu-directions {
    padding: 0.5rem 0;
  }
  .fu-section-heading {
    font-size: 0.72rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 0.75rem 0;
  }
  .fu-directions-buttons {
    display: flex;
    gap: 0.75rem;
  }
  .fu-dir-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    color: #fff;
    transition: opacity 0.15s, transform 0.15s;
  }
  .fu-dir-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .fu-dir-google {
    background: #1e3a5f;
  }
  .fu-dir-waze {
    background: #33ccff;
    color: #1a1a1a;
  }

  /* ── Opening Hours ── */
  .fu-hours-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
  }
  .fu-status-badge {
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .fu-status-closed {
    background: #fee2e2;
    color: #b91c1c;
  }
  .fu-status-open {
    background: #dcfce7;
    color: #15803d;
  }
  .fu-opens-at {
    font-size: 0.82rem;
    color: #6b7280;
    margin: 0 0 0.85rem 0;
  }
  .fu-hours-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem 1.5rem;
    font-size: 0.88rem;
  }
  .fu-day {
    color: #374151;
    font-weight: 500;
  }
  .fu-time {
    color: #6b7280;
    text-align: right;
  }
  .fu-day-closed {
    color: #9ca3af;
  }
  .fu-time-closed {
    color: #ef4444;
    font-weight: 600;
  }

  /* ── Contact row (Call Us + Email) ── */
  .fu-contact-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .fu-contact-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.1rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .fu-contact-card:hover {
    border-color: #1e3a5f;
    box-shadow: 0 4px 16px rgba(30, 58, 95, 0.1);
    transform: translateY(-2px);
  }
  .fu-contact-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    background: #f0f4ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e3a5f;
  }
  .fu-contact-body {
    flex: 1;
    min-width: 0;
  }
  .fu-contact-heading {
    font-size: 0.68rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 0.2rem 0;
  }
  .fu-contact-value {
    font-size: 0.88rem;
    font-weight: 600;
    color: #1e3a5f;
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .fu-hero {
      padding: 2.5rem 1rem;
    }
    .fu-title { font-size: 1.9rem; }
    .fu-content { padding: 2rem 1rem 3rem; }
    .fu-grid {
      grid-template-columns: 1fr;
    }
    .fu-map {
      min-height: 300px;
    }
    .fu-map iframe {
      min-height: 300px;
    }
    .fu-contact-row {
      grid-template-columns: 1fr;
    }
    .fu-directions-buttons {
      flex-wrap: wrap;
    }
  }
</style>
```

- [ ] **Step 2: Verify the page builds**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build succeeds with no errors referencing find-us.

- [ ] **Step 3: Commit**

```bash
git add src/pages/pages/find-us.astro
git commit -m "feat: create Find Us page with map, address, hours, and contact info"
```

---

### Task 3: Make footer "Limassol, Cyprus" a clickable link

**Files:**
- Modify: `src/layouts/Layout.astro:455-458`

- [ ] **Step 1: Wrap the footer address text in a link**

In `src/layouts/Layout.astro`, find the footer address list item (around line 455-458):

```html
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                {t("footer.address")}
              </li>
```

Replace with:

```html
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                <a href={lp("/pages/find-us")}>{t("footer.address")}</a>
              </li>
```

- [ ] **Step 2: Verify the footer link works**

Run: `npx astro dev` and visit the site footer. Click "Limassol, Cyprus" — it should navigate to `/pages/find-us`.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(footer): make address text link to Find Us page"
```

---

### Task 4: Add "Find Us" to the footer Pages column

**Files:**
- Modify: `src/layouts/Layout.astro:476-486`

- [ ] **Step 1: Add a Find Us link in the footer Pages list**

In `src/layouts/Layout.astro`, find the footer Pages column (around line 476-486). Add a "Find Us" link after the "Working Hours" entry:

After:
```html
              <li><a href={lp("/pages/working-hours")}>{t("nav.workingHours")}</a></li>
```

Add:
```html
              <li><a href={lp("/pages/find-us")}>{t("nav.findUs")}</a></li>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(footer): add Find Us link to pages column"
```

---

### Task 5: Visual QA — verify page matches reference

- [ ] **Step 1: Start dev server and navigate to the Find Us page**

Run: `npx astro dev`
Navigate to: `http://localhost:4321/pages/find-us`

- [ ] **Step 2: Take full-page screenshot and compare with reference**

Compare the page layout against the reference screenshot (`reference-find-us-full.png`):
- Map is on the left, info cards on the right
- Address card has location icon + address text
- Get Directions row has Google Maps + Waze buttons
- Opening Hours shows day/time grid with status badge
- Call Us + Email are side-by-side cards at the bottom
- Footer shows clickable "Limassol, Cyprus" linking to this page

- [ ] **Step 3: Test mobile responsive layout**

Resize browser to 375px width and verify:
- Map stacks above info cards
- Contact cards stack vertically
- All text is readable and buttons are tappable

- [ ] **Step 4: Test Greek version**

Navigate to `/el/pages/find-us` and verify all text is in Greek.
