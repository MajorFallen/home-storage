import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
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
            }
        })
    ],
    server: {
        watch: {
            ignored: ['**/.vs/**'] // <-- Nakazuje Vite ignorowanie plików Visual Studio
        }
    }
})
