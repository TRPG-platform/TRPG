import type { ReactNode } from 'react';
import TopNav from '../../../components/TopNav';
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
      {/* 房間內隱藏中間的頁面切換選項，標誌只顯示不能點；保留返回鍵、通知、頭像選單。
          TODO(#6)：精簡頂欄的「離開前確認」完成後，改用 #6 的做法。 */}
      <TopNav hasNavItems={false} hasLogoLink={false} />
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
