import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/books': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/courses': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/progress': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/stats': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})

