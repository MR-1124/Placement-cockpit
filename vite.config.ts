/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@typeform')) {
              return 'vendor-typeform';
            }
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('dompurify')) {
              return 'vendor-markdown';
            }
            if (id.includes('katex')) {
              return 'vendor-katex';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('\\react\\') || id.includes('\\react-dom\\') || id.includes('/scheduler/') || id.includes('\\scheduler\\')) {
              return 'vendor-react';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api-nvidia': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-nvidia/, ''),
        secure: true,
      },
      '/api-groq': {
        target: 'https://api.groq.com/openai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-groq/, ''),
        secure: true,
      },
      '/api-openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-openai/, ''),
        secure: true,
      },
      '/api-anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-anthropic/, ''),
        secure: true,
      },
      '/api-gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gemini/, ''),
        secure: true,
      },
      '/api-openrouter': {
        target: 'https://openrouter.ai/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-openrouter/, ''),
        secure: true,
      },
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  }
})
