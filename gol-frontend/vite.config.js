import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

isDev = true

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // target: "es2020", // build for recent browsers
    // sourcemap: isDev, // enable source map in dev build
    // publicDir: './static',
    // generate manifest.json in outDir
    manifest: true,
    outDir: '../priv/static',
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/main.js'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
