import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // automatic update
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png", "icons/*"],
      manifest: {
        name: "QSM",
        short_name: "QSM",
        description: "Qsm Urulikkunnu Madrasa App",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*$/, // don't cache APIs
            handler: "NetworkOnly",
            options: { cacheName: "api-cache", expiration: { maxEntries: 0 } },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/, // cache images
            handler: "CacheFirst",
            options: { cacheName: "images-cache", expiration: { maxEntries: 50, maxAgeSeconds: 60*60*24*30 } },
          },
        ],
      },
    }),
  ],
});
