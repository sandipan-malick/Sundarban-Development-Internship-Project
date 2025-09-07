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
        target: 'https://sundarban-development-internship-project.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
