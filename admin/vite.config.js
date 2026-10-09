import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '')

  return {
    base: env.VITE_BASE || '/',
    plugins: [react()],
    resolve: {
      alias: {
        // The website's icon list is shared so the icon picker always matches
        '@site': path.resolve(root, '../src'),
        // Files under @site must use this project's copies of these packages
        'lucide-react': path.resolve(root, 'node_modules/lucide-react'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 5174,
      fs: { allow: ['..'] },
    },
  }
})
