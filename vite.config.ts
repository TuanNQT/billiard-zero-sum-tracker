import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: "/billiard-zero-sum-tracker/",
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate", // Tự update khi có version mới
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"], // Assets cần cache
        manifest: {
          name: "Billiard Zero-Sum Tracker",
          short_name: "Billiard Tracker",
          description: "Theo dõi điểm billiard zero-sum với bạn bè",
          theme_color: "#000000", // Màu chủ đạo (có thể thay)
          background_color: "#ffffff",
          display: "standalone", // Quan trọng cho cảm giác như app native
          scope: "/billiard-zero-sum-tracker/", // Giới hạn scope
          start_url: "/billiard-zero-sum-tracker/", // Trang mở đầu khi install
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable", // Hỗ trợ adaptive icons
            },
          ],
        },
        // Tùy chọn: Tạo icons tự động từ một file PNG lớn (tốt nhất)
        // devOptions: { enabled: true }  // Bật PWA ở dev mode để test
      }),
    ],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});