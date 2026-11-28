import { useCopyToClipboard } from '../useCopyToClipboard';
import LobbyIcon from './LobbyIcon';
import './RoomCodeActions.css';

// 房號與邀請連結複製（room-lobby「Room code and invite link」）：複製後顯示「已複製」2 秒。

interface RoomCodeActionsProps {
  roomCode: string;
}

export default function RoomCodeActions({ roomCode }: RoomCodeActionsProps) {
  const { feedback, copy } = useCopyToClipboard();
  const isCopied = (key: string) => feedback?.key === key && feedback.result === 'copied';

  let message = '';
  if (feedback?.result === 'copied') message = '已複製';
  if (feedback?.result === 'failed') message = '複製失敗，請手動複製';

  return (
    <div className="room-code">
      <div className="room-code__buttons">
        <button
          type="button"
          className="room-code__button room-code__code"
          aria-label={`複製房號 ${roomCode}`}
          onClick={() => copy('code', roomCode)}
        >
          <span className="room-code__label">房號</span>
          <span className="room-code__value">{roomCode}</span>
          <LobbyIcon name={isCopied('code') ? 'check' : 'copy'} size={18} />
        </button>
        <button
          type="button"
          className="room-code__button room-code__link"
          aria-label="複製邀請連結"
          title="複製邀請連結"
          onClick={() => copy('link', `${window.location.origin}/join/${roomCode}`)}
        >
          <LobbyIcon name={isCopied('link') ? 'check' : 'link'} size={18} />
        </button>
      </div>
      <p className="room-code__status" role="status">
        {message}
      </p>
    </div>
  );
}
