import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NarvarShippingProtection',
      fileName: () => 'shipping-protection.js',
      formats: ['iife']
    },
    sourcemap: false,
    target: 'es2019',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        extend: true
      }
    }
  }
});
