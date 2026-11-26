import { useParams, type RouteObject } from 'react-router';
import GmRoomLobbyPage from './GmRoomLobbyPage';

// 房間大廳（room-lobby）。路由由 client/src/App.tsx 自動收集。
// TODO(#23)：PL 房間大廳合併後，依目前使用者是不是 GM 決定顯示 GM 或 PL 大廳。

function RoomLobbyRoute() {
  const { roomCode = '' } = useParams();
  return <GmRoomLobbyPage roomCode={roomCode} />;
}

export default [{ path: '/rooms/:roomCode', element: <RoomLobbyRoute /> }] satisfies RouteObject[];
