import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    react(),
    adonisjs({
      entrypoints: ['resources/js/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
