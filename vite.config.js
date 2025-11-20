import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      "/app": {
        target: "http://127.0.0.1:8080/is_lab1-1.0-SNAPSHOT",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
            path.replace(/^\/app/, ""),
      },
      "/ws":{
        target:"ws://127.0.0.1:8080/is_lab1-1.0-SNAPSHOT",
        ws:true,
        changeOrigin:true,
        rewrite: path => path.replace(/^\/ws/, "")
      }
    },
  },
  plugins: [react()],
})
