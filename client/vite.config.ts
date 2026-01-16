import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: './',
  plugins: [react()],
  esbuild: {
    // Prevent eval usage that causes CSP errors
    legalComments: 'none',
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 5174, // Set consistent port
    // Ensure proper MIME types and avoid CSP issues
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:*",
    },
  },
})

