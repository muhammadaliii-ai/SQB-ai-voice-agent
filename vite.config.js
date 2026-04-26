import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  cacheDir: '.vite-runtime-cache',
  build: {
    outDir: 'dist-check',
    emptyOutDir: false,
  },
})
