import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import './TopNav.css';

export default function HeaderAccountActions() {
  return (
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
