import type { RouteObject } from 'react-router';
import { getGameRoomPreview } from '../../data';
import GameRoomPage from './GameRoomPage';

function PreviewGameRoom({ role }: { role: 'gm' | 'pl' }) {
  const preview = getGameRoomPreview();
  if (!preview) return <p>請以 mock 模式啟動遊戲房預覽。</p>;
  return <GameRoomPage role={role} preview={preview} />;
}

export default [
  { path: '/preview/game-room/gm', element: <PreviewGameRoom role="gm" /> },
  { path: '/preview/game-room/pl', element: <PreviewGameRoom role="pl" /> },
] satisfies RouteObject[];
