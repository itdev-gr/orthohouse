import type { APIRoute } from "astro";
import { getProducts, getCollectionPreview } from "../../lib/shopify";

const NP_TABS = [
  { label: "All",                     handle: "all" },
  { label: "Orthopaedics",            handle: "orthopedic-braces-supports" },
  { label: "Walking Aids",            handle: "walking-aids" },
  { label: "Wheelchairs & Home Care", handle: "wheelchairs-and-home-care-aids" },
  { label: "Comfort & Well Being",    handle: "exercise-and-well-being" },
  { label: "Kybun Shoes",             handle: "kybun-shoes" },
] as const;

function serialize(p: any) {
  const v = p.variants?.nodes?.[0];
  const price = parseFloat(v?.price?.amount ?? p.priceRange?.minVariantPrice?.amount ?? "0");
  const ca    = parseFloat(v?.compareAtPrice?.amount ?? "0");
  const cu    = v?.price?.currencyCode ?? p.priceRange?.minVariantPrice?.currencyCode ?? "EUR";
  return {
    t: p.title, h: p.handle, p: price, ca: ca > price ? ca : 0,
    cu, a: v?.availableForSale ?? true,
    img: p.featuredImage?.url ?? "", alt: p.featuredImage?.altText ?? p.title,
  };
}

export const GET: APIRoute = async () => {
  const products = await getProducts(12);
  const fetches = await Promise.all(
    NP_TABS.slice(1).map(t => getCollectionPreview(t.handle, 20).catch(() => []))
  );

  const raw: Record<string, any[]> = { all: products.slice(0, 20) };
  NP_TABS.slice(1).forEach((t, i) => { raw[t.handle] = fetches[i]; });

  const data = Object.fromEntries(
    Object.entries(raw).map(([k, arr]) => [k, arr.map(serialize)])
  );

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
