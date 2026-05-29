import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files (e.g. VITE_API_TOKEN) so the dev proxy can inject the token.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // Proxy API calls to the local CAM service so the SPA talks to it
      // same-origin (no CORS). The client's default base URL is "/api".
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // DEV CONVENIENCE: stamp the current local dev bearer token onto every
          // proxied request, OVERWRITING any token the page already holds. This
          // keeps the API testable from the address bar AND prevents a stale
          // browser tab (with an old token baked in at load) from sending an
          // outdated token. Dev-server only — never part of a production build.
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.VITE_API_TOKEN) {
                proxyReq.setHeader('authorization', `Bearer ${env.VITE_API_TOKEN}`)
              }
            })
          },
        },
      },
    },
  }
})
