import { useEffect, useState } from 'react';
import { getGameRoomPreview, getHealth, getMockPreview } from './data';
import GameRoomPage from './features/game-room/GameRoomPage';

type Status = 'checking' | 'ok' | 'error';

const MESSAGES: Record<Status, string> = {
  checking: '檢查後端連線中…',
  ok: '後端連線 OK',
  error: '後端連線失敗，請確認後端有啟動',
};

const mockPreview = getMockPreview();

export default function App() {
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

  const role = new URLSearchParams(window.location.search).get('game-room');
  const gameRoom = role === 'gm' || role === 'pl' ? getGameRoomPreview() : null;
  if (gameRoom && (role === 'gm' || role === 'pl')) {
    return <GameRoomPage role={role} preview={gameRoom} />;
  }

  return (
    <main>
      <h1>Takoyaki</h1>
      {mockPreview && (
        <p>
          <a href="?game-room=gm">GM 預覽</a> · <a href="?game-room=pl">PL 預覽</a>
        </p>
      )}
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
