import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://mern-website-ebon.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://mern-website-ebon.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
