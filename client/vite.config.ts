import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveDataSource } from './src/data/config';

// 開發時把 /api 轉給後端（預設 http://localhost:3001）。
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  resolveDataSource(env.VITE_DATA_SOURCE);

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
  };
});
