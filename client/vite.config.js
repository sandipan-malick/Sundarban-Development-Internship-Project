import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jwt-decode'], // ensures jwt-decode is pre-bundled
  },
  base: '/', // important for correct asset paths on Netlify
  server: {
    // local development proxy to backend
    proxy: {
      '/api': {
        target: 'https://sundarban-development-internship-project.onrender.com', // replace with your deployed backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // output directory for production build
  },
});
