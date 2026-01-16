import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              compilationMode: 'infer', // Start with safe 'infer' mode
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'hotpot-mp',
      project: 'hotpot-tracker',
      telemetry: false,
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.js.map'],
      },
    }),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
  },
});
