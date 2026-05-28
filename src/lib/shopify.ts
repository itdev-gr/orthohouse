import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const client = createStorefrontApiClient({
  storeDomain: import.meta.env.SHOPIFY_STORE,
  apiVersion: import.meta.env.SHOPIFY_API_VERSION,
  publicAccessToken: import.meta.env.STOREFRONT_TOKEN,
});

/** Exported so the SWR script can talk to the same endpoint. */
export const shopifyConfig = {
  store: import.meta.env.SHOPIFY_STORE,
  token: import.meta.env.STOREFRONT_TOKEN,
  version: import.meta.env.SHOPIFY_API_VERSION,
  primaryDomain: import.meta.env.SHOPIFY_PRIMARY_DOMAIN,
};

// ---------------------------------------------------------------------------
// File-based build cache  (5-day TTL)
// ---------------------------------------------------------------------------

const CACHE_DIR = join(process.cwd(), ".shopify-cache");
const TTL = 5 * 24 * 60 * 60 * 1000; // 5 days in ms

function cacheKey(query: string, variables: Record<string, unknown>): string {
  const hash = createHash("sha256")
    .update(query + JSON.stringify(variables))
    .digest("hex")
    .slice(0, 16);
  return hash;
}

async function cached<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

  const key = cacheKey(query, variables);
  const file = join(CACHE_DIR, `${key}.json`);

  if (existsSync(file)) {
    try {
      const entry = JSON.parse(readFileSync(file, "utf-8"));
      if (Date.now() - entry.timestamp < TTL) {
        return entry.data as T;
      }
    } catch {
      // corrupted file — refetch
    }
  }

  const { data } = await client.request(query, { variables });
  writeFileSync(file, JSON.stringify({ timestamp: Date.now(), data }));
  return data as T;
}

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

/**
 * Paginate a Shopify connection. `extract` pulls the connection object
 * (with `.nodes` and `.pageInfo`) out of the response.
 *
 * Each page is cached independently because the `after` cursor differs.
 */
async function paginate<Node>(
  query: string,
  baseVars: Record<string, unknown>,
  extract: (data: any) => { nodes: Node[]; pageInfo: PageInfo },
  pageSize = 50,
): Promise<Node[]> {
  const all: Node[] = [];
  let after: string | null = null;

  for (;;) {
    const vars = { ...baseVars, first: pageSize, after };
    const data = await cached<any>(query, vars);
    const connection = extract(data);
    all.push(...connection.nodes);
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
  }

  return all;
}

// ---------------------------------------------------------------------------
// GraphQL query constants
// ---------------------------------------------------------------------------

export const PRODUCTS_QUERY = `query Products($first: Int!) {
  products(first: $first) {
    nodes {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage {
        url
        altText
      }
    }
  }
}`;

export const PRODUCT_QUERY = `query ProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    descriptionHtml
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      nodes { url altText }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        sku
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
    collections(first: 10) {
      nodes { handle title }
    }
  }
}`;

export const COLLECTIONS_QUERY = `query Collections {
  collections(first: 50) {
    nodes {
      id
      title
      handle
      description
      image {
        url
        altText
      }
    }
  }
}`;

const COLLECTION_PRODUCTS_PAGINATED = `query CollectionProducts($handle: String!, $first: Int!, $after: String) {
  collection(handle: $handle) {
    id
    title
    handle
    description
    products(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        description
        availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        featuredImage {
          url
          altText
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`;

/** Client-side SWR uses a simpler single-page query (no pagination loop). */
export const COLLECTION_PRODUCTS_QUERY = `query CollectionProducts($handle: String!, $first: Int!, $after: String) {
  collection(handle: $handle) {
    products(first: $first, after: $after) {
      nodes {
        id
        title
        handle
        description
        availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        featuredImage {
          url
          altText
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`;

const ALL_PRODUCTS_PAGINATED = `query AllProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    nodes {
      id
      title
      handle
      description
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage {
        url
        altText
      }
      variants(first: 5) {
        nodes {
          selectedOptions {
            name
            value
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

// ---------------------------------------------------------------------------
// Exported data functions
// ---------------------------------------------------------------------------

export async function getCollections() {
  const data = await cached<any>(COLLECTIONS_QUERY);
  return data?.collections?.nodes ?? [];
}

export async function getCollectionWithProducts(handle: string) {
  // First page gives us the collection metadata + products
  const firstPageData = await cached<any>(COLLECTION_PRODUCTS_PAGINATED, {
    handle,
    first: 50,
    after: null,
  });

  const collection = firstPageData?.collection;
  if (!collection) return { collection: null, products: [] };

  const firstPage = collection.products;
  const products = [...firstPage.nodes];

  // Paginate remaining pages
  let pageInfo = firstPage.pageInfo;
  while (pageInfo.hasNextPage) {
    const pageData = await cached<any>(COLLECTION_PRODUCTS_PAGINATED, {
      handle,
      first: 50,
      after: pageInfo.endCursor,
    });
    const page = pageData.collection.products;
    products.push(...page.nodes);
    pageInfo = page.pageInfo;
  }

  return {
    collection: {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
    },
    products,
  };
}

export async function getProducts(first = 12) {
  const data = await cached<any>(PRODUCTS_QUERY, { first });
  return data?.products?.nodes ?? [];
}

export async function getAllProducts() {
  return paginate<any>(
    ALL_PRODUCTS_PAGINATED,
    {},
    (data) => data.products,
    50,
  );
}

export async function getProductByHandle(handle: string) {
  const data = await cached<any>(PRODUCT_QUERY, { handle });
  return data?.product ?? null;
}

// ---------------------------------------------------------------------------
// Search Overlay — products with compareAtPrice + availability
// ---------------------------------------------------------------------------

const OVERLAY_PRODUCTS_QUERY = `query OverlayProducts($first: Int!) {
  products(first: $first) {
    nodes {
      id
      title
      handle
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage { url altText }
      variants(first: 1) {
        nodes {
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
}`;

export async function getOverlayProducts(first = 20) {
  const data = await cached<any>(OVERLAY_PRODUCTS_QUERY, { first });
  return data?.products?.nodes ?? [];
}

const COLLECTION_PREVIEW_QUERY = `query CollectionPreview($handle: String!, $first: Int!) {
  collection(handle: $handle) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        featuredImage { url altText }
        variants(first: 1) {
          nodes {
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
          }
        }
      }
    }
  }
}`;

export async function getCollectionPreview(handle: string, first = 3) {
  const data = await cached<any>(COLLECTION_PREVIEW_QUERY, { handle, first });
  return data?.collection?.products?.nodes ?? [];
}
