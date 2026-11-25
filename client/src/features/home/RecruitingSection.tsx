import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getRecruitingRooms, type RecruitingRoom } from '../../data/recruiting';

// 近期開團（home-page「Upcoming recruiting games」）：最多 4 張卡片，橫向捲動。
// 篩選與排序由 GET /api/rooms/recruiting 在伺服器端做，這裡照回傳順序顯示。

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** 例：11/11（三）20:00 */
function formatSchedule(iso: string): string {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${date.getMonth() + 1}/${date.getDate()}（${WEEKDAYS[date.getDay()]}）${time}`;
}

// TODO(join-room)：加入房間流程做好前，先導向邀請連結的網址。
const joinHref = (roomCode: string) => `/join/${encodeURIComponent(roomCode)}`;

function RecruitingCard({ room }: { room: RecruitingRoom }) {
  const ruleFamily = room.ruleLabel.split(' ')[0];
  const players =
    room.playerMin === room.playerMax
      ? `${room.playerMax} 人`
      : `${room.playerMin}–${room.playerMax} 人`;

  return (
    <Link
      className="recruiting-card"
      to={joinHref(room.roomCode)}
      aria-label={`加入 ${room.title}`}
    >
      <span className="recruiting-card__cover" aria-hidden="true">
        {room.coverUrl && <img src={room.coverUrl} alt="" />}
      </span>
      <span className="recruiting-card__rule">{room.ruleLabel}</span>
      <span className="recruiting-card__body">
        <span className="recruiting-card__title">{room.title}</span>
        <span className="recruiting-card__meta">
          {ruleFamily}｜{room.playStyle}｜{players}
        </span>
        <span className="recruiting-card__footer">
          <span className="recruiting-card__info">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="currentColor">
              <path d="M4 1h1.5v2h5V1H12v2h2v12H2V3h2zm-.5 5v7.5h9V6z" />
            </svg>
            {formatSchedule(room.scheduledAt)}
          </span>
          <span className="recruiting-card__info">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="currentColor">
              <circle cx="8" cy="5" r="2.2" />
              <circle cx="3.5" cy="6.5" r="1.7" />
              <circle cx="12.5" cy="6.5" r="1.7" />
              <path d="M4 14c0-2.6 1.8-4.6 4-4.6s4 2 4 4.6zM.5 13.5c0-2 1.3-3.5 3-3.5.4 0 .8.1 1.1.3-.8.9-1.3 2-1.4 3.2zM15.5 13.5c0-2-1.3-3.5-3-3.5-.4 0-.8.1-1.1.3.8.9 1.3 2 1.4 3.2z" />
            </svg>
            招募中（{room.joinedCount}/{room.maxPlayers}）
          </span>
          {room.tag && <span className="recruiting-card__tag">{room.tag}</span>}
        </span>
      </span>
    </Link>
  );
}

export default function RecruitingSection() {
  const [rooms, setRooms] = useState<RecruitingRoom[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getRecruitingRooms(controller.signal)
      .then(setRooms)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : '讀取近期開團失敗');
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="recruiting" aria-labelledby="recruiting-title">
      <h2 id="recruiting-title" className="recruiting__title">
        近期開團
      </h2>
      {error ? (
        <p className="recruiting__message">{error}</p>
      ) : rooms === null ? (
        <p className="recruiting__message">讀取中…</p>
      ) : rooms.length === 0 ? (
        <div className="recruiting__empty">
          <p className="recruiting__message">目前沒有開團，來當第一個開團的人吧！</p>
          {/* TODO(room-lobby)：建立房間流程做好後改成開啟建立房間視窗。 */}
          <Link className="hero-button hero-button--primary" to="/rooms/new">
            建立房間
          </Link>
        </div>
      ) : (
        <div className="recruiting__row">
          {rooms.map((room) => (
            <RecruitingCard key={room.roomId} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}
