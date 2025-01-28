import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allow access to the dev server from other devices
    port: 5173, // You can set a specific port if needed
    proxy: {
      "/api": {
        target: "https://shoopers-ecommerce.vercel.app/",
        changeOrigin: true,
      },
    },
  },
});
