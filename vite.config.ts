import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "tailwindcss";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["https://431fafcc69f8c5.lhr.life/", ".lhr.life"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
