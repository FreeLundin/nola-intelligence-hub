import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
      '/layers': 'http://localhost:8000',
      '/telemetry': 'http://localhost:8000',
      '/simulation': 'http://localhost:8000'
    }
  }
})
