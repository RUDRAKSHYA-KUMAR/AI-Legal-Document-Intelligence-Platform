import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/upload': 'http://localhost:8000',
      '/documents': 'http://localhost:8000',
      '/summary': 'http://localhost:8000',
      '/contract': 'http://localhost:8000',
      '/clause': 'http://localhost:8000',
      '/chat': 'http://localhost:8000',
      '/voice': 'http://localhost:8000',
    }
  }
})
