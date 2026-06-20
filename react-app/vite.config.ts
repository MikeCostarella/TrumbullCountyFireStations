import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base must match the GitHub Pages repo path EXACTLY (case-sensitive):
// repo is github.com/MikeCostarella/TrumbullCountyFireStations
//   -> served at /TrumbullCountyFireStations/
export default defineConfig({
  base: '/TrumbullCountyFireStations/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Trumbull County Fire Stations',
        short_name: 'Fire Stations',
        description:
          'Interactive directory of fire and emergency response stations serving Trumbull County, Ohio.',
        theme_color: '#d23b1c',
        background_color: '#f4ede2',
        display: 'standalone',
        scope: '/TrumbullCountyFireStations/',
        start_url: '/TrumbullCountyFireStations/',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  define: {
    // Injected at build time for the "Last updated" stamp.
    // Forced to America/New_York so deployed builds (GitHub UTC servers) show
    // Eastern time, with EDT/EST resolved automatically.
    __BUILD_DATE__: JSON.stringify(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    ),
  },
})
