// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-highcharts",
  ],
  devServer: {
    host: "localhost",
    port: 3000,
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon-icon.svg" }],
    },
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },
  icon: {
    clientBundle: {
      scan: true,
    },
  },
  ssr: false,
  css: [
    "~/assets/main.css",
    "~/assets/global.scss", // This needs to be explicitly included
  ],
  vite: {
    server: {
      proxy: {
        "/_api": {
          target: "http://localhost:8888",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/_api/, "/api/v1"),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 2. ONLY import variables and mixins here.
          // This makes them available inside every <style lang="scss"> block in your components.
          additionalData:
            '@use "~/assets/colors.scss" as *;@use "~/assets/_mixin.scss" as *;',
        },
      },
    },
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
});
