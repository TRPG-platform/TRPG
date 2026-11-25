import { Link } from 'react-router';

// 登入後首頁的主視覺（Figma TV-2）：比 TV-1 矮、外圍金色細框，內容與 TV-1 相同。
// 右側城堡圖還沒有素材，先用漸層佔位（背景在 CSS 的 .signed-in-hero__art）。

// TODO(room-lobby)：建立房間流程做好後改成開啟建立房間視窗。
const CREATE_ROOM_HREF = '/rooms/new';
// 依 home-and-join-room design.md「搜尋團務先導向加入房間頁」。
const SEARCH_GAMES_HREF = '/join';

export default function SignedInHero() {
  return (
    <section className="signed-in-hero" aria-labelledby="signed-in-hero-title">
      <div className="signed-in-hero__art" aria-hidden="true" />
      <div className="signed-in-hero__content">
        <h1 id="signed-in-hero-title" className="signed-in-hero__title">
          讓每一場冒險，
          <br />
          都有屬於他的舞台。
        </h1>
        <p className="signed-in-hero__subtitle">
          為台灣TRPG玩家打造的線上跑團空間
          <br />
          整合房間、角色卡、擲骰與團務管理，從開團到遊玩，一站完成。
        </p>
        <div className="signed-in-hero__actions">
          <Link className="hero-button hero-button--primary" to={CREATE_ROOM_HREF}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <circle cx="12" cy="4" r="2.4" />
              <circle cx="12" cy="20" r="2.4" />
              <circle cx="4.5" cy="8" r="2.2" />
              <circle cx="19.5" cy="8" r="2.2" />
              <circle cx="4.5" cy="16" r="2.2" />
              <circle cx="19.5" cy="16" r="2.2" />
              <path
                d="M12 6.5v11M6.5 9l11 6M17.5 9l-11 6"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            建立房間
          </Link>
          <Link className="hero-button hero-button--secondary" to={SEARCH_GAMES_HREF}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
              <circle cx="12" cy="7" r="3" />
              <circle cx="5.5" cy="9" r="2.4" />
              <circle cx="18.5" cy="9" r="2.4" />
              <path d="M6.5 20c0-3.6 2.5-6.5 5.5-6.5s5.5 2.9 5.5 6.5z" />
              <path d="M1.5 19c0-2.8 1.8-5 4-5 .8 0 1.5.3 2.1.7-1.2 1.2-2 2.8-2.2 4.3z" />
              <path d="M22.5 19c0-2.8-1.8-5-4-5-.8 0-1.5.3-2.1.7 1.2 1.2 2 2.8 2.2 4.3z" />
            </svg>
            搜尋團務
          </Link>
        </div>
      </div>
    </section>
  );
}
