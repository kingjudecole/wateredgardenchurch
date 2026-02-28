import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wateredgardenchurch/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
```

5. Click **Commit new file**

---

**STEP 3 — Check your file structure looks like this**

Click **Code** at the top of your repository. You should see these files at the **root level** (not inside any folder):
```
📄 index.html
📄 package.json
📄 vite.config.js
📁 src/
    📄 main.jsx
    📄 WateredGardenChurch.jsx
```

---

**STEP 4 — Now create the automatic builder**

1. Click **Add file** → **Create new file**
2. In the filename box type **exactly**:
```
.github/workflows/deploy.yml
