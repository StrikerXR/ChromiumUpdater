import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Chromium Tracker',
        short_name: 'BuildBot',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#1a73e8',
        icons: [
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Chromium_Logo.svg/192px-Chromium_Logo.svg.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Chromium_Logo.svg/1024px-Chromium_Logo.svg.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https::\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'chromium-tracker-v2',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      registerType: 'autoUpdate',
    }),
  ],
});
