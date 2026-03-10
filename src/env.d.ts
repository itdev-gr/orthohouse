/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STOREFRONT_TOKEN: string;
  readonly SHOPIFY_STORE: string;
  readonly SHOPIFY_API_VERSION: string;
  readonly SHOPIFY_PRIVATE_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
