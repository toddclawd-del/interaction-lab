import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/interaction-lab/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate heavy 3D libraries into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // GSAP in its own chunk
          'gsap-vendor': ['gsap'],
          // Framer Motion separate
          'motion-vendor': ['framer-motion'],
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
