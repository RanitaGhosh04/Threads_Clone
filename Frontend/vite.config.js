import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    port : 3000,

    // Get rid of the CORS error
    proxy: {
			"/api": {
        // target is backend link
				target: "http://localhost:5000",
				changeOrigin: true,

        // because http
				secure: false,
			},
		},
  },
})
