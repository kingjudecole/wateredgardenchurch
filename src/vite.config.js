import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ─── GitHub Pages base path ───────────────────────────────────────────────
  // Must match your repo name exactly: https://kingjudecole.github.io/church-website/
  base: '/wateredgardenchurch/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Increase chunk size warning limit — the church app is intentionally rich
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },

  // ─── Dev server ───────────────────────────────────────────────────────────
  server: {
    port: 3000,
    open: true,
  },

  // ─── Preview server (mirrors production base path) ────────────────────────
  preview: {
    port: 4173,
  },
})
