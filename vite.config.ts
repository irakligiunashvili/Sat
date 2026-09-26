import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const proxy = {
  '/nominatim': {
    target: 'https://nominatim.openstreetmap.org',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/nominatim/, ''),
    headers: {
      'User-Agent': 'Sat/0.1 (closer to home)',
    },
  },
  '/osrm': {
    target: 'https://router.project-osrm.org',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/osrm/, ''),
  },
}

export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
})
