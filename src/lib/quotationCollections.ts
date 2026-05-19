/**
 * Collections whose products are NOT sold with a public price.
 * For these, the storefront hides the price and shows the
 * "Contact us for free consultation and quotation" CTA instead
 * (per client remarks 15/5/2026 §5).
 *
 * Includes both the top-level category handles AND every child
 * subcategory handle from menuConfig.ts.
 */
export const QUOTATION_COLLECTION_HANDLES = new Set<string>([
  // Sensory Rooms (top + children)
  "sensory-rooms",
  "sensory-rooms-products",
  "sensory-rooms-solutions",
  // Stair Lifts (single subcategory under Lifting Solutions)
  "stair-lifts-lehner",
]);

/** True when *any* collection on the product is a quote-only one. */
export function isQuotationOnly(
  collectionHandles: ReadonlyArray<string | null | undefined>,
): boolean {
  return collectionHandles.some(
    (h) => !!h && QUOTATION_COLLECTION_HANDLES.has(h),
  );
}
