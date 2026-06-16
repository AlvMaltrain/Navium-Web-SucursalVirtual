import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8083',
        changeOrigin: true
      },
      '/api/usuarios': {
        target: 'http://localhost:8083',
        changeOrigin: true
      },
      '/api/bff': {
        target: 'http://localhost:8082',
        changeOrigin: true
      }
    }
  }
})