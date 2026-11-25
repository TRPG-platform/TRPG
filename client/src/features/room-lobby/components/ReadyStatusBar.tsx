import type { ReactNode } from 'react';
import LobbyIcon from './LobbyIcon';
import './ReadyStatusBar.css';

// 房間大廳底部狀態列：已準備人數（只算玩家，不算 GM）。GM 和 PL 共用；
// PL 版（TV-5）把準備按鈕放在 action。

interface ReadyStatusBarProps {
  readyCount: number;
  playerCount: number;
  /** 人數後面的狀態說明，例如「等待GM開始遊戲」。 */
  message: string;
  action?: ReactNode;
}

export default function ReadyStatusBar({
  readyCount,
  playerCount,
  message,
  action,
}: ReadyStatusBarProps) {
  return (
    <section className="ready-bar" aria-labelledby="ready-bar-title">
      <LobbyIcon name="sparkle" size={22} className="ready-bar__icon" />
      <div className="ready-bar__text">
        <h2 id="ready-bar-title" className="ready-bar__title">
          冒險即將開始
        </h2>
        <p className="ready-bar__summary" role="status">
          已準備 {readyCount} / {playerCount} 位玩家 ・ {message}
        </p>
      </div>
      {action && <div className="ready-bar__action">{action}</div>}
    </section>
  );
}
