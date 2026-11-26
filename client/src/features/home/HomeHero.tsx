import { Link } from 'react-router';
import './HomeHero.css';

const CREATE_ROOM_PATH = '/rooms/new';
const SEARCH_GAMES_PATH = '/games/search';

/** 首頁主視覺區（Figma TV-1） */
export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__backdrop" aria-hidden="true" />

      <div className="home-hero__content">
        <h1 id="home-hero-title" className="home-hero__title">
          讓每一場冒險，
          <br />
          都有屬於他的舞台。
        </h1>
        <p className="home-hero__subtitle">
          為台灣 TRPG 玩家打造的線上跑團空間
          <br />
          整合房間、角色卡、擲骰與團務管理，從開團到遊玩，一站完成。
        </p>
        <div className="home-hero__actions">
          {/* 要登入才能建立房間：#10 的登入檢查做好後，沒登入會被帶到登入頁 */}
          <Link className="home-hero__button home-hero__button--primary" to={CREATE_ROOM_PATH}>
            建立房間
          </Link>
          <Link className="home-hero__button home-hero__button--secondary" to={SEARCH_GAMES_PATH}>
            搜尋團務
          </Link>
        </div>
      </div>
    </section>
  );
}
