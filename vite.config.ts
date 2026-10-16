import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    adonisjs({
      entryPoints: ['resources/js/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
