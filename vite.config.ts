import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import rollupNodePolyfills from 'rollup-plugin-node-polyfills';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'], // Ensure Buffer is properly injected
        }),
        rollupNodePolyfills(), // Add Node.js polyfills for Rollup
      ],
    },
  },
  base: '/mrb/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6', // Alias for buffer
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Use globalThis as a modern global
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Polyfill buffer for esbuild
        }),
      ],
    },
  },
  define: {
    global: 'globalThis', // Ensure global is defined
  },
});
