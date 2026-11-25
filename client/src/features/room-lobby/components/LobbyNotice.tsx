import { useEffect } from 'react';
import './LobbyNotice.css';

// 房間大廳的短暫提示，例如「此功能尚未開放」。幾秒後自動消失。

interface LobbyNoticeProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

export default function LobbyNotice({ message, onDismiss, durationMs = 3000 }: LobbyNoticeProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, durationMs]);

  return (
    <div className="lobby-notice" role="status" aria-live="polite">
      {message && <p className="lobby-notice__message">{message}</p>}
    </div>
  );
}
