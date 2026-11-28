import RoomCodeActions from './RoomCodeActions';
import './RoomLobbyHeader.css';

// 房間大廳標題列：標題、副標、房號與邀請連結，GM 和 PL 共用。

interface RoomLobbyHeaderProps {
  roomCode: string;
}

export default function RoomLobbyHeader({ roomCode }: RoomLobbyHeaderProps) {
  return (
    <header className="room-lobby-header">
      <div>
        <h1 className="room-lobby-header__title">房間大廳</h1>
        <p className="room-lobby-header__subtitle">選擇你的角色，讓故事從此刻展開。</p>
      </div>
      <RoomCodeActions roomCode={roomCode} />
    </header>
  );
}
