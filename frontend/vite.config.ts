import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BACKEND_URL } from './config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(BACKEND_URL)
  }
})
