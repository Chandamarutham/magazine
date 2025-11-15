import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // The GitHub repo name
  optimizeDeps: {
    include: [
      "@aws-crypto/sha256-browser",
      "@aws-sdk/signature-v4"
    ]
  },
})
