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
