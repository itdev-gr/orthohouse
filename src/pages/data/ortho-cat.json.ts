import type { APIRoute } from "astro";
import { getCollectionPreview } from "../../lib/shopify";

const BODY_HANDLES = [
  "head","cervical","shoulder","thoracic","elbow","upper-limb",
  "wrist-thumb-supports","hand","fingers","lumbar",
  "trunk-lumbar-supports","hip","thigh","lower-limb","knee",
  "knee-braces","calf","ankle","foot","orthopedic-insoles",
] as const;

export const GET: APIRoute = async () => {
  const results = await Promise.all(
    BODY_HANDLES.map(h => getCollectionPreview(h, 9).catch(() => []))
  );

  const data: Record<string, any[]> = {};
  BODY_HANDLES.forEach((h, i) => {
    data[h] = results[i].map((p: any) => {
      const v     = p.variants?.nodes?.[0];
      const price = parseFloat(v?.price?.amount ?? p.priceRange?.minVariantPrice?.amount ?? "0");
      const ca    = parseFloat(v?.compareAtPrice?.amount ?? "0");
      const cu    = v?.price?.currencyCode ?? p.priceRange?.minVariantPrice?.currencyCode ?? "EUR";
      return {
        t:   p.title,
        h:   p.handle,
        p:   price,
        ca:  ca > price ? ca : 0,
        cu,
        a:   v?.availableForSale ?? true,
        img: p.featuredImage?.url ?? "",
        alt: p.featuredImage?.altText ?? p.title,
      };
    });
  });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
