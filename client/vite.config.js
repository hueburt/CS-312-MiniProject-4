import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any /api/* call from React is forwarded to the Express server.
      // Cookies are set on localhost:5173 by the proxy, so sessions work.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false
      }
    }
  }
});