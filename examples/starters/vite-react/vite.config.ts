import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { rarogPlugin } from '../../tools/vite-plugin-rarog'

export default defineConfig({
  plugins: [
    react(),
    rarogPlugin()
  ],
  server: {
    port: 5173
  }
})
