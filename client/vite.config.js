import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'], 
  },
  base: '/', 
  server: {
    proxy: {
      '/api': {
        target: 'https://sundarban-development-internship-project.onrender.com', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
