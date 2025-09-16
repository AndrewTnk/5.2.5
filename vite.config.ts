import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/5.2.5/',
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  // @ts-ignore - vitest config is supported at runtime
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
});
