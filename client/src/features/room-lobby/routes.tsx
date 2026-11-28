import { useParams, useSearchParams, type RouteObject } from 'react-router';
import GmRoomLobbyPage from './GmRoomLobbyPage';
import PlRoomLobbyPage from './PlRoomLobbyPage';

// 房間大廳（room-lobby）。路由由 client/src/App.tsx 自動收集。
// 預設顯示 GM 大廳；網址加上 ?view=pl 顯示 PL 大廳（例如 /rooms/A7F3K9?view=pl）。
// TODO(account-auth)：有登入狀態後，改成依目前使用者是不是 GM 自動切換，並拿掉 ?view=pl。

function RoomLobbyRoute() {
  const { roomCode = '' } = useParams();
  const [searchParams] = useSearchParams();

  return searchParams.get('view') === 'pl' ? (
    <PlRoomLobbyPage roomCode={roomCode} />
  ) : (
    <GmRoomLobbyPage roomCode={roomCode} />
  );
}

export default [{ path: '/rooms/:roomCode', element: <RoomLobbyRoute /> }] satisfies RouteObject[];
