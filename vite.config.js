import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion', 'embla-carousel-react', 'chart.js', 'react-chartjs-2'],
          utils: ['axios', 'clsx', 'tailwind-merge', 'socket.io-client']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})