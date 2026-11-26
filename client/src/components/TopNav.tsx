import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import './TopNav.css';

// 全站頂部導覽列（project-foundation / app-shell「Top navigation bar」，票 #5）。
// 房間以外的每一頁都用這一條；房間內改用精簡頂欄（票 #6，尚未實作）。
//
// 連結都用 React Router 的 <Link>，切換頁面不會整頁重新載入。
// TODO(account-auth)：頭像改用登入使用者的 avatarUrl；「登出」接 POST /api/auth/logout。

const NAV_ITEMS = [
  { id: 'home', label: '首頁', href: '/' },
  { id: 'scripts', label: '劇本管理', href: '/scripts' },
  { id: 'characters', label: '我的角色', href: '/characters' },
  { id: 'resources', label: '教學與資源', href: '/resources' },
] as const;

type NavSection = (typeof NAV_ITEMS)[number]['id'];

/** 依網址判斷目前在哪個區塊；不屬於任何區塊（例如加入房間頁）時回傳 null。 */
function sectionFromPath(pathname: string): NavSection | null {
  const match = NAV_ITEMS.find((item) =>
    item.href === '/'
      ? pathname === '/'
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.id ?? null;
}

interface TopNavProps {
  /** 目前所在區塊；不傳時依網址判斷。 */
  current?: NavSection | null;
  /**
   * 頁面在子畫面（編輯、詳細資訊、新增表單…）時傳入，返回鍵改成執行它，回到該區塊的總覽。
   * 已經在總覽時不要傳，返回鍵就回到上一頁。
   */
  onBack?: () => void;
}

// 返回鍵規則（團隊決定，規格沒有）：
// - 在區塊的子畫面 → 回到該區塊總覽（頁面傳 onBack）
// - 已經在總覽 → 回到上一頁
// - 首頁 / 不顯示返回鍵（除非首頁自己傳了 onBack）
export default function TopNav({ current, onBack }: TopNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const section = current === undefined ? sectionFromPath(pathname) : current;
  const showBack = onBack !== undefined || pathname !== '/';

  // React Router 會在 history.state 記下這是站內第幾頁；idx 為 0 代表直接開這個網址
  // （例如貼上連結），沒有站內上一頁，這時改回首頁，免得離開網站。
  const goBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };

  return (
    <header className="top-nav">
      <div className="top-nav__start">
        {showBack && (
          <button
            type="button"
            className="top-nav__icon top-nav__back"
            aria-label={onBack ? '返回總覽' : '返回上一頁'}
            onClick={goBack}
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
              <path d="M20 12H9" />
              <path d="M13 7l-5 5 5 5" />
            </svg>
          </button>
        )}
        <Link className="top-nav__logo" to="/">
          TAKOYAKI
        </Link>
      </div>
      <nav className="top-nav__items" aria-label="網站導覽">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            className="top-nav__item"
            to={item.href}
            aria-current={item.id === section ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="top-nav__icons">
        <button type="button" className="top-nav__icon" aria-label="通知">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
        <AvatarMenu />
      </div>
    </header>
  );
}

/** 頭像選單：帳號設定、登出（account-auth「Log out」）。 */
function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === 'Escape'
          : !ref.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div className="top-nav__avatar" ref={ref}>
      <button
        type="button"
        className="top-nav__icon"
        aria-label="帳號選單"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 28 28"
          width="28"
          height="28"
          aria-hidden="true"
          className="top-nav__avatar-svg"
        >
          <circle cx="14" cy="14" r="14" className="top-nav__avatar-bg" />
          <circle cx="14" cy="11" r="4.6" className="top-nav__avatar-fg" />
          <path
            d="M5.6 22.6c1.9-3.6 5-5.3 8.4-5.3s6.5 1.7 8.4 5.3"
            className="top-nav__avatar-fg"
          />
        </svg>
      </button>
      {open && (
        <div className="top-nav__menu" role="menu">
          <Link role="menuitem" className="top-nav__menu-item" to="/account">
            帳號設定
          </Link>
          <button
            type="button"
            role="menuitem"
            className="top-nav__menu-item"
            onClick={() => {
              // TODO(account-auth)：呼叫 POST /api/auth/logout 後回首頁。
              setOpen(false);
              navigate('/');
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
