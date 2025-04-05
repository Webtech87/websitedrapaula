import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // <-- Add this import

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // <-- Add this
    },
  },
  server: {
    proxy: {
      "/api": "https://websitedrapaula-v2.onrender.com",
    },
  },
});