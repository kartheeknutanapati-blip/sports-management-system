import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api calls to the Express backend
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } }
});
