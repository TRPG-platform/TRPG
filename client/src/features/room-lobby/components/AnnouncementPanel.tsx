import type { LobbyAnnouncement } from '../../../data/roomLobby';
import { formatDateTime } from '../lobbyFormat';
import LobbyIcon from './LobbyIcon';
import './AnnouncementPanel.css';

// GM 公告欄（room-lobby「GM announcement」），只顯示不編輯。
// 規格要求所有成員都看得到，之後 GM 端的公告編輯也可以沿用這個顯示。
// 公告是純文字，用 pre-line 保留換行。

interface AnnouncementPanelProps {
  announcement: LobbyAnnouncement | null;
  gmName: string;
  onOpenGuide: (guideUrl: string) => void;
}

export default function AnnouncementPanel({
  announcement,
  gmName,
  onOpenGuide,
}: AnnouncementPanelProps) {
  return (
    <section className="announcement" aria-labelledby="announcement-title">
      <h2 id="announcement-title" className="announcement__title">
        <LobbyIcon name="bolt" size={16} />
        GM 公告欄
      </h2>

      {announcement ? (
        <>
          <div className="announcement__author">
            <span className="announcement__role">GM</span>
            <span>
              <span className="announcement__name">{gmName}</span>
              <time className="announcement__time" dateTime={announcement.updatedAt}>
                {formatDateTime(announcement.updatedAt)}
              </time>
            </span>
          </div>

          <p className="announcement__body">{announcement.body}</p>

          {announcement.guideUrl && (
            <button
              type="button"
              className="announcement__guide"
              onClick={() => onOpenGuide(announcement.guideUrl!)}
            >
              <LobbyIcon name="arrowUpRight" size={16} />
              閱讀團務須知
            </button>
          )}
        </>
      ) : (
        <p className="announcement__empty">GM 還沒有發布公告。</p>
      )}
    </section>
  );
}
