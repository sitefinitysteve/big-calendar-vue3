import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      rollupTypes: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: "big-calendar-vue3",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "vue",
        "pinia",
        "date-fns",
        "reka-ui",
        "@internationalized/date",
        "@vueuse/core",
        "@vueuse/shared",
        "lucide-vue-next",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "vue-router",
        "vee-validate",
        "@vee-validate/zod",
        "zod",
      ],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: "style.[ext]",
      },
    },
  },
});
