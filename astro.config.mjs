import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  build: { inlineStylesheets: "auto" },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "el"],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite",
    },
    fallback: {
      el: "en",
    },
  },
});
