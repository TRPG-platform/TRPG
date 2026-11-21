import express from 'express';
import type { HealthResponse } from '@takoyaki/shared';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get('/api/health', (_req, res) => {
  const body: HealthResponse = { ok: true };
  res.json(body);
});

app.listen(PORT, () => {
  console.log(`後端已啟動：http://localhost:${PORT}`);
});
