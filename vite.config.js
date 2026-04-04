import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pacientes': 'http://localhost:3001',
      '/medicos': 'http://localhost:3001'
    }
  }
})