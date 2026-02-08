import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: repo lives at https://emoro.github.io/atlas_inequality/
const base = process.env.GITHUB_PAGES === 'true' ? '/atlas_inequality/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
