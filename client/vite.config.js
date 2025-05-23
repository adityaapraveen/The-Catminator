import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/The-Catminator/', // Set base path for GitHub Pages
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://the-catminator.onrender.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
