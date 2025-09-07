import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
