import { useEffect, useState } from 'react';
import { getHealth, getMockPreview } from './data';

// 前後端連線狀態頁（原本 App.tsx 的內容）。沒有對應頁面的網址會顯示這一頁。

type Status = 'checking' | 'ok' | 'error';

const MESSAGES: Record<Status, string> = {
  checking: '檢查後端連線中…',
  ok: '後端連線 OK',
  error: '後端連線失敗，請確認後端有啟動',
};

const mockPreview = getMockPreview();

export default function StatusPage() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    if (mockPreview) return;

    const controller = new AbortController();
    getHealth(controller.signal)
      .then((body) => setStatus(body.ok === true ? 'ok' : 'error'))
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });

    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>Takoyaki</h1>
      {mockPreview ? (
        <dl>
          <dt>劇本</dt>
          <dd>
            {mockPreview.script.title}（{mockPreview.script.ruleSystem}，
            {mockPreview.script.playerMin}–{mockPreview.script.playerMax} 人，
            {mockPreview.script.sceneCount} 場景）
          </dd>
          <dt>角色</dt>
          <dd>
            {mockPreview.character.name}（{mockPreview.character.occupation}）
          </dd>
          <dt>房號</dt>
          <dd>{mockPreview.room.roomCode}</dd>
        </dl>
      ) : (
        <p>{MESSAGES[status]}</p>
      )}
    </main>
  );
}
