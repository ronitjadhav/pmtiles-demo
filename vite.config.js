import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/pmtiles-demo/', // Correct base for GitHub Pages
  build: {
    outDir: 'docs',
    emptyOutDir: true // Ensure old files are cleared during build
  }
});