import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'hotpot-mp',
      project: 'hotpot-tracker',
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
