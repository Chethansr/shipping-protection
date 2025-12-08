import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public', // Serve public/ in dev, but don't copy to dist/ on build
  build: {
    lib: {
      entry: 'web/index.ts',
      name: 'NarvarShippingProtection',
      fileName: () => 'shipping-protection.js',
      formats: ['iife']
    },
    sourcemap: false,
    target: 'es2019',
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false, // Don't copy public/ to dist/ (only SDK output)
    rollupOptions: {
      output: {
        extend: true
      }
    }
  }
});
