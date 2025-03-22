/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    
    coverage: {
        enabled: true,
        provider: 'istanbul' ,
        reporter: ['text', 'json', 'html', 'lcov'],
        all: true,
        include: ['app/**/*.{ts,tsx}'], // Files to include
        exclude: ['node_modules', 'test/**/*', 'dist', '*.config.*'], // Excluded files or directories
      },
      setupFiles:"app/tests/setup.ts"
  },
  resolve: {
    alias: {
      '@': '/app', // Ensure this matches your alias for ~/ in Vite
    },
  },
});