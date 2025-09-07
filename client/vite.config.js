import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'], // pre-bundle jwt-decode
  },
  base: '/', // important for Netlify deployment
  server: {
    proxy: {
      '/api': {
        target: 'https://sundarban-development-internship-project.onrender.com', // your deployed backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // production build output
  },
});
