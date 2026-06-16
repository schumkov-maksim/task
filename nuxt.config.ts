import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["nuxt-auth-utils", "@pinia/nuxt"],
  imports: {
    dirs: ["store"],
  },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    alias: {
      "#prisma": resolve("./lib/generated/prisma"),
    },
  },
});
