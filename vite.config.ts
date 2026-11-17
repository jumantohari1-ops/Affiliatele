import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // sesuaikan dengan plugin kamu
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react()], tailwindcss()],
  base: '/Affiliatele/',
})
