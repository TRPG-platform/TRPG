import type { ReactNode } from 'react';
import './RoomLobbyLayout.css';

// 房間大廳的版面外框，GM（TV-6）和 PL（TV-5）共用。
// 兩種視角只差中間和右邊兩欄：GM 放跑團設定、GM 工具；PL 放角色選擇、GM 公告欄。

interface RoomLobbyLayoutProps {
  /** 左欄：劇本資訊。 */
  scriptInfo: ReactNode;
  /** 上方：標題與房號。 */
  header: ReactNode;
  /** 第二欄：玩家列表。 */
  players: ReactNode;
  /** 第三欄（依視角不同）。 */
  main: ReactNode;
  /** 第四欄（依視角不同）。 */
  aside: ReactNode;
  /** 底部狀態列。 */
  footer: ReactNode;
}

export default function RoomLobbyLayout({
  scriptInfo,
  header,
  players,
  main,
  aside,
  footer,
}: RoomLobbyLayoutProps) {
  return (
    <div className="room-lobby">
      {/* TODO(#6)：換成房間內精簡頂欄（離開鍵、標誌、鈴鐺、頭像），目前只佔位置。 */}
      <div className="room-lobby__compact-header-slot" aria-hidden="true" />
      <main className="room-lobby__body">
        <div className="room-lobby__script">{scriptInfo}</div>
        <div className="room-lobby__header">{header}</div>
        <div className="room-lobby__players">{players}</div>
        <div className="room-lobby__main">{main}</div>
        <div className="room-lobby__aside">{aside}</div>
      </main>
      <div className="room-lobby__footer">{footer}</div>
    </div>
  );
}
