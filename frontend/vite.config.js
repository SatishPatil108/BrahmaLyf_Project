import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [react(), visualizer({ open: false })],
  server: {
    port: 3002,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom"],
          reduxVendor: ["@reduxjs/toolkit", "react-redux"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
