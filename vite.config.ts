import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {

    const env = loadEnv(mode, process.cwd(), '');

    return {
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate', // Automatyczna aktualizacja SW w tle
            includeAssets: ['favicon.ico', '/icons/apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Home Storage',
                short_name: 'HomeStorage',
                description: 'App description',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            // --- AUTOMATYCZNE CACHOWANIE API ---
            workbox: {
                runtimeCaching: [
                    {
                        // Dopasuj wzorzec do ścieżki Twojego API (np. zaczynające się od /api/)
                        urlPattern: ({ url }) => env.VITE_API_URL ? url.href.startsWith(env.VITE_API_URL) : false,
                            handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 100, // Maksymalna liczba zapamiętanych zapytań
                                maxAgeSeconds: 60 * 60 * 24 * 7, // Czas przechowywania: 7 dni
                            },
                            cacheableResponse: {
                                statuses: [0, 200], // Zapamiętuje tylko udane odpowiedzi HTTP
                            },
                        },
                    },
                ],
            },
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['**/.vs/**'] // <-- Nakazuje Vite ignorowanie plików Visual Studio
        }
    }
}
})