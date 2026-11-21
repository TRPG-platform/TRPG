import { useEffect, useState } from 'react';
import type { HealthResponse } from '@takoyaki/shared';

type Status = 'checking' | 'ok' | 'error';

const MESSAGES: Record<Status, string> = {
  checking: '檢查後端連線中…',
  ok: '後端連線 OK',
  error: '後端連線失敗，請確認後端有啟動',
};

export default function App() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? (res.json() as Promise<HealthResponse>) : null))
      .then((body) => setStatus(body?.ok === true ? 'ok' : 'error'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main>
      <h1>Takoyaki</h1>
      <p>{MESSAGES[status]}</p>
    </main>
  );
}
